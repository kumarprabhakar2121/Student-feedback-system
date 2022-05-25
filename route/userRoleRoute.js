const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenAndAdmin } = require("../middleware/auth");

var userRoleCtrl = require("../controller/userRoleCtrl");

router.route("/changeToHod/:user_id").get(userRoleCtrl.changeUserRoleToHod);

router
  .route("/changeToTeacher/:user_id")
  .get(userRoleCtrl.changeUserRoleToTeacher);

router.route("/changeToVerified/:user_id").get(userRoleCtrl.verifyUser);

router.route("/changeToUnVerified/:user_id").get(userRoleCtrl.unVerifyUser);

module.exports = router;
