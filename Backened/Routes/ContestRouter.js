const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../Middlewares/Auth");
const ContestController = require("../Controllers/contestController");

router
  .route("/")
  .get(ensureAuthenticated, ContestController.getContests)
  .post(ensureAuthenticated, ContestController.createContest);

router.post(
  "/:id/participate",
  ensureAuthenticated,
  ContestController.participateInContest
);

module.exports = router;
