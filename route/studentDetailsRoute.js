const express = require("express");
const router = express.Router();
const {
  verifyTokenAndTeacher,
  verifyTokenAndStudent,
  verifyTokenAndHodOrTeacherOrAdmin,
} = require("../middleware/auth");

var students_detailsCtrl = require("../controller/students_detailsCtrl");

router
  .route("/")
  .post(verifyTokenAndStudent, students_detailsCtrl.add)
  .get(verifyTokenAndStudent, students_detailsCtrl.getDetailsOfLoggedUser)
  .put(verifyTokenAndStudent, students_detailsCtrl.updateDetailsOfLoggedUser)
  .delete(
    verifyTokenAndStudent,
    students_detailsCtrl.deleteDetailsOfLoggedUser
  );

router.route("/list").get(students_detailsCtrl.getAllDetails);

router.route("/find/id/:id").get(students_detailsCtrl.getDetailsUsingId);

router.route("/update/id/:id").put(students_detailsCtrl.updateDetailsUsingId);

router
  .route("/delete/id/:id")
  .delete(students_detailsCtrl.deleteDetailsUsingId);

router
  .route("/verify/:id")
  .get(verifyTokenAndHodOrTeacherOrAdmin, students_detailsCtrl.verify);

router
  .route("/unverify/:id")
  .get(verifyTokenAndHodOrTeacherOrAdmin, students_detailsCtrl.unverify);

module.exports = router;
