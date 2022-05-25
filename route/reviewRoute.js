const express = require("express");
const router = express.Router();
const {
  verifyTokenAndTeacher,
  verifyTokenAndStudent,
  verifyTokenAndHodOrTeacherOrAdmin,
} = require("../middleware/auth");

var reviewCtrl = require("../controller/reviewCtrl");

router.route("/").post(verifyTokenAndStudent, reviewCtrl.add);

router
  .route("/")
  .get(verifyTokenAndStudent, reviewCtrl.getReviewsOfLoggedStudent);

router.route("/list").get(reviewCtrl.getAllReviews);

router.route("/find/id/:id").get(reviewCtrl.getReviewUsingId);

router.route("/update/id/:id").put(reviewCtrl.updateReviewUsingId);

router.route("/delete/id/:id").delete(reviewCtrl.deleteDetailsUsingId);

module.exports = router;
