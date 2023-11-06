var express = require('express');
var router = express.Router();

const Lesson = require('../models/Lesson');

const User = require('../models/User');

const {isCreatorLoggedIn} = require('../middleware/creator-route-guard')

const isCreatorOwner = require('../middleware/isCreatorOwner')

const canCreatorEdit = require('../middleware/canCreatorEdit')

const {isUserLoggedIn} = require('../middleware/user-route-guard')

router.get('/all', (req,res,next) => {
    
    Lesson.find()
    .populate('owner')
    .then((lessons) => {
        console.log("LESSONS ====>", lessons)
        res.render('lessons/all-lessons.hbs', {lessons})
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
})

router.get('/new', (req, res, next) => { // isCreatorLoggedIn

    res.render('lessons/new-lesson.hbs')
    
})

router.post('/new', (req,res,next) => { // isCreatorLoggedIn

    const { name, description, imageUrl, price, type, format } = req.body

    Lesson.create({
        name,
        description,
        imageUrl,
        price,
        type,
        format,
        owner: req.session.creator._id
    })
    .then((createdLesson) => {
        res.redirect('/lessons/all')
        Creator.findByIdAndUpdate(
            req.params.lessonId,
            {
                $push: {lessons: createdLesson._id}
            },
            {new: true}
        )

    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
})

router.get('/details/:lessonId', (req,res,next) => {

    Lesson.findById(req.params.lessonId)
    .populate('owner')
    .populate({
        path:'reviews',
        populate: {path: 'user'}
    })
    .then((lesson) => {
        console.log("This is found lesson ===>", lesson)
        let isOwner = false
        if(req.session && req.session.creator){

             isOwner = req.session.creator._id === String(lesson.owner._id)
        }
        res.render('lessons/lesson-details.hbs', {lesson, reviews: lesson.reviews, isOwner})
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
})

router.get('/edit/:lessonId', (req,res,next) => { // isCreatorLoggedIn, isCreatorOwner,

    Lesson.findById(req.params.lessonId)
    .then((lesson) => {
        res.render('lessons/edit-lessons.hbs', lesson)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

router.post('/edit/:lessonId', (req,res,next) => { // isCreatorLoggedIn, isCreatorOwner

    Lesson.findByIdAndUpdate(
        req.params.lessonId,
        req.body,
        {new: true}
    )
    .then(updatedLesson => {
        res.redirect(`/lessons/details/${updatedLesson._id}`)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
})

router.get('/delete/:lessonId', (req,res,next) => { // isCreatorLoggedIn, isCreatorOwner

    Lesson.findByIdAndRemove(req.params.lessonId)
    .then((deletedLesson) => {
        console.log("Deleted room ==>", deletedLesson)
        res.redirect('/lessons/all')
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
})

router.get('/find', (req, res, next) => {
    
    Lesson.find({type: req.query.lessonType})
    .then((lesson) => {
        console.log(lesson)
        res.render('lessons/find-lesson.hbs', lesson)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
    
})

router.get('/results', (req, res, next) => {

    Lesson.find({type: req.query.lessonType})
    .populate('owner')
    .then((lessons) => {
        console.log(lessons)
        res.render('lessons/results-lessons.hbs', {lessons})
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
})

router.get('/payment-confirmation/:lessonId', (req,res,next) => { // isUserLoggedIn
    const lessonId = req.params.lessonId;
    User.findByIdAndUpdate(
        req.session.user._id,
        {
            $push: {paidLessons: lessonId}
        },
        {new: true}
    )
    .then((updatedUser) => {
        req.session.user = updatedUser;
        res.render('lessons/payment-confirmation-page.hbs')

    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
    
})

module.exports = router;
