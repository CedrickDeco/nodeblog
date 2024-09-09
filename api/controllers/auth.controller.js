const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const userModel = require('../models/user');
const { errorHandler } = require('../utils/error')
const crypto = require('crypto-js')
// const jwt = require('jsonwebtoken')



// const maxAge = 3 * 24 * 60 * 60 * 1000;

// const createToken = (id) => {
//   return jwt.sign({ id }, process.env.TOKEN_SECRET, {
//     expiresIn: maxAge
//   })
// };





module.exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    next(errorHandler(400, 'All fields are required'));
  }

  const emailCrypto = crypto.HmacSHA256(req.body.email, process.env.CLE_EMAIL_CRYPTO).toString()
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new userModel({
    username,
    email: emailCrypto,
    password: hashedPassword
  });


  await newUser.save()
    .then(() => res.status(201).json({
      message: 'User saved successfully',
      content: newUser
    }))
    .catch((error) => res.status(500).json(error).send(console.log(error)))
}

module.exports.signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await userModel.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }

    const token = createToken(userModel._id)

    // const token = jwt.sign(
    //   { id: validUser._id, isAdmin: validUser.isAdmin },
    //   process.env.JWT_SECRET
    // );

    const { password: pass, ...rest } = validUser._doc; // cette ligne permet d'enlever le password dans le resultat rendu

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
        maxAge
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
}

module.exports.google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new userModel({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
}