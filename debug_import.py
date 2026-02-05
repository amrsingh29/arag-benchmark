import sys
print(f"Python Executable: {sys.executable}")
print(f"Python path: {sys.path}")
try:
    import graphlib
    print("Successfully imported graphlib")
except ImportError as e:
    print(f"Failed to import graphlib: {e}")
except OSError as e:
    print(f"OSError importing graphlib: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
