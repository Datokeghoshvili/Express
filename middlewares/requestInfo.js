function requestInfo(req, res, next) {
    console.log(req.method, req.url, new Date().toISOString());
    next();
  };
export default requestInfo;