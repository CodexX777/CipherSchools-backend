const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: false },
  ProfilePic: { type: String, required: false },
  PhoneNo: { type: Number, required: true, minlength: 10 },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true, minlength: 6 },
  followers: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
  AboutMe: { type: String, required: false },
  // Links:[{LinkName:{type:String, required:false},link:{type:String, required:false}}],
  Links: {
    LinkedIn: { type: String, required: false },
    Github: { type: String, required: false },
    Instagram: { type: String, required: false },
    Facebook: { type: String, required: false },
    Website: { type: String, required: false },
    Twitter: { type: String, required: false },
  },
  Interests: [{ type: String, required: false }],
  ProfessionalInfo: {
    education: { type: String, required: false },
    occupation: { type: String, required: false },
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
