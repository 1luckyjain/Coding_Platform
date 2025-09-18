const express = require("express");
const Router = express.Router();
const Problems = require("../Controllers/ProblemController");
const Contest = require("../Controllers/contestController");
const ensureAuthenticated = require("../Middlewares/Auth");

Router.route("/").post(ensureAuthenticated, Problems.addProblem);
Router.route("/addProblems").post(
  ensureAuthenticated,
  Contest.addProblemsToContest
);
module.exports = Router;
