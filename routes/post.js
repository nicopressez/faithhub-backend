var express = require('express');
var router = express.Router();
const postsController = require('../controllers/postsController')
const commentsController = require('../controllers/commentsController')

const verifyRefreshToken = require('../utils/tokenVerif');


  // Update one comment
  router.patch('/:id/comments/:commentid', verifyRefreshToken, commentsController.update_comment)

  // Delete one comment
  router.delete('/:id/comments/:commentid', verifyRefreshToken, commentsController.delete_comment)

  // Create one comment
  router.post('/:id/comments', verifyRefreshToken, commentsController.create_comment)

  // Get all comments by post
  router.get('/:id/comments', commentsController.all_comments )

  // Update one post
  router.patch('/:id', verifyRefreshToken, postsController.update_post)

  // Delete one post
  router.delete('/:id', verifyRefreshToken, postsController.delete_post)

  // Get all posts
  router.get('/all', postsController.all_posts_get)

  // Get posts by user
  router.get('/user/:userid', postsController.user_posts)

  // Get filtered posts
  router.get('/filter', postsController.filtered_posts_get)

  // Create post
  router.post('/', verifyRefreshToken, postsController.create_post)

  // Test route
  router.get('/', function(req, res, next) {
    res.status(200).json({message: "Post router works"});
  });




