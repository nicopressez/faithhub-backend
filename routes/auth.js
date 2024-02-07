var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController')
const verifyToken = require('../utils/tokenVerif')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', authController.signup)

router.post('/login', authController.login)

router.post('/logout', verifyToken, authController.logout)

module.exports = router;
