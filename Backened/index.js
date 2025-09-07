const express = require("express");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
const ProductRouter = require("./Routes/ProductRouter");
require("dotenv").config();
require("./Models/db");
const BodyParser = require('body-parser')

const app = express();

app.use(cors());
app.use(BodyParser.json())
app.use(express.json()); 

const PORT = process.env.PORT || 8080;
app.get('/ping', (req,res)=>{
  res.send("pong")
})

app.use("/auth", AuthRouter);
app.use("/product", ProductRouter);
const TodoRouter = require("./Routes/TodoRouter");
app.use("/todos", TodoRouter);


app.listen(PORT, () => {
  console.log(`Server is ready on port ${PORT}`);
});
