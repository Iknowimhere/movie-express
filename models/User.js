const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const authSchema = new Schema(
  {
    user: {
      type: String,
      required: [true, "user field cant be empty"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    email: {
      type: String,
      required: [true, "email field cant be empty"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password field cant be empty"],
      minlength: [8, "password should contain minimum 8 characters"],
    },
    confirmPassword: {
      type: String,
      required: [true, "please confirm your password"],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "password and confirm password doesn't match",
      },
    },
    passwordChangedAt: Date,
    randomHashedToken: String,
    tokenExpiresAt: Date,
  },
  {
    timestamps: true,
  }
);

authSchema.pre("save", async function (next) {
  // if (!this.isModified(this.password)) return next();
  //hash the password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

authSchema.methods.confirmPwd = async function (pwd, pwdDB) {
  return await bcrypt.compare(pwd, pwdDB);
};

authSchema.methods.isPasswordChanged = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimeStamp = this.passwordChangedAt.getTime() / 1000;
    return passwordChangedTimeStamp > JWTTimeStamp;
  }
  return false;
};

authSchema.methods.generateForgotPwdToken = function () {
  const randomToken = crypto.randomBytes(32).toString("hex");
  this.randomHashedToken = crypto
    .createHash("sha256", "secret")
    .update(randomToken)
    .digest("hex");
  this.tokenExpiresAt = Date.now() + 10 * 60 * 1000;
};
module.exports = model("user", authSchema);
