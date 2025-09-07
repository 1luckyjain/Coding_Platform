const mongoose  = require('mongoose')
require('dotenv').config();


const mongo_url = process.env.MONGO_DB;

mongoose.connect(mongo_url).then(()=>{
  console.log('connected')
}).catch((err)=>{
  console.log(err);
})