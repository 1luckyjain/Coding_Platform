const userModel = require("../Models/User")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { use } = require("../Routes/AuthRouter");
require('dotenv').config();

const signup = async (req,res)=>{
      try {
        console.log("Received body:", req.body);
        const {name , email , password} = req.body;
      const user = await userModel.findOne({email});
      if(user){
        return res.status(409)
        .json({message:"user already signup proceed for login", success: false})
      }
      const userNew = new userModel({name, email, password});
      userNew.password = await bcrypt.hash(password,10) 
      await userNew.save();
      res.status(201)
      .json({
        message: "successfully signed up",
        success : true
      })
      } catch (error) {
        res.status(500)
        .json({
          message: " internal server error",
          success: false,
          error: error.message
        })
      }
}

const login = async (req,res)=>{
  try {
    console.log("Received body:", req.body);
    const { email , password} = req.body;
    const user = await userModel.findOne({email});
    const errmsg = "Auth failed email or password is wrong"
    if(!user){
    return res.status(403)
    .json({message:errmsg, success: false})
    }
   const isPassequal = await bcrypt.compare(password, user.password);
   if(!isPassequal){
    return res.status(403)
    .json({message:errmsg , success:false})
   }
    const jwtToken = jwt.sign(
      {email:user.email, _id : user._id},
      process.env.JWT_SECRET,
      {expiresIn:'24h'}
    )
    res.status(200)
    .json({
      message:"login successfully",
      success: true,
      jwtToken,
      email,
      name: user.name
    })
  } catch (error) {
    res.status(500)
    .json({
      message: " internal server error",
      success: false,
      error: error.message
    })
  }
}

module.exports = {signup,login}