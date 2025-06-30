// frontend/src/services/profileService.js
import { auth } from "../firebase";

const API_BASE = "http://localhost:5001/api";

async function authorizedFetch(url, options = {}) {
  const idToken = await auth.currentUser.getIdToken();
  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${idToken}`,
  };
  return fetch(url, options);
}

/**
 * Uploads profile picture + metadata in one multipart/form-data request.
 * fields: { file?: File, username?: string, email?: string }
 */
export async function updateProfile({ file, username, email }) {
  const form = new FormData();
  if (file)     form.append("profile_picture", file);
  if (username) form.append("username", username);
  if (email)    form.append("email", email);

  const res = await authorizedFetch(`${API_BASE}/update_profile`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export async function getProfile() {
  const res = await authorizedFetch(`${API_BASE}/get_profile`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json(); // { username, email, photoURL }
}
