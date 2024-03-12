var express = require('express');
var router = express.Router();
const profileController = require('../controllers/profileController')

const verifyRefreshToken = require('../utils/tokenVerif');

router.get('/:id/preferences', profileController.preferences_get)

router.patch('/:id/preferences', verifyRefreshToken,  profileController.preferences_update)

router.patch('/:id/update', verifyRefreshToken, profileController.profile_update)

router.delete('/:id/delete',verifyRefreshToken, profileController.profile_delete)

router.get('/:id', profileController.profile_get)

router.get('/username/:id', profileController.profile_get_username)

// Search bar 
router.get('/searchbar', profileController.searchbar)



module.exports = router
