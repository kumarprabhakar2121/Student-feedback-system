require("dotenv").config();
const StudentDetails = require("../model/StudentDetails");
const { default: mongoose } = require("mongoose");

let add = async (req, res) => {
  if (!req.user) {
    return res.json({
      success: false,
      msg: "Log in first",
    });
  }

  const user_id = req.user.user_id;
  const {
    course_enrolled,
    session_start_year,
    session_end_year,
    college_roll_number,
  } = req.body;
  if (
    !(
      user_id &&
      mongoose.isValidObjectId(user_id) &&
      course_enrolled &&
      session_start_year &&
      session_end_year &&
      college_roll_number
    )
  ) {
    res.status(400).json({
      msg: `All fields are required:
      course_enrolled,
      session_start_year,
      session_end_year,
      college_roll_number,
        `,
    });
  } else {
    try {
      const updatingDetailsIfAlreadyExists =
        await StudentDetails.findOneAndUpdate(
          { user_id },
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
      try {
        const addUser = await StudentDetails.create({
          user_id,
          course_enrolled,
          session_start_year,
          session_end_year,
          college_roll_number,
        });
        if (addUser) {
          //saved
          res.json({
            success: true,
            msg: `saved successfully`,
            data: addUser,
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

let getAllDetails = async (req, res) => {
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
    const length = await StudentDetails.countDocuments().exec();
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
      result.results = await StudentDetails.find(
        {},
        { __v: 0, createdAt: 0, updatedAt: 0 }
      )
        .limit(limit)
        .skip(startIndex)
        .populate("user_id", ["name", "userRole", "department"]);
      res.paginatedResult = result;
      return res.send(result);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

let getDetailsOfLoggedUser = async (req, res) => {
  try {
    const user = await StudentDetails.findOne({
      user_id: req.user.user_id,
    }).populate("user_id", ["firstName", "lastName", "userRole"]);
    if (user) {
      res.json({
        success: true,
        msg: "details found for logged in user",
        data: user,
      });
    } else {
      res.json({
        success: false,
        msg: "students details not added yet for this user",
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

let getDetailsUsingId = async (req, res) => {
  const { id } = req.params;
  try {
    const operation = await StudentDetails.findById(id).populate("user_id", [
      "firstName",
      "lastName",
      "userRole",
    ]);
    if (operation) {
      return res.json({
        success: true,
        msg: "Details updated!",
        new_data: operation,
      });
    } else {
      res.json({
        success: false,
        msg: "User not found",
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

let updateDetailsOfLoggedUser = async (req, res) => {
  const { user_id } = req.user;
  try {
    const updatingDetailsIfAlreadyExists =
      await StudentDetails.findOneAndUpdate(
        { user_id },
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

let updateDetailsUsingId = async (req, res) => {
  const id = req.params.id;
  try {
    const updatingDetailsIfAlreadyExists =
      await StudentDetails.findByIdAndUpdate(
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

let deleteDetailsOfLoggedUser = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const operation = await StudentDetails.findOneAndDelete({ user_id });
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

let deleteDetailsUsingId = async (req, res) => {
  const id = req.params.id;
  try {
    const operation = await StudentDetails.findByIdAndDelete(id);
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

let verify = async (req, res) => {
  let id = req.params.id;

  try {
    const operation = await StudentDetails.findByIdAndUpdate(
      id,
      { $set: { isVerified: true } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (operation) {
      res.json({
        success: true,
        msg: "student is verified",
      });
    } else {
      res.json({
        success: false,
        msg: "student not found",
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

let unverify = async (req, res) => {
  let id = req.params.id;

  try {
    const operation = await StudentDetails.findByIdAndUpdate(
      id,
      { $set: { isVerified: false } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (operation) {
      res.json({
        success: true,
        msg: "student is unverified",
      });
    } else {
      res.json({
        success: false,
        msg: "student not found",
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
  getDetailsOfLoggedUser,
  updateDetailsOfLoggedUser,
  deleteDetailsOfLoggedUser,
  getAllDetails,
  getDetailsUsingId,
  updateDetailsUsingId,
  deleteDetailsUsingId,
  verify,
  unverify,
};
