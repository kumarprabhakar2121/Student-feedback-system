const mongoose = require("mongoose");

const StudentDetailsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    college_roll_number: {
      type: Number,
      default: false,
    },
    course_enrolled: {
      type: String,
      required: [true, "Please provide a Course"],
      enum: ["btech", "diploma"],
    },
    session_start_year: {
      type: Number,
      required: [true, "Please provide a batch"],
    },
    session_end_year: {
      type: Number,
      required: [true, "Please provide a batch"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StudentDetails", StudentDetailsSchema);
