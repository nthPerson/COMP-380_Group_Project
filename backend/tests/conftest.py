import os, sys
import types
import pytest
from dotenv import load_dotenv
import openai
   
load_dotenv()
openai.api_key = os.getenv("OPENAI_GROUP_PROJECT_KEY")
EMBED_MODEL = "text-embedding-3-small"  # 1,536 dimensional vector


# Add the parent folder (i.e. "backend/") onto the import path
HERE = os.path.dirname(__file__)
BACKEND_ROOT = os.path.abspath(os.path.join(HERE, os.pardir))
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)


@pytest.fixture(autouse=True)
def stub_dependencies(monkeypatch):
    monkeypatch.setenv('GEMINI_API_KEY', 'dummy')
    monkeypatch.setenv('OPENAI_API_KEY', 'dummy')

    sys.modules['firebase_config'] = types.SimpleNamespace(db=object(), bucket=object())

    embedding_index = {}
    def fake_create(input=None, model=None):
        text = input[0] if isinstance(input, list) else input
        if text not in embedding_index:
            vec = [0.0]*8
            idx = len(embedding_index) % 8
            vec[idx] = 1.0
            embedding_index[text] = vec
        return types.SimpleNamespace(data=[types.SimpleNamespace(embedding=embedding_index[text])])

    dummy_openai = types.SimpleNamespace(
        embeddings=types.SimpleNamespace(create=fake_create),
        chat=types.SimpleNamespace(completions=types.SimpleNamespace(create=lambda *a, **k: types.SimpleNamespace(choices=[types.SimpleNamespace(message=types.SimpleNamespace(content="hi"))])))
    )
    sys.modules['openai'] = dummy_openai

    sys.modules['ScraplingScraper'] = types.SimpleNamespace(scrape=lambda url: "text")

    class DummyGen:
        def __init__(self, model_name=None):
            pass
        def generate_content(self, text):
            return types.SimpleNamespace(text="ok")
    sys.modules['google.generativeai'] = types.SimpleNamespace(configure=lambda api_key=None: None, GenerativeModel=lambda model_name: DummyGen())

    # stub reportlab modules used in resume_utils
    rl = types.ModuleType('reportlab')
    plat = types.ModuleType('reportlab.platypus')
    class Dummy:        
        def __init__(self, *a, **k):
            pass
    plat.SimpleDocTemplate = Dummy
    plat.Paragraph = Dummy
    plat.Spacer = Dummy
    plat.ListFlowable = Dummy
    plat.ListItem = Dummy
    lib = types.ModuleType('reportlab.lib')
    lib_pagesizes = types.ModuleType('reportlab.lib.pagesizes')
    lib_pagesizes.letter = (8.5, 11)
    lib_styles = types.ModuleType('reportlab.lib.styles')
    lib_styles.getSampleStyleSheet = lambda: {}
    sys.modules['reportlab'] = rl
    sys.modules['reportlab.platypus'] = plat
    sys.modules['reportlab.lib'] = lib
    sys.modules['reportlab.lib.pagesizes'] = lib_pagesizes
    sys.modules['reportlab.lib.styles'] = lib_styles

    import types as _t
    dummy_db = _t.ModuleType('embeddings_db')
    dummy_db.DB_PATH = 'dummy'
    dummy_db.get_embedding_from_db = lambda text: None
    dummy_db.save_embedding_to_db = lambda text, emb: None
    sys.modules['embeddings_db'] = dummy_db

    yield

    for mod in ['firebase_config','openai','ScraplingScraper','google.generativeai','embeddings_db','reportlab','reportlab.platypus','reportlab.lib','reportlab.lib.pagesizes','reportlab.lib.styles']:
        sys.modules.pop(mod, None)

@pytest.fixture(autouse=True)
def fake_auth(monkeypatch):
    import verify_token
    monkeypatch.setattr(verify_token.auth, 'verify_id_token', lambda t: {'uid':'user'})
    yield




