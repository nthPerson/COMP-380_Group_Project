import unittest
from unittest.mock import patch, MagicMock
from app import app


class TestPostProfile(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.headers = {"Authorization": "Bearer mock_token"}
        self.payload = {
            "name": "Juan",
            "education": "CSUN",
            "experience": "Intern at NAVFAC",
        }

    @patch("firebase_admin.auth.verify_id_token")
    @patch("firebase_config.db.collection")
    def test_post_profile_success(self, mock_collection, mock_verify_token):
        mock_verify_token.return_value = {"uid": "test_uid"}
        mock_doc_ref = MagicMock()
        mock_collection.return_value.document.return_value = mock_doc_ref

        response = self.client.post(
            "/api/update_profile", json=self.payload, headers=self.headers
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("Profile updated", response.get_data(as_text=True))

    @patch("firebase_admin.auth.verify_id_token")
    def test_post_profile_missing_token(self, mock_verify_token):
        response = self.client.post("/api/update_profile", json=self.payload)
        self.assertEqual(response.status_code, 401)

    @patch("firebase_admin.auth.verify_id_token")
    def test_post_profile_missing_fields(self, mock_verify_token):
        mock_verify_token.return_value = {"uid": "test_uid"}
        incomplete_payload = {"name": "Juan"}
        response = self.client.post(
            "/api/update_profile", json=incomplete_payload, headers=self.headers
        )
        self.assertEqual(response.status_code, 400)

    @patch(
        "firebase_admin.auth.verify_id_token", side_effect=Exception("Invalid token")
    )
    def test_post_profile_invalid_token(self, mock_verify_token):
        response = self.client.post(
            "/api/update_profile", json=self.payload, headers=self.headers
        )
        self.assertEqual(response.status_code, 401)

    @patch("firebase_admin.auth.verify_id_token")
    @patch("firebase_config.db.collection")
    def test_get_profile_success(self, mock_collection, mock_verify_token):
        mock_verify_token.return_value = {"uid": "test_uid"}
        mock_doc = MagicMock()
        mock_doc.exists = True
        mock_doc.to_dict.return_value = {"name": "Juan"}
        mock_collection.return_value.document.return_value.collection.return_value.document.return_value.get.return_value = (
            mock_doc
        )

        response = self.client.get("/api/get_profile", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Juan", response.get_data(as_text=True))


if __name__ == "__main__":
    unittest.main()
