const mongoose = require("mongoose");
const schema = mongoose.Schema;

const authSchema = new schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken:String,
  refreshToken:String
});
const User = mongoose.model("register_details", authSchema);
module.exports = User;
