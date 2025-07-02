from flask import jsonify

ROUTES = [
    ("/api/jd", "handle_jd_text", "post", {"jd": "foo"}),
    ("/api/jd_from_url", "handle_jd_from_url", "post", {"url": "http://example"}),
    ("/api/upload_pdf", "upload_user_pdf", "post", {}),
    ("/api/list_pdfs", "list_user_pdfs", "get", None),
    ("/api/delete_pdf", "delete_user_pdf", "post", {}),
    ("/api/set_master_pdf", "set_master_pdf", "post", {}),
    ("/api/get_master_pdf", "get_master_pdf", "get", None),
    ("/api/get_resume_url", "generate_pdf_link", "get", None),
    ("/api/extract_resume_profile_llm", "extract_resume_profile_llm", "post", {}),
    ("/api/extract_jd_profile_llm", "extract_jd_profile_llm", "post", {"jd": ""}),
    ("/api/selected_keywords/get", "get_keywords", "get", None),
    ("/api/selected_keywords/add", "add_keywords", "post", {}),
    ("/api/selected_keywords/remove", "remove_keyword", "post", {}),
    ("/api/selected_keywords/clear", "clear_keywords", "post", {}),
    ("/api/save_resume", "save_resume_data", "post", {}),
    ("/api/generate_targeted_resume", "generate_targeted_resume_html", "post", {}),
    ("/api/save_generated_resume", "save_generated_resume", "post", {}),
    ("/api/download_pdf_text", "_download_pdf_as_text", "post", {}),
    ("/api/similarity_score", "compute_similarity_scores", "post", {}),
    ("/api/highlight_similarity", "highlight_profile_similarity", "post", {}),
    ("/api/update_profile", "upload_profile_picture", "post", {}),
    ("/api/get_profile", "get_user_profile", "get", None),
]


def test_all_routes(monkeypatch):
    import app as backend_app

    for route, func_name, method, payload in ROUTES:
        if func_name == "_download_pdf_as_text":
            monkeypatch.setattr(backend_app, func_name, lambda *a, **k: "text")
        else:
            monkeypatch.setattr(backend_app, func_name, lambda *a, **k: (jsonify({"called": func_name}), 200))
        client = backend_app.app.test_client()
        headers = {"Authorization": "Bearer fake"}
        if method == "post":
            resp = client.post(route, json=payload, headers=headers)
        else:
            resp = client.get(route, query_string=payload or {}, headers=headers)
        assert resp.status_code == 200
        if func_name == "_download_pdf_as_text":
            assert resp.get_json() == {"pdf_text": "text"}
        else:
            assert resp.get_json() == {"called": func_name}