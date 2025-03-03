
function maintenanse(req, res, next) {
    if (process.env.MAINTENANSE === 'true'){ 
      return res.status(503).send('Site is under maintenance, please try again later');
    }
    next();
  }

  export default maintenanse;