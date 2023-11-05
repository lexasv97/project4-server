const Lesson = require('../models/Lesson')

const canCreatorEdit = (req,res,next) => {

    Lesson.findById(req.params.lessonId)
    .populate('owner')
    .then((foundLesson) => {
        if (foundLesson.owner._id.toString() === req.session.creator._id) {
            req.session.creator.canCreatorEdit = true;
            next()
        } 
        else {
            req.session.creator.canCreatorEdit = false;
            next()
        }
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
}

module.exports = canCreatorEdit