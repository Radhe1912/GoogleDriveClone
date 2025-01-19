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

router.post("/register", 
    body('email').trim().isEmail().isLength({ min: 11 }),
    body('password').trim().isLength({ min: 5 }),
    body('username').trim().isLength({ min: 3 }),
    (req, res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({errors:errors,msg:"Invalid data entered"});
        }
        res.send(errors);
    }, async (req,res)=>{
    // const {username, email, password} = req.body;
    console.log(req.body);
    res.send("User registered");
})

module.exports = router;