const { signup, login, forgotPassword } = require("../controllers/authControllers");

const router = require("express").Router();

router.route("/signup").post(signup);
router.route("/login").post(login);


router.route('/forgot-password').post(forgotPassword)
module.exports = router;
