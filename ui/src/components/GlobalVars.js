
let API ="http://127.0.0.1:8000/api/";
let dataStore = {};
async function apiRequest(url = '', method, data = {}) {
    // Default options are marked with *
    console.log("data", data);
    const response = await fetch(url, {
      method: method, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //   credentials: 'include', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    console.log("Response: ",response)
    return await response.json(); // parses JSON response into native JavaScript objects
  }
export {dataStore, API, apiRequest};
