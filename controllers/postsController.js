const Post = require('../models/post')
const User = require('../models/user')
const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');

// Get all posts
exports.all_posts_get = asyncHandler(async(req,res,next) => {

})

// Get posts based on filters
exports.filtered_posts_get = asyncHandler(async(req,res,next) => {

})

// Create one post
exports.create_post = asyncHandler(async(req,res,next) => {

})

// Update one post
exports.update_post = asyncHandler(async(req,res,next) => {

})

// Delete one post
exports.delete_post = asyncHandler(async(req,res,next) => {

})