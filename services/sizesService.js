let http = require('../http-common')

const createSize = data => {
  return http.post("/sizes/createSize", data);
};

const updateSize = data => {
    return http.post("/sizes/updateSize", data);
};

const getSize = (params)=>{
    return http.get("/sizes/getSize", {params})
}
const findPr = (params)=>{
    return http.get("/sizes/findPr", {params})
}

const sizesService = {
  createSize,
  updateSize,
  getSize,
  findPr
};

module.exports = sizesService;