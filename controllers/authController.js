const passport = require("../utils/passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const User = require('../models/user');
const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
require("dotenv").config()

exports.signup = asyncHandler(async(req,res,next));

exports.login = asyncHandler(async(req,res,next));

exports.logout = asyncHandler(async(req,res,next));