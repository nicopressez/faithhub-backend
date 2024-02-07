var express = require('express');
var router = express.Router();
const profileController = require('../controllers/profileController')

const verifyRefreshToken = require('../utils/tokenVerif');

router.get('/:id', profileController.profile_get)

router.patch('/:id/update', verifyRefreshToken, profileController.profile_update)

router.delete('/:id/delete',verifyRefreshToken, profileController.profile_delete)