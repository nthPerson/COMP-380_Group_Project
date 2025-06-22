import { auth } from "../firebase";


export async function getSelectedKeywords() {
    const idToken = await auth.currentUser.getIdToken();
    const res = await fetch("http://localhost:5001/api/selected_keywords/get", {
        headers: { Authorization: `Bearer ${idToken}` }
    });
    if (!res.ok) throw new Error(await res.text());
    const responseData = await res.json();
    return responseData.keywords;
}


export async function addSelectedKeywords(keywords) {
    const idToken = await auth.currentUser.getIdToken();
    const res = await fetch("http://localhost:5001/api/selected_keywords/add", {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
     },
        body: JSON.stringify({ keywords }),
    });
    if (!res.ok) throw new Error(await res.text());
    const responseData = await res.json();
    return responseData.keywords;
}


export async function removeSelectedKeyword(keyword) {
    const idToken = await auth.currentUser.getIdToken();
    const res = await fetch("http://localhost:5001/api/selected_keywords/remove", {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
     },
        body: JSON.stringify({ keyword }),
    });
    if (!res.ok) throw new Error(await res.text());
    const responseData = await res.json();
    return responseData.keywords;
}


export async function clearKeywords() {
    const idToken = await auth.currentUser.getIdToken();
    const res = await fetch("http://localhost:5001/api/selected_keywords/clear", {
        headers: { Authorization: `Bearer ${idToken}` }
    });
    if (!res.ok) throw new Error(await res.text());
    const responseData = await res.json();
    return responseData.keywords;
}


export async function fetchHighlights(resumeItems, jdItems) {
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch("http://localhost:5001/api/highlight_similarity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`
    },
    body: JSON.stringify({ resume_items: resumeItems, jd_items: jdItems })
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // { matched_resume: [...], matched_jd: [...] }
}
