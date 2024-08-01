const express = require('express');
const { signup, login, verifyEmail, otpLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/otp-login', otpLogin);

module.exports = router;
