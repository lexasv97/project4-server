const Lesson = require('../models/Lesson')

const isCreatorNotOwner = (req,res,next) => {

    Lesson.findById(req.params.lessonId)
    .populate('owner')
    .then((foundLesson) => {
        console.log('Found lesson ===>', foundLesson)
        console.log("User in session ===>", req.session.creator)
        if (foundLesson.owner._id.toString() !== req.session.creator._id) {
            next()
        } else {
            res.redirect('/lessons/all')
        }
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
}

    module.exports = isCreatorNotOwner