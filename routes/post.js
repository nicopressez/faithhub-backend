var express = require('express');
var router = express.Router();
const postsController = require('../controllers/postsController')

const verifyRefreshToken = require('../utils/tokenVerif');

router.get('/', function(req, res, next) {
    res.status(200).json({message: "Post router works"});
  });

  // Update one post
  router.patch('/:id', verifyRefreshToken, postsController.update_post)

  // Delete one post
  router.delete('/:id', verifyRefreshToken, postsController.delete_post)

  // Get all posts
  router.get('/all', postsController.all_posts_get)

  // Get filtered posts
  router.get('/filter', postsController.filtered_posts_get)

  // Create post
  router.post('/', verifyRefreshToken, postsController.create_post)

