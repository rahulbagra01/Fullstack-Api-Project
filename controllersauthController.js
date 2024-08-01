const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Email Verification',
      text: `Your OTP is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });

    res.status(201).json({ message: 'User registered, please check your email for OTP' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email, otp });

    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email' });
    }

    const token = generateToken(user._id);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.otpLogin = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email, otp });

    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email' });
    }

    const token = generateToken(user._id);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
