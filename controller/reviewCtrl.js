require("dotenv").config();
const StudentDetails = require("../model/StudentDetails");
const { default: mongoose } = require("mongoose");
const Review = require("../model/Review");
const User = require("../model/User");

let add = async (req, res) => {
  let student_id;
  if (req.user) {
    // return res.json({
    //   success: false,
    //   msg: "Log in first",
    // });
    student_id = req.user.user_id;
  } else {
    console.log("user not logged in");
    student_id = req.body.student_id;
  }
  console.log(req.body);
  const {
    teacher_id,
    review_for_subject,
    student_semester,
    course_completion_review,
    attitude_review,
    teaching_technique_review,
    student_course,
  } = req.body;
  if (
    !(
      student_id &&
      mongoose.isValidObjectId(student_id) &&
      teacher_id &&
      mongoose.isValidObjectId(teacher_id) &&
      review_for_subject &&
      student_semester &&
      course_completion_review &&
      attitude_review &&
      teaching_technique_review &&
      student_course
    )
  ) {
    res.status(400).json({
      msg: `All fields are required:
        teacher_id,
        review_for_subject,
        student_semester,
        course_completion_review,
        attitude_review,
        student_course,
        teaching_technique_review,
          `,
    });
  } else {
    try {
      const studentDetails = await User.findOne({ user_id: student_id });
      if (!studentDetails) {
        return res.json({
          success: false,
          msg: "Complete student details",
        });
      }
      const checkingForTeacher = await User.findById(teacher_id);
      console.log(checkingForTeacher);
      if (!(checkingForTeacher && checkingForTeacher.userRole == "teacher")) {
        return res.json({
          success: false,
          msg: "Entered teacher_id not exist as a teacher",
        });
      }
      const updatingDetailsIfAlreadyExists = await Review.findOneAndUpdate(
        { student_id, teacher_id, student_semester, review_for_subject },
        {
          $set: req.body,
        },
        { new: true, runValidators: true }
      );
      if (updatingDetailsIfAlreadyExists) {
        return res.json({
          success: true,
          msg: "Review updated!",
          new_data: updatingDetailsIfAlreadyExists,
        });
      }
      try {
        const addReview = await Review.create({
          student_id,
          teacher_id,
          review_for_subject,
          student_semester,
          course_completion_review,
          attitude_review,
          student_course,
          teaching_technique_review,
        });
        if (addReview) {
          //saved
          res.json({
            success: true,
            msg: `saved successfully`,
            data: addReview,
          });
        } else {
          // error
          res.json({
            success: false,
            msg: `error saving to DB`,
          });
        }
      } catch (error) {
        res.json({
          success: false,
          msg: `Error occurred`,
          error,
        });
      }
    } catch (error) {
      res.json({
        success: false,
        msg: error.message,
        error,
      });
    }
  }
};

let getAllReviews = async (req, res) => {
  try {
    let page;
    let limit;
    page = parseInt(req.query.page) || 1;
    limit = parseInt(req.query.limit) || 10;
    let currentPage = page;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = {};
    result.page;
    result.currentPage = currentPage;
    const length = await Review.countDocuments().exec();
    result.total_count = length;
    result.total_pages = Math.ceil(length / limit);
    if (result.total_pages < page) {
      result.msg = "Page Number exceeds limit!";
      return res.send(result);
    }
    if (endIndex < length) {
      result.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      result.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      result.results = await Review.find(
        {},
        { __v: 0, createdAt: 0, updatedAt: 0 }
      )
        .limit(limit)
        .skip(startIndex)
        .populate("student_id", ["name", "department"])
        .populate("teacher_id", ["name", "department"]);
      res.paginatedResult = result;
      return res.send(result);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

let getReviewsOfLoggedStudent = async (req, res) => {
  if (!req.user) {
    return res.json({
      success: false,
      msg: "Login First",
    });
  }
  try {
    const reviews = await Review.find(
      {
        student_id: req.user.user_id,
      },
      { __v: 0, createdAt: 0, updatedAt: 0 }
    )
      .populate("student_id", ["name", "department"])
      .populate("teacher_id", ["name", "department"]);
    if (reviews.length > 0) {
      res.json({
        success: true,
        msg: `${reviews.length} reviews found for you`,
        data: reviews,
      });
    } else {
      res.json({
        success: false,
        msg: "reviews not found",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      msg: `error occurred`,
      error,
    });
  }
};

let getReviewUsingId = async (req, res) => {
  const { id } = req.params;
  try {
    const operation = await Review.findById(id, {
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    })
      .populate("student_id", ["name", "department"])
      .populate("teacher_id", ["name", "department"]);
    if (operation) {
      return res.json({
        success: true,
        msg: "Review found!",
        data: operation,
      });
    } else {
      res.json({
        success: false,
        msg: "Review not found",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      msg: `error occurred`,
      error,
    });
  }
};

let updateReviewUsingId = async (req, res) => {
  const id = req.params.id;
  try {
    const updatingDetailsIfAlreadyExists = await Review.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true, runValidators: true }
    );
    if (updatingDetailsIfAlreadyExists) {
      return res.json({
        success: true,
        msg: "Details updated!",
        new_data: updatingDetailsIfAlreadyExists,
      });
    }
  } catch (error) {
    res.json({
      success: false,
      msg: `error occurred`,
      error,
    });
  }
};

let deleteDetailsUsingId = async (req, res) => {
  const id = req.params.id;
  try {
    const operation = await Review.findByIdAndDelete(id);
    if (operation) {
      res.json({
        success: true,
        msg: "Deleted successfully",
        deleted_data: operation,
      });
    } else {
      res.json({
        success: false,
        msg: "Data not found",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      msg: `error occurred`,
      error,
    });
  }
};

module.exports = {
  add,
  getReviewsOfLoggedStudent,
  getAllReviews,
  getReviewUsingId,
  updateReviewUsingId,
  deleteDetailsUsingId,
};
