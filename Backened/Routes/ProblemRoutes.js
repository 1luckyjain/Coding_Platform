const express = require("express");
const Router = express.Router();
const Problems = require("../Controllers/ProblemController");
const Contest = require("../Controllers/contestController");
const ensureAuthenticated = require("../Middlewares/Auth");

// Problem CRUD routes
Router.route("/").get(Problems.getProblems);
Router.route("/:id").get(Problems.getProblemById);
Router.route("/").post(ensureAuthenticated, Problems.addProblem);
Router.route("/:id").delete(ensureAuthenticated, Problems.deleteProblem);

// Code execution routes
Router.route("/run").post(Problems.runCode);
Router.route("/submit").post(Problems.submitCode);

// Utility routes
Router.route("/languages/supported").get(Problems.getSupportedLanguages);
Router.route("/sample").post(Problems.addSampleProblems);

// Contest-related routes
Router.route("/addProblems").post(
  ensureAuthenticated,
  Contest.addProblemsToContest
);

module.exports = Router;
