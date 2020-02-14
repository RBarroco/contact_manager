const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../models/User'); //define our User based on that Model;

// @route   GET  api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST  api/auth
// @desc    Auth user & get token / sing in
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email: email }); //if the user exists we can access it afterwards;
      if (!user) {
        return res.status(400).json({ msg: "Email doesn't exists" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Password doesn't match" });
      }

      //payload that goes with the webToken after being signed in to the id together;
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000 //webToken expires
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      //Once we grab our user + Token we need to use  a middleware to validate our user;
    } catch (err) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
