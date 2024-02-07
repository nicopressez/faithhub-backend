const verifyToken  = (req,res,next) => {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
     const bearerToken = bearerHeader.split(' ')[1];
     req.token = bearerToken;
     next();
    } else {
     return res.status(404).json({message: "Error in token verification"})
    }
  }

  module.exports = verifyToken;