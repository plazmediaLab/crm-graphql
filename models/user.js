const mongoose = require('mongoose');

// crear el esquema para el registro del usuario (vendedor)
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  lastname: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now
  }
})

/*
  Exportar el esquema con el metodo [.model()] que recibe dos parametros 
  Nombre asignado al modelo y el esquema en el cual se basara la estructura
*/
module.exports = mongoose.model('User', UserSchema);