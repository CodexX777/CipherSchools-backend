const HttpError = require("../models/http-error");
const User = require("../models/user");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const aboutUpdate = async (req, res, next) => {
  const userId = req.params.uid;
  const { AboutMe } = req.body;
  let user;

  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, please try again later", 500)
    );
  }

  if (!user) {
    return next(new HttpError("Could not find the user, invalid uid", 422));
  }

  try {
    user.AboutMe = AboutMe;
    await user.save();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  res.status(201).json({
    aboutMe: user.AboutMe,
  });
};

const socialsUpdate = async (req, res, next) => {
  const { userLinks } = req.body;
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
      new HttpError("Could not identify user, uid seem to be wrong.", 401)
    );
  }

  //   const { Links } = user;

  for (const [key, value] of Object.entries(userLinks)) {
    if (user.Links.hasOwnProperty(key)) {
      user.Links[key] = value;
    }
  }

  //   user.Links = Links; // update the Links object in the user schema
  await user.save();

  res.status(201).json({
    links: user.Links,
  });
};

const educationUpdate = async (req, res, next) => {
  const userId = req.params.uid;
  const { profInfo } = req.body;

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

  for (const [key, value] of Object.entries(profInfo)) {
    if (user.ProfessionalInfo.hasOwnProperty(key)) {
      user.ProfessionalInfo[key] = value;
    }
  }

  await user.save();

  res.status(201).json({
    profInfo:user.ProfessionalInfo,
  });
};

const interestUpdate = async (req, res, next) => {
  const userId = req.params.uid;

  const { options } = req.body;
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

  user.Interests = options;
  await user.save();

  res.status(201).json({
    interests: user.Interests,
  });
};

const userInfoUpdate = async (req, res, next) => {
  const { FirstName, LastName, Email, PhoneNo, file } = req.body;
  const userId = req.params.uid;

  console.log(req.body);
  console.log(req.file.buffer);
  const filename = uuidv4();

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
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

  try {
    await s3
      .putObject({
        Body: req.file.buffer,
        Bucket: process.env.CYCLIC_BUCKET_NAME,
        Key: filename,
        ContentType: req.file.mimetype,
      })
      .promise();

    // console.log("success");
  } catch (error) {
    console.log(error);
    // console.log(error);
    return next(
      new HttpError(
        "Something went wrong in Aws , please try again later.",
        500
      )
    );
  }

  sess = await mongoose.startSession();
  sess.startTransaction();

  user.FirstName = FirstName;
  user.LastName = LastName;
  user.Email = Email;
  user.PhoneNo = PhoneNo;
  user.ProfilePic = filename;

  await user.save({ session: sess });
  sess.commitTransaction();

  res.status(201).json({
    userData:user
  });
};

exports.interestUpdate = interestUpdate;
exports.userInfoUpdate = userInfoUpdate;
exports.educationUpdate = educationUpdate;
exports.aboutUpdate = aboutUpdate;
exports.socialsUpdate = socialsUpdate;
