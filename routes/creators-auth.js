var express = require('express');
var router = express.Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const Creator = require('../models/Creator')

const { isUserLoggedOut } =require('../middleware/user-route-guard')

router.get('/creator-signup', (req, res, next) => {

    res.render('creator-auth/creator-signup.hbs')

})

router.post('/creator-signup', (req,res,next) => {

    const {fullName, email,password, occupation} = req.body;

    if (!fullName || !email || !password) {
        res.render("creator-auth/creator-signup.hbs", {
          errorMessage:
            "All fields are mandatory. Please provide your full name, email and password.",
        });
        return;
    }

    Creator.findOne({
        email
    })
    .then((foundCreator) => {
        if (!foundCreator) {
            bcryptjs
            .genSalt(saltRounds)
            .then((salt) => bcryptjs.hash(password, salt))
            .then((hashedPassword) => {
                return Creator.create({
                    fullName,
                    email,
                    password: hashedPassword,
                    occupation: occupation
                })
            })
            .then((createdCreator) => {
                console.log('Newly created creator is: ', createdCreator);
                req.session.creator = createdCreator;
                console.log('Session after signup ===> ', req.session)
                res.redirect('/creators/creator-profile');
            })
            .catch((error) => {
                console.log(error);
                next(error);
              });
        } else {
            res.render('creator-auth/creator-signup.hbs', {
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

router.get('/creator-login', isUserLoggedOut, (req, res, next) => {
  res.render('creator-auth/creator-login.hbs')
})

router.post('/creator-login', isUserLoggedOut, (req,res,next) => {
    console.log('Session ===> ', req.session);
    const {email,password} = req.body;

    if (email === '' || password === '') {
        res.render('creator-auth/creator-login', {
          errorMessage: 'Please enter both email and password to login.'
        });
        return;
      }

      Creator.findOne({email})
      .then((creator) => {
        if (!creator) {
            console.log("Email not registered. ");
            res.render('creator-auth/creator-login', { errorMessage: 'User not found and/or incorrect password.' })
            return
        } else if (bcryptjs.compareSync(password, creator.password)) {

            req.session.creator = creator
            console.log("Session after success ===>", req.session)
            res.redirect('/creators/creator-profile')
        } else {
            console.log("Incorrect password. ");
            res.render('creator-auth/creator-login.hbs', { errorMessage: 'Creator not found and/or incorrect password.' } )
        }
      })
      .catch(error => next(error));
})

router.get('/creator-logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });

module.exports = router;