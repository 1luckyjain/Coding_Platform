const { required } = require('joi');
const mongoose = require('mongoose')

// const schema = new mongoose.Schema;

const UserSchema =  new mongoose.Schema({
  name : {
    type: String,
    required: true
  },
  email:{
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required: true
  }
})

const userModel = mongoose.model('users', UserSchema);

module.exports = userModel;