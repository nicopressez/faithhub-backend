const Post = require('../models/post')
const User = require('../models/user')
const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');

// Get all posts based on preferences
exports.all_posts_get = asyncHandler(async(req,res,next) => {
    const userPref = req.user.preferences

    const posts = await Post.find({ type: {$in: userPref}}).populate({
        path: "author",
        select: "profile_picture first_name last_name"
    })

    res.send(200).json({data: posts, token, user:req.user})
})

// Get posts based on user
exports.user_posts = asyncHandler(async(req,res,next) => {
    const posts = await Post.find({author: req.params.userid}).populate({
        path: "author",
        select: "profile_picture first_name last_name"
    }); 

    res.status(200).json({data: posts})
})

// Create one post
exports.create_post = [
    body("content")
        .trim()
        .isLength({min: 10, max:2000})
        .escape(),
    body("type")
        .escape(),

    asyncHandler(async(req,res,next) => {
        const errors = validationResult(req)
// Create post with the req user's id
// Add post to the req user
})]

// Update one post
exports.update_post = asyncHandler(async(req,res,next) => {

})

// Delete one post
exports.delete_post = asyncHandler(async(req,res,next) => {

})