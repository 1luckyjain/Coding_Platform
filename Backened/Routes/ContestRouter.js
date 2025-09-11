const express = require("express");
const Router = express.Router();
const ensureAuthenticated = require("../Middlewares/Auth");
const Contest = require("../Controllers/contestController");

Router.route("/")
  .get(ensureAuthenticated, Contest.getContests)
  .post(ensureAuthenticated, Contest.createContest);

module.exports = Router;
