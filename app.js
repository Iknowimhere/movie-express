const express = require("express");
const router = require("./routes/movieRoutes");
const authRouter = require("./routes/authRoutes");
const mongoose = require("mongoose");
const CustomError = require("./utils/CustomError");
const globalErrorHandler = require("./controllers/errorControllers");
let app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.json());
app.use("/app/v1/movies", router);
app.use("/app/v1/users", authRouter);
//default route
app.all("*", (req, res, next) => {
  const err = new CustomError(`cant get ${req.originalUrl}`, 404);
  next(err);
});

// err handling middleware
app.use(globalErrorHandler);

module.exports = app;
