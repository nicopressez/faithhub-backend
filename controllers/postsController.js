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

    res.send(200).json({data: posts, token: req.token , user:req.user})
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
        const errors = validationResult(req);
        const user = req.user ;

        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array()})
        }
        const post = new Post({
            content: req.body.content,
            type: req.body.type,
            anonymous: req.body.anonymous,
            author: user._id
        })
        // Save post and append it to the user data
        const newPost = await post.save();
        const newUser = await User.findByIdAndUpdate(req.user._id, {
            $push: {posts: newPost._id}
        })
        // Send back the new post, token and updated user
        res.status(200).json({
            message: "New post added",
            post: newPost,
            user: newUser,
            token: req.token
        })
})]

// Update one post
exports.update_post = [
    body("content")
        .trim()
        .isLength({min: 10, max:2000})
        .escape(),
    body("type")
        .escape(),

    asyncHandler(async(req,res,next) => {
        const errors = validationResult(req);
        const post = await Post.findById(req.params.id)

        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array()})
        };

        if (post.type !== req.body.type) {
            await Post.findByIdAndUpdate(req.params.id, {
                type: req.body.type
            })
        };
        if (post.content !== req.body.content){
            await Post.findByIdAndUpdate(req.params.id, {
                content: req.body.content
            })
        };
        const updatedPost = await Post.findById(req.params.id)
        // Send back the updated post, token and user
        res.status(200).json({
            message: "Post updated successfully",
            post: updatedPost,
            token: req.token,
        })

})]

// Delete one post
exports.delete_post = asyncHandler(async(req,res,next) => {
    const post = await Post.findById(req.params.id)
    const user = req.user
    if(!post) {
        return res.status(404).json({message:"Post not found"})
    }

    // Delete post and remove its reference to the user db
    await Post.findByIdAndDelete(req.params.id);
    const updatedUser = await User.findByIdAndUpdate(user._id, {
        $pull: {posts: post._id}
    })

    // Send token and user data back
    res.status(200).json({
        message: "Post deleted",
        user: updatedUser,
        token: req.token
    })
})

exports.like = asyncHandler(async(req,res,next) => {
    // Get the post
    const post = await Post.findById(req.params.id, "likes")
    const user = req.user
    const alreadyLiked = post.likes.some(likeId => likeId.equals(user._id))

    // Update depending on if the user already liked
    if (alreadyLiked){
        await Post.findByIdAndUpdate(req.params.id, {
            $pull: {
                likes: user._id
            }
        });
        res.status(200).json({
            message: "Like removed",
            token: req.token
        })
    } else {
        await Post.findByIdAndUpdate(req.params.id, {
            $push:{
                likes: user._id
            }
        });
        res.status(200).json({
            message: "Like added",
            token: req.token
        })
    }

})