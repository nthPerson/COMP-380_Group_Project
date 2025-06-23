from llm_utils import highlight_similarity_raw

def test_highlight_similarity_basic():
    resume_items = ["python", "sql"]
    jd_items = ["python", "c++"]

    matched_resume, matched_jd = highlight_similarity_raw(resume_items, jd_items)

    assert matched_resume == [True, False]  # 'python' matched, 'sql' did not
    assert matched_jd == [True, False]      # 'python' matched, 'c++' did not

# def test_highlight_similarity_db(res_list: list[str], jd_list: list[str]):
#     pass

if __name__ == "__main__":
    test_highlight_similarity_basic()
    resume_list_literal_match = ["python", "sql"]
    jd_list_literal_match = ["python", "c++"]

    resume_list_semantic_match = ["programming", "customer service"]
    jd_list_semantic_match = ["coding", "serving customers"]

