const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenAndAdmin } = require("../middleware/auth");

var userCtrl = require("../controller/userCtrl");

router.route("/list").get(userCtrl.users);

router.route("/login").post(userCtrl.login);

router.route("/signup").post(userCtrl.register);

router.route("/logout").get(userCtrl.logout);

router.route("/getAccount").get(verifyToken, userCtrl.getMyAccount);

module.exports = router;
