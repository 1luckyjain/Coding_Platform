const express = require("express");
const router = express.Router();
const { signup, login, updateProfile } = require("../Controllers/AuthController");
const {
  signupValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation");
const ensureAuthenticated = require("../Middlewares/Auth");

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.put("/update-profile", ensureAuthenticated, updateProfile);

module.exports = router;
