const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  FirstName: { type: String, required: true,unique: false },
  LastName: { type: String, required: false,unique: false },
  ProfilePic: { type: String, required: false ,unique: false},
  PhoneNo: { type: Number, required: true, minlength: 10,unique: false },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true, minlength: 6 ,unique: false},
  followers: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
  AboutMe: { type: String, required: false ,unique: false},
  // Links:[{LinkName:{type:String, required:false},link:{type:String, required:false}}],
  Links: {
    LinkedIn: { type: String, required: false ,unique: false},
    Github: { type: String, required: false ,unique: false},
    Instagram: { type: String, required: false ,unique: false},
    Facebook: { type: String, required: false ,unique: false},
    Website: { type: String, required: false ,unique: false},
    Twitter: { type: String, required: false ,unique: false},
  },
  Interests: [{ type: String, required: false ,unique: false}],
  ProfessionalInfo: {
    education: { type: String, required: false ,unique: false},
    occupation: { type: String, required: false ,unique: false},
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
