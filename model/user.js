const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength:6,
      maxlenght:12,
    },
    password: {
      type: String,
      required: true,
      minlength:6,
    },
  },
  { collation: "users" }
);

const model = mongoose.model("UserSchema", UserSchema);

module.exports = model;
