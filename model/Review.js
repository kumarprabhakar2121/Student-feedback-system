const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewing_at_year: {
      type: Date,
      default: new Date().toISOString(),
    },
    review_for_subject: {
      type: String,
    },
    student_semester: {
      type: Number,
    },
    student_course: {
      type: String,
      enum: ["btech", "diploma"],
    },
    course_completion_review: {
      type: Number,
    },
    attitude_review: {
      type: Number,
    },
    teaching_technique_review: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", ReviewSchema);
