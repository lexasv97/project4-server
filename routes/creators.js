var express = require('express');
var router = express.Router();

const Lesson = require('../models/Lesson')

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const { isCreatorLoggedIn } = require('../middleware/creator-route-guard');

const Creator = require('../models/Creator');

router.get('/creator-profile', isCreatorLoggedIn, (req, res, next) => {

    Lesson.find({
        owner: req.session.creator._id
    })
        .then((lessons) => {
            console.log("Found lessons ===>", lessons)
            res.render('users/creator-profile.hbs', { creator: req.session.creator, lessons: lessons })
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
});

router.get('/update-creator-profile', isCreatorLoggedIn, (req, res, next) => {

    res.render('creator-auth/update-creator-profile.hbs', req.session.creator)
})

router.post('/update-creator-profile', isCreatorLoggedIn, (req, res, next) => {

    const { fullName, email, password, occupation } = req.body;

    console.log("REQ.BODY===>", req.body)

    Creator.findById(req.session.creator._id)
        .then((foundProfile) => {
            if (password) {
                bcryptjs
                    .genSalt(saltRounds)
                    .then((salt) => bcryptjs.hash(password, salt))
                    .then((hashedPassword) => {
                        return Creator.findByIdAndUpdate(
                            foundProfile._id,
                            {
                                fullName,
                                email,
                                password: hashedPassword,
                                occupation: occupation
                            },
                            { new: true })
                    })
                    .then((updatedCreator) => {
                        req.session.creator = updatedCreator
                        console.log("Updated ====>", updatedCreator)
                        res.redirect('/creators/creator-profile')
                    })
                    .catch((err) => {
                        console.log(err)
                        next(err)
                    })

            } else {
                Creator.findByIdAndUpdate(
                    foundProfile._id,
                    {
                        fullName,
                        email,
                        occupation: occupation
                    },
                    { new: true })
                    .then((updatedCreator) => {
                        req.session.creator = updatedCreator
                        console.log("Updated ====>", updatedCreator)
                        res.redirect('/creators/creator-profile')
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