var express = require('express');
var router = express.Router();
const profileController = require('../controllers/profileController')

const verifyRefreshToken = require('../utils/tokenVerif');

router.get('/', profileController.profile_get)

router.patch('/update', verifyRefreshToken, profileController.profile_update)

router.delete('/delete',verifyRefreshToken, profileController.profile_delete)