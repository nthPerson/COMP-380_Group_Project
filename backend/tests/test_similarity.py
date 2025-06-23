import pytest

from llm_utils import highlight_similarity_raw

def test_identical_items_match_default_threshold():
    resume_mask, jd_mask = highlight_similarity_raw(["apple"], ["apple"])
    # identical string → cosine_sim = 1.0 → >= default 0.7
    assert resume_mask == [True]
    assert jd_mask     == [True]

def test_threshold_boundary_above_one():
    # identical string gives cosim==1.0
    ok_low, _ = highlight_similarity_raw(["apple"], ["apple"], threshold=1.0)
    assert ok_low == [True]

    # threshold >1.0 makes even identical fail
    ok_high, _ = highlight_similarity_raw(["apple"], ["apple"], threshold=1.01)
    assert ok_high == [False]

def test_unrelated_items_never_match():
    resume_mask, jd_mask = highlight_similarity_raw(["apple"], ["banana"])
    assert resume_mask == [False]
    assert jd_mask     == [False]

def test_synonym_pair_matches_only_at_low_threshold():
    # "software development" vs "programming"
    resume  = ["software development"]
    jd      = ["programming"]

    # at a low threshold, expect a match
    low_mask, _ = highlight_similarity_raw(resume, jd, threshold=0.2)
    assert low_mask == [True]

    # at a strict threshold, should not match
    high_mask, _ = highlight_similarity_raw(resume, jd, threshold=0.9)
    assert high_mask == [False]