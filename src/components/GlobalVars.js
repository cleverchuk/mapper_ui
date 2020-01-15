import * as d3 from "d3";

let API = "http://127.0.0.1:8000/api/";
let dataStore = {};
let tooltip = d3.select("body")
  .append("div")
  .style("border-radius","5px")
  .style("padding","5px")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("background","#000")
  .style("color","#fff")
  .style("visibility", "hidden");
  
async function apiRequest(url = '', method, data = {}) {
  // Default options are marked with *
  if (method === "POST") {
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
    console.log("Response: ", response)
    return await response.json(); // parses JSON response into native JavaScript objects}
  } else {
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
      referrer: 'no-referrer' // no-referrer, *client
    });
    console.log("Response: ", method, response)
    return await response.json(); // parses JSON response into native JavaScript objects}
  }
}

function createTooltip(data) {
  const keys = Object.keys(data).filter(key=>  key !=="children")
  var string = "";

  keys.forEach(k => {
    string = string +"<strong>" + k +"</strong>"+ " : " + data[k]+"<br/>";
  });

  return string;
}
export {
  dataStore,
  API,
  apiRequest,
  createTooltip, 
  tooltip
};