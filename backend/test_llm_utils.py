from llm_utils import highlight_similarity_raw

def test_highlight_similarity_basic():
    resume_items = ["python", "sql"]
    jd_items = ["python", "c++"]

    matched_resume, matched_jd = highlight_similarity_raw(resume_items, jd_items)

    assert matched_resume == [True, False]  # 'python' matched, 'sql' did not
    assert matched_jd == [True, False]      # 'python' matched, 'c++' did not
