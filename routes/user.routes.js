const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');  // to hash the password
const jwt = require('jsonwebtoken');

//  */user/register
router.get("/register", (req, res) => {
    res.render('register');
});

router.post("/register",
    body('email').trim().isEmail().isLength({ min: 11 }),
    body('password').trim().isLength({ min: 5 }),
    body('username').trim().isLength({ min: 3 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors, msg: "Invalid data entered" });
        }
        const { username, email, password } = req.body;

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            username,
            email,
            password: hashPassword,
        });

        res.json(newUser);

    }, async (req, res) => {
        console.log(req.body);
        res.send("User registered");
    });

router.get("/login", (req, res) => {
    res.render('login');
});

router.post(
    "/login",
    [
        body('username').trim().isLength({ min: 3 }),
        body('password').trim().isLength({ min: 5 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array(),
                message: "Invalid data",
            });
        }

        const { username, password } = req.body;

        const user = await userModel.findOne({ username });

        if (!user) {
            return res
                .status(400)
                .json({ message: "Username or password is incorrect" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Username or password is incorrect" });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                username: user.username,
            },
            process.env.JWT_SECRET
        );

        res.cookie('token', token);
        res.send("Logged In");

    }
);


module.exports = router;