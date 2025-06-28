from backend.llm_utils import _cosine_sim 
# from llm_utils import _cosine_sim 
#unit testing (starting at llm_utils)-- you must do pip install pytest if you haven't yet
#test highlight profile similarity function


#WILL PROLLY DELETE THIS FILE
def test_cosine_sim():
    a = [1, 0, 0]
    b = [1, 0, 0]
    assert _cosine_sim(a, b) == 1.0

def test_cosine_sim_opposite():
    a = [1, 0]
    b = [-1, 0]
    assert round(_cosine_sim(a, b), 2) == -10.0
