require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../model/User");

let register = async (req, res) => {
  console.log(req.body);
  try {
    const { name, phone, email, password, department, userRole } = req.body;
    if (!(name && phone && email && password && department && userRole)) {
      res.status(400).json({
        msg: "All fields are required: firstName,lastName,phone, email, password,department,userRole ",
      });
    } else {
      const existingUser = await User.findOne({
        email,
      });
      if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
      }
      const user = await User.create({
        email: email.toLowerCase(),
        name,
        phone,
        password,
        department,
        userRole,
      });
      if (user) {
        return res.status(200).json({
          success: true,
          msg: "signup successfully.......login now",
        });
      } else {
        return res.status(400).json({
          success: false,
          msg: "signup unsuccessful",
        });
      }
    }
  } catch (error) {
    return res.json({
      success: false,
      msg: "signup unsuccessful",
      error,
    });
  }
};

let login = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send({
        message: "email, password is missing",
      });
    } else {
      const user = await User.findOne({
        email,
      });
      if (user) {
        if (password == user.password) {
          let token = jwt.sign(
            {
              user_id: user._id,
              userRole: user.userRole,
            },
            process.env.SECRET_KEY,
            {
              expiresIn: "2h",
            }
          );
          user.token = token;
          user.password = password;
          const options = {
            expires: new Date(Date.now() + 60 * 30 * 1000),
            httpOnly: true,
          };

          res.status(200).cookie("token", token, options).json({
            success: true,
            token: token,
            user: user,
          });
        }
      } else {
        return res.status(400).send({
          success: false,
          message: "This email is not registered",
        });
      }
    }
  } catch (error) {
    res.send(error);
  }
};

let getMyAccount = async (req, res) => {
  var user_id = req.user.user_id;
  try {
    const user = await User.findById(user_id, { __v: 0 });
    if (user) {
      res.json(user);
    } else {
      res.json({
        success: false,
        msg: "Not Found",
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

let logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  //send JSON response for success
  res.status(200).json({
    success: true,
    message: "Logout success",
  });
};

let users = async (req, res) => {
  try {
    let userRole;
    let query = "";
    let department;
    if (req.query.userRole) {
      userRole = req.query.userRole;
    } else {
      userRole = ["admin", "hod", "teacher", "student"];
    }
    if (req.query.query) {
      query = req.query.query;
    }
    if (req.query.department) {
      department = req.query.department;
    } else {
      department = ["CSE", "ECE", "EEE", "MECH", "CIVIL"];
    }
    if (req.query.isVerified) {
      isVerified = req.query.isVerified;
    } else {
      isVerified = [true, false];
    }
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
    let data = await User.find({
      firstName: { $regex: query, $options: "$i" },
      userRole,
      department,
      isVerified,
    });
    const length = data.length;
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
      result.results = await User.find({
        firstName: { $regex: query, $options: "$i" },
        userRole,
      })
        .limit(limit)
        .skip(startIndex);
      res.paginatedResult = result;
      return res.send(result);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports = {
  register,
  login,
  getMyAccount,
  logout,
  users,
};
