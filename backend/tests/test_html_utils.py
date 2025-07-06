from llm_utils import _html_to_text

def test_html_to_text_basic():
    html = '<h1>Hello</h1><p>World</p>'
    assert _html_to_text(html) == 'Hello World'
