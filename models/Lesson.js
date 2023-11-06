const { Schema, model } = require('mongoose')
const lessonSchema = new Schema({
    name: String,
    description: String,
    imageUrl: String,
    price: String,
    type: String,
    format: String,
    location: String,
    owner: {type: Schema.Types.ObjectId, ref: "User" },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]
  },
  {
    timestamps: true
  });

module.exports = model('Lesson', lessonSchema)