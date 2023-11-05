var express = require('express');
var router = express.Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User')

const { isCreatorLoggedOut } = require('../middleware/creator-route-guard')

router.get('/user-signup', (req, res, next) => {

    res.render('user-auth/user-signup.hbs')

})

router.post('/user-signup', (req,res,next) => {

    const {fullName, email,password, occupation} = req.body;

    if (!fullName || !email || !password) {
        res.render("user-auth/user-signup.hbs", {
          errorMessage:
            "All fields are mandatory. Please provide your full name, email and password.",
        });
        return;
    }

    User.findOne({
        email
    })
    .then((foundUser) => {
        if (!foundUser) {
            bcryptjs
            .genSalt(saltRounds)
            .then((salt) => bcryptjs.hash(password, salt))
            .then((hashedPassword) => {
                return User.create({
                    fullName,
                    email,
                    password: hashedPassword,
                    occupation: occupation
                })
            })
            .then((createdUser) => {
                console.log('Newly created user is: ', createdUser);
                req.session.user = createdUser;
                console.log('Session after signup ===> ', req.session)
                res.redirect('/user/user-profile');
            })
            .catch((error) => {
                console.log(error);
                next(error);
              });
        } else {
            res.render('user-auth/user-signup.hbs', {
                errorMessage: "Email or username already taken."
            })
            return;
        }
    })
    .catch((error) => {
        console.log(error);
        next(error);
      });
})

router.get("/user-login", isCreatorLoggedOut, (req, res, next) => {
    
  res.render("user-auth/user-login.hbs")
})

router.post('/user-login', isCreatorLoggedOut, (req,res,next) => {
    console.log('Session ===> ', req.session);
    const {email,password} = req.body;

    if (email === '' || password === '') {
        res.render('user-auth/user-login', {
          errorMessage: 'Please enter both email and password to login.'
        });
        return;
      }

      User.findOne({email})
      .then((user) => {
        if (!user) {
            console.log("Email not registered. ");
            res.render('user-auth/user-login', { errorMessage: 'User not found and/or incorrect password.' })
            return
        } else if (bcryptjs.compareSync(password, user.password)) {

            req.session.user = user
            console.log("Session after success ===>", req.session)
            res.redirect('/user/user-profile')
        } else {
            console.log("Incorrect password. ");
            res.render('user-auth/user-login.hbs', { errorMessage: 'User not found and/or incorrect password.' } )
        }
      })
      .catch(error => next(error));
})

router.get('/user-logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });

module.exports = router;