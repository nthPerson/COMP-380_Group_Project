#!/usr/bin/env python3
import sqlite3, json
from embeddings_db import DB_PATH

def main():
    conn = sqlite3.connect(DB_PATH)
    for key, emb_json in conn.execute("SELECT text, embedding FROM embeddings"):
        vec = json.loads(emb_json)
        # print only the first element + ellipsis
        print(f'"{key}": [{vec[0]:.12f} ...]')
    conn.close()

if __name__ == "__main__":
    main()