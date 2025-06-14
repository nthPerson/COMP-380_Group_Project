
export async function sendJobDescription(jdText, idToken) {
    try {
        //actual API Call to the local server 
      const response = await fetch('http://localhost:5001/api/jd', {
        method: 'POST', //this indicates that we are sending data
        headers: {
            // this is the type of thing we are sending 
          'Content-Type': 'application/json',
          //this is where we send the token to varify in the backend 
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ jd: jdText }),
      });
      
      // if the response is not ok we throw an error, erros in this case relate to network issues - IMPORTANT
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send JD: ${response.status} ${errorText}`);
      }
  
      const responseData = await response.json();
      // return await response.json();
      return { // API receive_jd() function returns a bunch of handy stuff (see below):
        job_description: responseData.job_description, // Job description text (might be helpful later when we display highlighted keywords)
        explanation: responseData.explanation,         // Gemini explanation of job description
      };  
    } catch (err) {

      console.error('Error sending JD to backend:', err);
      throw err;
    }
  }

export async function sendJobDescriptionUrl(url, idToken) {
  try {
      //actual API Call to the local server 
    const response = await fetch('http://localhost:5001/api/jd_from_url', {
      method: 'POST', //this indicates that we are sending data
      headers: {
          // this is the type of thing we are sending 
        'Content-Type': 'application/json',
        //this is where we send the token to varify in the backend 
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ url: url }),
    });
    
    // if the response is not ok we throw an error, errors in this case relate to network issues - IMPORTANT
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send url: ${response.status} ${errorText}`);
    }

    const responseData = await response.json();
    // return await response.json();
    return { // API receive_jd() function returns a bunch of handy stuff (see below):
      job_description: responseData.job_description, // Job description text (might be helpful later when we display highlighted keywords)
      explanation: responseData.explanation,         // Gemini explanation of job description
    };  

  } catch (err) {
    console.error('Error sending url to backend:', err);
    throw err;
  }
}

export async function explainJdText(jdText, idToken) {
  const res = await fetch("http://localhost:5001/api/jd", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${idToken}`
    },
    body: JSON.stringify({ jd: jdText })
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();  // { job_description, explanation }
}

export async function explainJdUrl(url, idToken) {
  const res = await fetch("http://localhost:5001/api/jd_from_url", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${idToken}`
     },
    body: JSON.stringify({ url })
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// Extract job description profile (required_skills, required_education, 
// required_experience, responsibilities) from JD as text (OpenAI API)
export async function extractJdProfileText(jdText, idToken, useLLM) {
  const res = await fetch(`http://localhost:5001/api/jd_profile_text_llm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${idToken}`
    },
    body: JSON.stringify({ jd: jdText })
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // LLM text : { required_skills: [...], required_education: [...], ... }
}

// Extract job description profile (required_skills, required_education, 
// required_experience, responsibilities) from JD as URL (OpenAI API)
export async function extractJdProfileUrl(jdUrl, idToken, useLLM) {
  const res = await fetch(`http://localhost:5001/api/jd_profile_url_llm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${idToken}`
    },
    body: JSON.stringify({ url: jdUrl })
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // LLM text : { required_skills: [...], required_education: [...], ... }
}