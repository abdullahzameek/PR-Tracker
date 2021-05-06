let axios = require("axios");

//set up the link to the api with axios over here
module.exports = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-type": "application/json"
  }
});

