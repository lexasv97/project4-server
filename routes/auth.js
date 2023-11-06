var express = require('express');
var router = express.Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User')

router.post('/signup', (req,res,next) => {

    const {name, email,password, occupation} = req.body;

    if (name === "" || email === "" || password === "") {
      res.status(400).json({ message: "Provide email, password and name" });
        return;
    }

    // Use regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Provide a valid email address." });
        return;
    }

    User.findOne({ email })
    .then((foundUser) => {
        if (!foundUser) {
            bcryptjs
            .genSalt(saltRounds)
            .then((salt) => bcryptjs.hash(password, salt))
            .then((hashedPassword) => {
                return User.create({
                    name,
                    email,
                    password: hashedPassword,
                    occupation
                })
            })
            .then((createdUser) => {
                console.log('Newly created user is: ', createdUser);
                req.session.user = createdUser;
                console.log('Session after signup ===> ', req.session)
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ message: "Internal Server Error" });

              });
        } else {
          res.status(400).json({ message: "User already exists." });
          return;
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
      });
})

router.post('/login', (req,res,next) => {
    console.log('Session ===> ', req.session);
    const {email,password} = req.body;

    if (email === "" || password === "") {
      res.status(400).json({ message: "Provide email and password." });
      return;
  }


      User.findOne({email})
      .then((user) => {
        if (!user) {
          res.status(401).json({ message: "User not found." });
          return;
        } 
        else if (bcryptjs.compareSync(password, user.password)) {

            req.session.user = user
            console.log("Session after success ===>", req.session)
        } else {
            console.log("Incorrect password. ");
            res.status(401).json({ message: "Unable to authenticate the user" });
        }
      })
      .catch(error => next(error));
})

module.exports = router;