const { Schema, model } = require('mongoose')
const lessonSchema = new Schema({
    name: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    price: {type: Number},
    type: {type: String },
    format: {type: String},
    location: {type: String},
    owner: {type: Schema.Types.ObjectId, ref: "Creator" },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]
  },
  {
    timestamps: true
  });

module.exports = model('Lesson', lessonSchema)