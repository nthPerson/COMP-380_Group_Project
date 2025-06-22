import os
import sqlite3
import json
from threading import Lock

# Path to the embeddings database
DB_PATH = os.path.join(os.path.dirname(__file__), "data/embeddings.db")

# Future-proofing: ensure thread safety if we ever call this stuff concurrently
_db_lock = Lock()
_conn = sqlite3.connect(DB_PATH, check_same_thread=False)
_conn.execute("""
  CREATE TABLE IF NOT EXISTS embeddings (
    text       TEXT PRIMARY KEY,
    embedding  TEXT NOT NULL
  )
""")
_conn.commit()

# Return the stored embedding for given text, or None if it doesn't exist in the db
def get_embedding_from_db(text: str) -> list[float] | None:
    with _db_lock:
        current = _conn.execute("SELECT embedding FROM embeddings WHERE text = ?", (text,))
        row = current.fetchone()
    if row:
        return json.loads(row[0])
    return None

# Save an embedding to the database
def save_embedding_to_db(text: str, embedding: list[float]) -> None:
    payload = json.dumps(embedding)
    with _db_lock:
        _conn.execute(
          "INSERT OR REPLACE INTO embeddings (text, embedding) VALUES (?, ?)",
          (text, payload)
        )
        _conn.commit()



#testing the functions
if __name__ == "__main__":
    #sample test data
    sample_text = "hello world"
    sample_embedding = [0.1,0.2,0.3] #example embedding

    #save the embedding
    save_embedding_to_db(sample_text, sample_embedding)

    #retrieve the embedding
    result = get_embedding_from_db(sample_text)
    print("Retrieved embedding: ", result)

    #multiple embeddings
    save_embedding_to_db("cat", [0.5, 0.2, 0.8])
    save_embedding_to_db("dog", [0.1, 0.9, 0.3])
    print("Cat embedding:", get_embedding_from_db("cat"))
    print("Dog embedding:", get_embedding_from_db("dog"))

    #overwrite test
    save_embedding_to_db("cat", [1.0,1.0,1.0])
    print("Cat embedding after overwrite:", get_embedding_from_db("cat"))

    #query non-existing embedding
    print("Unicorn embedding(should be None): ", get_embedding_from_db("unicorn"))

# #print everything in the embeddings table
#     def print_all_rows():
#         with _db_lock:
#             cursor = _conn.execute("SELECT * FROM embeddings") #this is sql command
#             rows = cursor.fetchall()
#             print("\n All rows in the embeddings table: ")
#             for row in rows:
#                  print(f"Text: {row[0]} | Embedding: {row[1]}") #loops through each row and prints test (input string) and embedding (stored as a JSON string)

def print_all_rows():
    with _db_lock:
        cursor = _conn.execute("SELECT text, embedding FROM embeddings")
        rows = cursor.fetchall()

    print("\nAll rows in the embeddings table (first element only):")
    for text, embedding_json in rows:
        # parse the JSON string back into a Python list
        embedding = json.loads(embedding_json)
        # guard against empty embeddings
        first_value = embedding[0] if embedding else None
        print(f"Text: {text} | First embedding value: {first_value}")

#call the function here
    print_all_rows()
