import os
import json
import uuid
from threading import Lock

FILE_PATH = os.path.join(os.path.dirname(__file__), 'data', 'job_descriptions.json')
_lock = Lock()


def _load():
    if not os.path.exists(FILE_PATH):
        with open(FILE_PATH, 'w') as f:
            json.dump({'jds': [], 'active': None}, f)
    with open(FILE_PATH, 'r') as f:
        return json.load(f)


def _save(data):
    with open(FILE_PATH, 'w') as f:
        json.dump(data, f, indent=2)


def add_job_description(title: str, text: str) -> dict:
    with _lock:
        data = _load()
        jd = {'id': str(uuid.uuid4()), 'title': title, 'text': text}
        data['jds'].append(jd)
        _save(data)
        return jd


def list_job_descriptions() -> list:
    with _lock:
        data = _load()
        return data.get('jds', [])


def set_active_jd(jd_id: str) -> dict | None:
    """Set the active job description ID and return the JD object."""
    with _lock:
        data = _load()
        jd = next((j for j in data.get('jds', []) if j['id'] == jd_id), None)
        data['active'] = jd_id if jd else None
        _save(data)
        return jd


def get_active_jd() -> str | None:
    with _lock:
        data = _load()
        return data.get('active')


def get_job_description(jd_id: str) -> dict | None:
    """Return the job description with the given ID if it exists."""
    with _lock:
        data = _load()
        for jd in data.get('jds', []):
            if jd['id'] == jd_id:
                return jd
    return None


def delete_job_description(jd_id: str):
    """Delete a job description by ID and clear active if needed."""
    with _lock:
        data = _load()
        data['jds'] = [jd for jd in data.get('jds', []) if jd['id'] != jd_id]
        if data.get('active') == jd_id:
            data['active'] = None
        _save(data)
