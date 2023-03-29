const express = require("express");

const authController = require("../controllers/Auth-controller");
const { check } = require("express-validator");

const profileUpdate = require("../controllers/profileUpdate-controller");
const fileUpload = require("../middleware/fileUpload");

const router = express.Router();




router.post(
  "/login",
  [check("Email").isEmail(), check("Password").isLength({ min: 6 })],
  authController.login
);

router.post(
  "/signup",
  [
    check("FirstName").not().isEmpty(),
    check("Email").isEmail(),
    check("Password").isLength({ min: 6 }),
    check("PhoneNo"),
  ],
  authController.signup
);

router.patch("/password/reset", authController.passwordReset);

router.patch(
  "/profile-details/about/:uid",
  check("AboutMe").not().isEmpty(),
  profileUpdate.aboutUpdate
);

router.patch(
  "/userinfo/update/:uid",
  fileUpload.single("file"),
  profileUpdate.userInfoUpdate
);

router.patch("/profile-details/socials/:uid", profileUpdate.socialsUpdate);

router.patch("/profile-details/interests/:uid", profileUpdate.interestUpdate);

router.patch("/profile-details/profinfo/:uid", profileUpdate.educationUpdate);

router.get("/userdata/:uid", authController.getUserDetails);

module.exports = router;
