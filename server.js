const mongoose = require("mongoose");

require("dotenv").config();

const app = require("./app");

const {DB_HOST, PORT=3000} = process.env;

// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000");
// });
mongoose.set('strictQuery', true);

mongoose.connect(DB_HOST)
  .then(() => {
    // console.log("DB conected");
    app.listen(PORT, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
