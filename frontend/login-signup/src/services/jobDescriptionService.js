
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
  
      return await response.json();
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
      
      // if the response is not ok we throw an error, erros in this case relate to network issues - IMPORTANT
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send url: ${response.status} ${errorText}`);
      }
  
      return await response.json();
    } catch (err) {

      console.error('Error sending url to backend:', err);
      throw err;
    }
  }