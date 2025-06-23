import os, sqlite3, uuid, json
import pytest

from embeddings_db import (
    DB_PATH,
    get_embedding_from_db,
    save_embedding_to_db
)

# Before each test, remove any previous rows under the random test key
@pytest.fixture(autouse=True)
def clean_db():
    conn = sqlite3.connect(DB_PATH)
    yield
    conn.close()

def test_save_and_get_embedding():
    test_key = f'pytest_key_{uuid.uuid4()}'

    # Ensure there are no preexisting entries containing our test key
    conn = sqlite3.connect(DB_PATH)
    conn.execute("DELETE FROM embeddings WHERE text = ?", (test_key,))
    conn.commit()
    conn.close()

    # Initially, we should get None because we just cleared all entries containing our test key
    assert get_embedding_from_db(test_key) is None

    test_embedding = [0.1, -0.2, 3.14159]
    save_embedding_to_db(test_key, test_embedding)

    fetched_embedding = get_embedding_from_db(test_key)
    assert isinstance(fetched_embedding, list)
    assert fetched_embedding == test_embedding

def test_overwrite_embedding():
    test_key = f'pytest_key_{uuid.uuid4()}'
    conn = sqlite3.connect(DB_PATH)
    conn.execute("DELETE FROM embeddings WHERE text = ?", (test_key,))
    conn.commit()
    conn.close()

    first_emb = [1.0, 2.0, 3.0]
    second_emb = [4.0, 5.0, 6.0]

    save_embedding_to_db(test_key, first_emb)
    assert get_embedding_from_db(test_key) == first_emb

    # Overwrite the first embedding with the second
    save_embedding_to_db(test_key, second_emb)
    assert get_embedding_from_db(test_key) == second_emb




