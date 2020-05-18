const router = require('express').Router();
const userModel = require('../models/User');
const auth = require("../middlewares/auth");

router.post("/register", async (req, res) => {
    try {
        let { email,password } = req.body;
        const user = new userModel(req.body);
        existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            res.status(400).json({ message: "email already exists" });
        } else {
            await user.save();
            res.status(200).json({ success: true, user: user })
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }

});

//login
router.post('/login', async (req, res)=>{
    //match email
    const user = await userModel.findOne({email: req.body.email});
    if(!user) return res.json({success : false, message:"No user found with that email"});

    
    user.comparePassword(req.body.password, (err, isMatch)=> {
        if (!isMatch){
            return res.json({loginSuccess: false, message: "wrong password"})
        }
    })

    user.generateToken((err, user)=>{
        if(err) return res.status(400).json({error: err});
        res.cookie("x_auth", user.token).status(200).json({
            message:"Login Success"
        })
    })
})

router.get("/auth",auth, (req,res)=>{
    res.status(200).json({
        _id : req.id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    })
})

router.get("/logout", auth, (req,res)=>{
    userModel.findByIdAndUpdate({_id: req.user._id},{token:""}, {useFindAndModify: false}, (err,doc)=>{
        if(err) res.json({success: false,err})
        res.status(200).json({success:true});
    })
})

// router.post('/login', (req,res)=>{
//     //match email
//     try {
//         userModel.findOne({email:req.body.email},(err, user)=>{
//             if(!user) return res.status(400).json({message:'Auth failed, No email found'})
//             if(err) return res.status(500).json({message:"something is wrong"}, err)
//             //if() res.status(200).json({message:"success", user: user})
            
//             //match password
//             bcrypt.compare(req.body.password, user.password, function(err, result) {
//                 if(result == true && user ){
//                     res.json({message:"password and email matched", success:true})
//                 }else{
//                     res.json({message:"Password did not match", success:false})
//                 }
//             });
//         })
//     } catch (error) {
//         res.json(err);
//     }
    
    

//     // generate token
// })

module.exports = router;