const passport = require("../utils/passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const User = require('../models/user');
const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
require("dotenv").config()

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

exports.signup = [
    body("username", "Must be between 4 and 16 characters")
        .trim()
        .isLength({min:4, max:16})
        .escape(),
    body("password", "Must be at least 8 characters long")
        .trim()
        .isLength({min:8}),
    body("password_verif").custom((value, { req }) => {
        if (value !== req.body.password) throw new Error('Passwords do not match')
        return true;
    }),
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
// Validate form
        const errors = validationResult(req);
        if(!errors.isEmpty) {
           res.status(400).json({errors: errors.array()});
        }

        // Check if username already taken before proceeding
        const usernameUsed = await User.find({username: req.body.username});
        if (usernameUsed) return res.status(401).json({message:"Username already in use"})

        // Username not used, continue with signup
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            location: req.body.location,
            profile_picture: req.file ? req.file.path : null,
        })
        const userSaved = await user.save();
// Log person in right after signup
        const token = jwt.sign(
            {user:userSaved.username}, process.env.SECRET, 
            {expiresIn: "24h"});
        res.status(200).json({token})
    })]

exports.login = [
    passport.authenticate("local"),
    asyncHandler(async(req,res,next) => {
    const user = await User.findOne({username: req.body.username}).exec();
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    const secret = process.env.SECRET;
    const token = jwt.sign({user}, secret, { expiresIn: '24h'});
    res.status(200).json({
        message: "Auth passed",
        token
    })
})]
