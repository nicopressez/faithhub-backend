var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController')
const verifyToken = require('../utils/tokenVerif')

router.get('/', function(req, res, next) {
  res.status(200).json({message: "success"});
});

router.post('/signup', authController.signup)

router.post('/login', authController.login)

module.exports = router;
