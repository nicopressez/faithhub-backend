const jwt = require('jsonwebtoken')

const verifyToken  = (req,res,next) => {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
     const token = bearerHeader.split(' ')[1];
     jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return res.status(401).json()
        req.user = user;
        next();
     })
    } else {
     return res.status(404).json({message: "Error in token verification"})
    }
  }

  module.exports = verifyToken;