import uuid
import os
from typing import List, Dict, Any, Optional

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_core.tools import tool
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from rank_bm25 import BM25Okapi

class RAGCore:
    def __init__(self, persist_directory: str = "./chroma_db"):
        self.persist_directory = persist_directory
        # Ensure OpenAI API key is available in environment environment
        
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0)
        
        self.vector_store = None
        self.bm25_index = None
        
        # In-memory storage for this session
        self.chunks: List[Document] = []
        self.chunk_map: Dict[str, Document] = {} 
        self.doc_id: Optional[str] = None
        
        self.agent_executor = None
        
    def _count_tokens(self, text: str) -> int:
        return len(text.split()) # Rough approximation for now
        


    def ingest_document(self, file_path: str) -> str:
        """
        Ingests a PDF document, splits it, and builds indices.
        Returns the document ID.
        """
        self.doc_id = str(uuid.uuid4())
        
        # 1. Load PDF
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        
        # 2. Split
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            add_start_index=True
        )
        splits = text_splitter.split_documents(docs)
        
        # Add metadata to all splits
        self.chunks = []
        self.chunk_map = {}
        for split in splits:
            chunk_id = str(uuid.uuid4())
            split.metadata["doc_id"] = self.doc_id
            split.metadata["chunk_id"] = chunk_id
            self.chunks.append(split)
            self.chunk_map[chunk_id] = split
            
        # 3. Vector Index (Chroma)
        # We start a fresh collection for each upload in this simple benchmark
        self.vector_store = Chroma.from_documents(
            documents=self.chunks,
            embedding=self.embeddings,
            collection_name=f"collection_{self.doc_id}",
            persist_directory=self.persist_directory
        )
        
        # 4. Keyword Index (BM25)
        # Tokenize for BM25
        tokenized_corpus = [doc.page_content.lower().split() for doc in self.chunks]
        self.bm25_index = BM25Okapi(tokenized_corpus)
        
        # 5. Initialize Agent with tools
        self._initialize_agent()
        
        return self.doc_id

    def standard_rag(self, query: str) -> Dict[str, Any]:
        """
        Performs standard RAG: Retrieve Top-K -> Generate.
        """
        if not self.vector_store:
            return {"error": "Index not found. Upload a document first."}
            
        # Retrieve
        retriever = self.vector_store.as_retriever(search_kwargs={"k": 5})
        docs = retriever.invoke(query)
        
        # Format context
        context = "\n\n".join([d.page_content for d in docs])
        
        # Generate
        messages = [
            ("system", "You are a helpful assistant. Answer the question based ONLY on the provided context."),
            ("human", f"Context:\n{context}\n\nQuestion: {query}")
        ]
        
        import time
        start_time = time.time()
        
        response = self.llm.invoke(messages)
        end_time = time.time()
        
        tokens = self._count_tokens(context) + self._count_tokens(query) + self._count_tokens(response.content)
        
        return {
            "answer": response.content,
            "metrics": {
                "retrieved_docs": len(docs),
                "steps": 1,
                "latency": round(end_time - start_time, 2),
                "tokens": tokens
            }
        }

    def _initialize_agent(self):
        tools = self.get_agent_tools()
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an advanced researcher agent. You have access to a document. "
                       "Use your tools to find information and answer the user's question. "
                       "You can search for keywords, do semantic search, and read specific chunks. "
                       "Always verify your information before answering."),
            ("user", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])
        
        agent = create_openai_tools_agent(self.llm, tools, prompt)
        self.agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, return_intermediate_steps=True)

    def get_agent_tools(self):
        # Define tools that access self state
        
        @tool
        def tool_keyword_search(query: str) -> str:
            """Useful for finding specific terms or exact matches in the document."""
            if not self.bm25_index: return "Index not ready."
            tokenized = query.lower().split()
            # rank_bm25 returns the docs, not scores, with get_top_n
            results = self.bm25_index.get_top_n(tokenized, self.chunks, n=3)
            return "\n\n".join([f"[ChunkID: {doc.metadata['chunk_id']}] {doc.page_content}" for doc in results])

        @tool
        def tool_semantic_search(query: str) -> str:
            """Useful for finding conceptually related sections."""
            if not self.vector_store: return "Index not ready."
            results = self.vector_store.similarity_search(query, k=3)
            return "\n\n".join([f"[ChunkID: {doc.metadata['chunk_id']}] {doc.page_content}" for doc in results])

        @tool
        def tool_read_chunk(chunk_id: str) -> str:
            """Reads the full content of a specific chunk by its ID."""
            doc = self.chunk_map.get(chunk_id)
            if doc:
                return doc.page_content
            return "Chunk not found."
            
        return [tool_keyword_search, tool_semantic_search, tool_read_chunk]

    def run_agentic_rag(self, query: str) -> Dict[str, Any]:
        if not self.agent_executor:
            return {"error": "Agent not initialized. Upload a document first."}
            
        import time
        start_time = time.time()
        
        result = self.agent_executor.invoke({"input": query})
        end_time = time.time()
        
        # Extract metrics (rough approximation)
        steps = len(result.get("intermediate_steps", []))
        
        # Count tokens from intermediate steps + output
        token_text = result["output"]
        for step in result.get("intermediate_steps", []):
             # step is tuple (Action, Observation)
             token_text += str(step[0]) + str(step[1])
             
        tokens = self._count_tokens(token_text)
        
        return {
            "answer": result["output"],
            "metrics": {
                "steps": steps,
                "intermediate_steps": str(result.get("intermediate_steps", [])),
                "latency": round(end_time - start_time, 2),
                "tokens": tokens
            }
        }
