const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("verifyToken is running ");
  var token = "";
  try {
    token = req.cookies.token;
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "error getting token",
    });
  }

  if (!token) {
    res.status(403).json({
      success: false,
      message: "You are not logged in",
    });
  } else {
    try {
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decode;
      return next();
    } catch (error) {
      console.log("invalid token");
      return res.status(401).json({
        success: false,
        message: " Invalid token",
      });
    }
  }
};

const verifyTokenAndStudent = (req, res, next) => {
  console.log("verifyTokenAndStudent is running ");
  var token = "";
  try {
    token = req.cookies.token;
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "error getting token",
    });
  }

  if (!token) {
    res.status(403).json({
      success: false,
      message: "You are not logged in",
    });
  } else {
    try {
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decode;
      if (decode.userRole === "student" || decode.userRole === "admin") {
        return next();
      } else {
        return res.status(401).json({
          success: false,
          message: " You are not student",
        });
      }
    } catch (error) {
      console.log("invalid token");
      return res.status(401).json({
        success: false,
        message: " Invalid token",
        error,
      });
    }
  }
};

const verifyTokenAndAdmin = (req, res, next) => {
  console.log("verifyTokenAndAdmin is running ");
  var token = "";
  try {
    token = req.cookies.token;
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "error getting token",
    });
  }

  if (!token) {
    res.status(403).json({
      success: false,
      message: "You are not logged in",
    });
  } else {
    try {
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decode;
      if (decode.userRole === "admin") {
        return next();
      } else {
        return res.status(401).json({
          success: false,
          message: " You are not admin",
        });
      }
    } catch (error) {
      console.log("invalid token");
      return res.status(401).json({
        success: false,
        message: " Invalid token",
        error,
      });
    }
  }
};

const verifyTokenAndTeacher = (req, res, next) => {
  console.log("verifyTokenAndTeacher is running ");
  var token = "";
  try {
    token = req.cookies.token;
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "error getting token",
    });
  }

  if (!token) {
    res.status(403).json({
      success: false,
      message: "You are not logged in",
    });
  } else {
    try {
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decode;
      if (decode.userRole === "teacher" || decode.userRole === "admin") {
        return next();
      } else {
        return res.status(401).json({
          success: false,
          message: " You are not Teacher",
        });
      }
    } catch (error) {
      console.log("invalid token");
      return res.status(401).json({
        success: false,
        message: " Invalid token",
        error,
      });
    }
  }
};

const verifyTokenAndHod = (req, res, next) => {
  console.log("verifyTokenAndHod is running ");
  var token = "";
  try {
    token = req.cookies.token;
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "error getting token",
    });
  }

  if (!token) {
    res.status(403).json({
      success: false,
      message: "You are not logged in",
    });
  } else {
    try {
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decode;
      if (decode.userRole === "hod" || decode.userRole === "admin") {
        return next();
      } else {
        return res.status(401).json({
          success: false,
          message: " You are not hod",
        });
      }
    } catch (error) {
      console.log("invalid token");
      return res.status(401).json({
        success: false,
        message: " Invalid token",
        error,
      });
    }
  }
};

const verifyTokenAndHodOrTeacherOrAdmin = (req, res, next) => {
  console.log("verifyTokenAndHod is running ");
  var token = "";
  try {
    token = req.cookies.token;
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "error getting token",
    });
  }

  if (!token) {
    res.status(403).json({
      success: false,
      message: "You are not logged in",
    });
  } else {
    try {
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decode;
      if (
        decode.userRole === "hod" ||
        decode.userRole === "teacher" ||
        decode.userRole === "admin"
      ) {
        return next();
      } else {
        return res.status(401).json({
          success: false,
          message: " You are not hod or teacher or admin",
        });
      }
    } catch (error) {
      console.log("invalid token");
      return res.status(401).json({
        success: false,
        message: " Invalid token",
        error,
      });
    }
  }
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndTeacher,
  verifyTokenAndHod,
  verifyTokenAndStudent,
  verifyTokenAndHodOrTeacherOrAdmin,
};
