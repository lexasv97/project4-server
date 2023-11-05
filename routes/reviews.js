var express = require('express');
var router = express.Router();

const Review = require('../models/Review')
const Lesson = require('../models/Lesson')

const { isUserLoggedIn } = require('../middleware/user-route-guard');

router.post('/new/:lessonId', isUserLoggedIn, (req, res, next) => {  
    console.log("REQ.BODY ====>", req.body) 
    console.log("LESSON ID ====> ", req.params.lessonId)   

    Review.create({
        user: req.session.user._id,
        comment: req.body.comment,
        rating: req.body.rating
    })
        .then((newReview) => {
            console.log("NEW REVIEW ===>", newReview)
            return Lesson.findByIdAndUpdate(
                req.params.lessonId,
                {
                    $push: { reviews: newReview._id }
                },
                { new: true }
            )
        })
        .then((lessonWithReview) => {
            console.log("Lesson after review ===>", lessonWithReview)
            res.redirect(`/lessons/details/${lessonWithReview._id}`)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
})

module.exports = router;
