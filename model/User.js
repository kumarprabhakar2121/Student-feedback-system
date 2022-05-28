const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    phone: {
      type: Number,
      required: [true, "Please provide a phone number"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      trim: true,
      // validate(value) {
      //   if (!value.match(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/)) {
      //     throw new Error("Email is not valid.");
      //   }
      // },
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    userRole: {
      type: String,
      default: "student",
      enum: ["student", "teacher", "hod", "admin"],
    },
    isVerified: {
      type: String,
      default: "no",
      enum: ["no", "yes"],
    },
    department: {
      type: String,
      required: [true, "Please provide a department"],
      enum: ["CSE", "ECE", "EEE", "MECH", "CIVIL"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
