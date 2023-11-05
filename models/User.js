const { Schema, model } = require('mongoose')

const userSchema = new Schema(
    {
      email: String,
      password: String,
      fullName: String,
      occupation: String,
      profileImage: {
        type: String,
        default: '/images/blankProfile.png'
    },
      paidLessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }]
    },
    {
      timestamps: true
    }
  );

module.exports = model('User', userSchema)