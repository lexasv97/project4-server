const { Schema, model } = require('mongoose')

const creatorSchema = new Schema(
    {
      email: String,
      password: String,
      fullName: String,
      occupation: String,
      profileImage: {
        type: String,
        default: '/images/blankProfile.png'
    }
  },
    {
      timestamps: true
    }
  );

module.exports = model('Creator', creatorSchema)