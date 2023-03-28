const express = require("express");

const authController = require("../controllers/Auth-controller");
const { check } = require("express-validator");

const profileUpdate = require("../controllers/profileUpdate-controller");

const router = express.Router();
router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 6 })],
  authController.login
);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  authController.signup
);

router.patch(
  //:data would tell which data we have to update eg: interest, occupation,etc
  "/profile-details/:data/:uid",
  profileUpdate.detailsUpdate
);

router.get("/user/:uid", authController.getUserDetails);

module.exports = router;
