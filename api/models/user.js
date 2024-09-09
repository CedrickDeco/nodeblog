const mongoose = require('mongoose')
// Importation de mongoose unique validator
// const uniqueValidator = require('mongoose-unique-validator')


const UserShema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true
    },
    email: {
      type: String,
      require: true
    },
    password: {
      type: String,
      require: true
    },
    // profilePic: {
    //   type: String,
    //   require: false,
    //   default: ""
    // }
  },
  {
    timestamps: true
  }
)

// // Securité pour ne pas enregistrer deux user ayant le même email
// UserShema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserShema) 
