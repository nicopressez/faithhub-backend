var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController')
const verifyRefreshToken = require('../utils/tokenVerif')

router.get('/', function(req, res, next) {
  res.status(200).json({message: "success"});
});

router.post('/signup', authController.signup)

router.post('/login', authController.login)

router.get('/token', verifyRefreshToken, authController.token_refresher)

module.exports = router;
