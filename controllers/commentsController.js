const Comment = require('../models/comment')
const User = require('../models/user')
const Post = require('../models/comment')
const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');

// Get all comments from post
exports.all_comments = asyncHandler(async(req,res,next) => {
    const post = await Post.findById(req.params.id, "comments")
    if(!post){
        res.status(404).json({
            message: "Post not found"
        });
    }
    const comments = await Comment.find({
        _id:{$in: post.comments}
    })

    res.status(200).json({
        message: "Success",
        comments: comments
    })
})

exports.create_comment = [
    body("content")
        .trim()
        .isLength({min:5, max:1000})
        .escape(),
    asyncHandler(async(req,res,next) => {
        const errors = validationResult(req)
        const post = await Post.findById(req.params.id)

        if (!errors.isEmpty()) {
            return res.status(401).json({
                errors: errors.array()
            })
        };
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            })
        };
        const comment = new Comment({
            author: req.user._id,
            content: req.user.content
        })
        const newComment = await comment.save();
        await Post.findByIdAndUpdate(req.user._id,{
            $push: {
                comments: newComment._id
            }
        })
        res.status(200).json({
            message: "Comment added",
            comment: newComment,
            user: req.user,
            token: req.token
        })

})]

exports.update_comment =[ 
    body("content")
        .trim()
        .isLength({min:5, max:1000})
        .escape(),
    asyncHandler(async(req,res,next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(401).json({
                errors: errors.array()
            })
        };
        const post = await Post.findById(req.params.id)
        const comment = await Comment.findById(req.params.commentid)

        if(!comment || !post) {
            return res.status(404).json({
            message: "Comment or post not found"
        })}
        const newComment = await Comment.findByIdAndUpdate(req.params.commentid, {
            content: req.body.content,
            edited: true
        })
        // Send back comment and token
        res.status(200).json({
            message: "Comment edited",
            comment: newComment,
            token: req.token
        })

})]

exports.delete_comment = asyncHandler(async(req,res,next) => {
    const post = await Post.findById(req.params.id);
    const comment = await Comment.findById(req.params.commentid);
    if(!comment || !post) {
        return res.status(404).json({
        message: "Comment or post not found"
    })}

    await Comment.findByIdAndDelete(req.params.commentid)
    await Post.findByIdAndUpdate(req.params.id, {
        $pull: {
            comments: comment._id
        }
    })

    res.status(200).json({
        message: "Comment deleted",
        token: req.token
    })
}
)

