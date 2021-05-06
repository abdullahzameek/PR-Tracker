let http = require('../http-common')

const createpr = data => {
  return http.post("/pr/createpr", data);
};

const prService = {
  createpr
};

module.exports = prService;