require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../model/User");

let changeUserRoleToTeacher = async (req, res) => {
  const user_id = req.params.user_id;
  await User.findByIdAndUpdate(
    user_id,
    {
      $set: {
        userRole: "teacher",
      },
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .exec()
    .then((result) => {
      if (result) {
        return res.json({
          success: true,
          msg: " successfully updated user role to teacher",
          result,
        });
        // next();
      } else {
        return res.json({
          success: false,
          msg: "updating unsuccessful",
        });
      }
    })
    .catch((next) => {
      return res.send(next);
    });
};

let changeUserRoleToHod = async (req, res) => {
  const user_id = req.params.user_id;
  await User.findByIdAndUpdate(
    user_id,
    {
      $set: {
        userRole: "hod",
      },
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .exec()
    .then((result) => {
      if (result) {
        return res.json({
          success: true,
          msg: " successfully updated user role to hod",
          result,
        });
        // next();
      } else {
        return res.json({
          success: false,
          msg: "updating unsuccessful",
        });
      }
    })
    .catch((next) => {
      return res.send(next);
    });
};

let verifyUser = async (req, res) => {
  const user_id = req.params.user_id;
  await User.findByIdAndUpdate(
    user_id,
    {
      $set: {
        isVerified: true,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .exec()
    .then((result) => {
      if (result) {
        return res.json({
          success: true,
          msg: "successfully verified user",
          result,
        });
        // next();
      } else {
        return res.json({
          success: false,
          msg: "verifying unsuccessful",
        });
      }
    })
    .catch((next) => {
      return res.send(next);
    });
};

let unVerifyUser = async (req, res) => {
  const user_id = req.params.user_id;
  await User.findByIdAndUpdate(
    user_id,
    {
      $set: {
        isVerified: false,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .exec()
    .then((result) => {
      if (result) {
        return res.json({
          success: true,
          msg: "successfully verified user",
          result,
        });
      } else {
        return res.json({
          success: false,
          msg: "verifying unsuccessful",
        });
      }
    })
    .catch((next) => {
      return res.send(next);
    });
};

module.exports = {
  changeUserRoleToHod,
  changeUserRoleToTeacher,
  verifyUser,
  unVerifyUser,
};
