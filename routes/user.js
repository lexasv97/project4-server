var express = require('express');
var router = express.Router();

const Lesson = require('../models/Lesson')

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const {isUserLoggedIn} = require('../middleware/user-route-guard')

const User = require('../models/User');

router.get('/user-profile', isUserLoggedIn, (req, res, next) => {

    User.findById(req.session.user._id)
    .populate({
        path: "paidLessons",
        populate: {
        path: "owner"
        }
    })
    .then((user) => {
        if(user){
            console.log("FOUND USER ===>", user)
            res.render('users/user-profile.hbs', { user})
        }
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
    
});

router.get('/update-user-profile', isUserLoggedIn, (req, res, next) => {

    res.render('user-auth/update-user-profile.hbs', req.session.user)
})

router.post('/update-user-profile', isUserLoggedIn, (req, res, next) => {

    const { fullName, email, password } = req.body;

    console.log("REQ.BODY===>", req.body)

    User.findById(req.session.user._id)
        .then((foundProfile) => {
            if (password) {
                bcryptjs
                    .genSalt(saltRounds)
                    .then((salt) => bcryptjs.hash(password, salt))
                    .then((hashedPassword) => {
                        return User.findByIdAndUpdate(
                            foundProfile._id,
                            {
                                fullName,
                                email,
                                password: hashedPassword
                            },
                            { new: true })
                    })
                    .then((updatedUser) => {
                        req.session.user = updatedUser
                        console.log("Updated ====>", updatedUser)
                        res.redirect('/user/user-profile')
                    })
                    .catch((err) => {
                        console.log(err)
                        next(err)
                    })

            } else {
                User.findByIdAndUpdate(
                    foundProfile._id,
                    {
                        fullName,
                        email
                    },
                    { new: true })
                    .then((updatedUser) => {
                        req.session.user = updatedUser
                        console.log("Updated ====>", updatedUser)
                        res.redirect('/user/user-profile')
                    })
                    .catch((err) => {
                        console.log(err)
                        next(err)
                    })
            }

        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
})

module.exports = router;