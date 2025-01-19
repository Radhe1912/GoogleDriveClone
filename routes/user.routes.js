const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

//  */user/test
// router.get("/test",(req,res)=>{
//     res.send("Testing the user route");
// });

//  */user/register
router.get("/register", (req,res)=>{
    res.render('register');
});

router.post("/register", async (req,res)=>{
    // const {username, email, password} = req.body;
    console.log(req.body);
    res.send("User registered");
})

module.exports = router;