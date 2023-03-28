const HttpError = require("../models/http-error");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signup = async (req, res, next) => {
  const { FirstName, Email, Password, PhoneNo, LastName } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ Email: Email });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, please try again later", 500)
    );
  }

  if (existingUser) {
    return next(
      new HttpError("Could not create user, Email already exists", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(Password, 12);
  } catch (error) {
    return next(
      new HttpError("Could not create new user, Please try again.", 500)
    );
  }

  const newUser = new User({
    FirstName,
    LastName,
    Email,
    Password: hashedPassword,
    PhoneNo,
    followers: [],
    Links: [],
    ProfessionalInfo: [],
  });

  try {
    await newUser.save();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  let token;
  try {
    token = jwt.sign(
      { uid: newUser._id, email: newUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  res.status(201).json({
    uid: newUser._id,
    Email: newUser.Email,
    FirstName: newUser.FirstName,
    LastName: newUser.LastName,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { Email, Password } = req.body;

  let user;
  try {
    user = await User.findOne({ Email: Email });
  } catch (error) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  if (!user) {
    return next(
      new HttpError(
        "Could not identify user, Credentials seem to be wrong.",
        401
      )
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(Password, user.Password);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Could not login the user, Please try again.", 500)
    );
  }
  if (!isValidPassword) {
    return next(
      new HttpError(
        "Could not identify user, Credentials seem to be wrong.",
        401
      )
    );
  }

  let token;
  try {
    token = jwt.sign(
      { uid: user._id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  res.status(201).json({
    uid: user._id,
    Email: user.Email,
    FirstName: user.FirstName,
    LastName: user.LastName,
    token: token,
  });
};

const getUserDetails = async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  if (!user) {
    return next(
      new HttpError(
        "Could not identify user, Credentials seem to be wrong.",
        401
      )
    );
  }

  res.status(201).json({
    user: user,
  });
};

exports.getUserDetails = getUserDetails;
exports.signup = signup;
exports.login = login;
