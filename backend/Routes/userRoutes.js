const express = require("express");
const {
  registerUser,
  loginUser,
  googleLogin,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/auth/google", googleLogin);

module.exports = router;
