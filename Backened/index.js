const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const AuthRouter = require("./Routes/AuthRouter");
const ProductRouter = require("./Routes/ProductRouter");
const ContestRouter = require("./Routes/ContestRouter");
const TodoRouter = require("./Routes/TodoRouter");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/v1/user", AuthRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/todos", TodoRouter);
app.use("/api/v1/contests", ContestRouter);
app.use("/api/v1/problems", require("./Routes/ProblemRoutes"));

module.exports = app;
