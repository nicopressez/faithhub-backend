const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');

const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Set upload destination
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

const fileFilter = (req, file, cb) => {
    // Check if the file is an image
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only image files are allowed'), false); // Reject the file
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

exports.profile_get = asyncHandler(async(req,res,next) => {
const user = await User.findById(req.params.id)
if (!user) res.status(404).json({message: "No user found"})
res.status(200).json({user})
})

exports.profile_get_username = asyncHandler(async(req,res,next) => {
    const user = await User.findOne({username: req.params.id});
    if (!user) res.status(200).json({message: "No user found"})
    if (user) res.status(400).json({message: "Username already taken"})
})

exports.profile_update =[ 
    body("username", "Must be between 4 and 16 characters")
    .trim()
    .isLength({min:4, max:16})
    .escape(),
    body("first_name")
        .trim()
        .isLength({min:2})
        .withMessage("Must be at least 2 characters")
        .isLength({max:16})
        .withMessage("Must be a maximum of 12 characters")
        .escape(),
    body("last_name")
        .trim()
        .isLength({min:2})
        .withMessage("Must be at least 2 characters")
        .isLength({max:16})
        .withMessage("Must be a maximum of 12 characters")
        .escape(),
    body("location")
        .trim()
        .optional(),

upload.single("profile_picture"),
    
    asyncHandler(async(req,res,next) => {
        const user = await User.findById(req.params.id)
// Check differences between user info and form info and apply changes
        if(req.body.username !== user.username){
            // Check if username already taken before updating it
            const usernameUsed = User.find({username: req.body.username})
            if (usernameUsed[0]) return res.status(401).json({message: "Username already in use"})

            await User.findByIdAndUpdate(req.params.id, {username: req.body.username})
        }
        if(req.body.first_name !== user.first_name){
            await User.findByIdAndUpdate(req.params.id, {first_name: req.body.first_name})
        }
        if(req.body.last_name !== user.last_name) {
            await User.findByIdAndUpdate(req.params.id, {last_name: req.body.last_name})
        }
        if(req.body.location !== user.location){
            await User.findByIdAndUpdate(req.params.id, {location: req.body.location})
        }
        if(req.body.bio !== user.bio){
            await User.findByIdAndUpdate(req.params.id, {bio: req.body.bio})
        }
        if(req.body.profile_picture !== user.profile_picture){
            await User.findByIdAndUpdate(req.params.id, {profile_picture: req.file ? req.file.path : null})
        }

        const updatedUser = await User.findById(req.params.id)
        res.status(200).json({message: "Profile updated", token: req.token,
        user: updatedUser })
})]

exports.profile_delete = asyncHandler(async(req,res,next) => {
const user = await User.findById(req.params.id)
if (!user) res.status(404).json({message: "No user found"})

// Remove all of the user's posts and their references
const userPosts = await Post.find({author: user._id})
for (const post of userPosts){
    await post.deleteOne()
    await Comment.deleteMany({ post: post._id })
}

// Remove all of the user's comments
const userComments = await Comment.find({author: user._id})
for (const comment of userComments){
    await comment.deleteOne()
    await Post.findOneAndUpdate({comments: comment._id,}, {
        $pull :{
            comments: comment._id
        }
    })
}

// Remove all of the user's likes
    await Post.updateMany({ likes: user._id}, {
        $pull: {
            likes: user._id
        }
    })

await User.findByIdAndDelete(req.params.id);
res.status(200).json({message: "User deleted"})
})

exports.preferences_get = asyncHandler(async(req,res,next) => {
  const userPref = await User.findById(req.params.id, "preferences")
  if (!userPref) return res.status(404).json({message: "User not found"})
  res.status(200).json({preferences: userPref})
})

exports.preferences_update = asyncHandler(async(req,res,next) => {
// Check if user exists
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({message: "User not found"})

// Apply updates
    await User.findByIdAndUpdate(req.params.id, {
        preferences: req.body
    });

// Send back token and user info
    const updatedUser = await User.findById(req.params.id)
        res.status(200).json({message: "Preferences updated",
         token: req.token,
        user: updatedUser })
})

exports.searchbar = asyncHandler(async(req,res,next) => {
    const { query } = req.query;
    const terms = query.trim().split(/\s+/); // Split query into terms by whitespace

    const regexTerms = terms.map(term => new RegExp(term, 'i')); // Create case-insensitive regex for each term

    // Search for corresponding first or last names
    const users = await User.aggregate([
        {
            $match: {
                $or: [
                    { $and: [ { first_name: { $regex: regexTerms[0] } }, { last_name: { $regex: regexTerms[1] || regexTerms[0] } } ] }, // Search for first and last name combination
                    { first_name: { $regex: regexTerms[0] } }, // Search for first name
                    { last_name: { $regex: regexTerms[0] } } // Search for last name
                ]
            }
        },
        {
            $project: {
                first_name: 1,
                last_name: 1,
                profile_picture: 1,
                full_name: { $concat: [ "$first_name", " ", "$last_name" ] },
                matchScore: {
                    $cond: [
                        { $eq: [ "$full_name", query ] }, // Exact match
                        5,
                        {
                            $add: [
                                { $cond: [ { $eq: [ { $toLower: "$full_name" }, { $toLower: query } ] }, 2, 0 ] }, // Case sensitivity
                                { $cond: [ { $regexMatch: { input: "$full_name", regex: new RegExp(`\\b${query}\\b`, "i") } }, 3, 0 ] }, // Word boundary match
                                { $cond: [ { $or: [ { $ne: [ "$profile_picture", null ] }, { $ne: [ "$bio", null ] }, { $ne: [ "$location", null ] } ] }, 1, 0 ] } // Presence of additional information
                            ]
                        }
                    ]
                }
            }
        },
        {
            $sort: { matchScore: -1 } // Sort by matchScore in descending order
        },
        {
            $limit: 3 // Limit to top 3 results
        }
    ]);

    res.status(200).json({ success: true, data: users });
});