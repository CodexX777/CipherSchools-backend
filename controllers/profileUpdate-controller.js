const HttpError = require("../models/http-error");
const User = require("../models/user");


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
    message: "about section updated.",
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
    message: "Links updated successfully",
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
    message:"info updated successfully."
  });
};

exports.educationUpdate = educationUpdate;
exports.aboutUpdate = aboutUpdate;
exports.socialsUpdate = socialsUpdate;
