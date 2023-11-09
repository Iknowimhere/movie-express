const User = require("../models/User");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/CustomError");
const sendMail = require("../utils/email");

const genToken = async function (id) {
  return await jwt.sign({ id }, process.env.SECRET, {
    expiresIn: 24 * 60 * 60,
  });
};

const signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = await genToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

const login = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;

  if (!email || !password) {
    const err = new CustomError("Please provide email and password", 400);
    return next(err);
  }
  const user = await User.findOne({ email: email });
  if (!user || !(await user.confirmPwd(password, user.password))) {
    const err = new CustomError("Invalid user or password", 400);
    return next(err);
  }
  const token = await genToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

//middleware to protect routes

const protect = asyncErrorHandler(async (req, res, next) => {
  //check if the token exists
  const testToken = req.headers.authorization;
  let token;
  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }

  if (!token) {
    const error = new CustomError(`Please login to access route`, 401);
    next(error);
  }

  //if token is present, validate the token
  const decodedToken = await jwt.verify(token, process.env.SECRET);
  //check if user exists
  const user = await User.findById(decodedToken.id);

  if (!user) {
    const err = new CustomError(
      "User doesn't exist please login once again",
      401
    );
    next(err);
  }
  //check for any changed password
  if (user.isPasswordChanged(decodedToken.iat)) {
    const err = new CustomError(
      `Password has been changed please login once again`,
      401
    );
    next(err);
  }

  //permit the user
  req.user = user;
  next();
});

const restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const err = new CustomError(
        "your'e not authorized to perform this operation",
        403
      );
      return next(err);
    }
    next();
  };
};

const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    const err = new CustomError("There is no user with this mail id", 404);
    next(err);
  }

  user.generateForgotPwdToken();

  await user.save({ validateBeforeSave: false });
  const link = `${req.protocol}://localhost:5000/reset-password/${user.randomHashedToken}`;
  const message = `This is the password reset link ${link} and this link will be valid for only 10 minutes`;
  console.log(message);
  try {
    await sendMail({
      email: user.email,
      subject: "Password reset link",
      message: message,
    });
    res.status(200).json({
      status: "success",
      message: "Password reset link has been sent to your mail",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});
module.exports = {
  signup,
  login,
  protect,
  restrict,
  forgotPassword,
};
