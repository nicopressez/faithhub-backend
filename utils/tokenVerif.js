const jwt = require('jsonwebtoken')
const User = require('../models/user')

  const verifyRefreshToken = async(req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).json({message: "No token provided"})

    // Verify current token validity
     jwt.verify(token, process.env.SECRET, async(err,decoded) => {
      // Invalid token
        if (err){
            if (err.name === 'TokenExpiredError'){
                return res.status(401).json({message: "Token expired"})};
            return res.status(401).json({ message: "Invalid token" });
        // Valid token
        } else {
            try {
                const user = await User.findById(decoded.user._id)
        // User doesn't exist anymore: return error
                if(!user) return res.status(404).json({message: "User not found"})
        // Valid user, regenerate token and pass on the info to next middleware
                const accessToken = jwt.sign({user}, process.env.SECRET, { expiresIn: '24h'}); 
                req.user = user
                req.token = accessToken
            } catch (err){
              return res.status(500).json({message:"Server error during token refresh"})
            }
        }
        next()
    })
}

  module.exports = verifyRefreshToken;