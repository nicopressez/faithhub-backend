const User = require('../models/user');
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
await User.findByIdAndDelete(req.params.id);
res.status(200).json({message: "User deleted"})
})