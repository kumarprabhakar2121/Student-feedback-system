const mongoose = require("mongoose");

const { MONGODB_URL } = process.env;

exports.connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/SFS", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    .then(console.log(`DB CONNECTED SUCCESSFULLY`))

    .catch((error) => {
      console.log("DB Connection Failed!");
      console.log(error);
      process.exit(1);
    });
};
