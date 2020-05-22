const mongoose = require('mongoose');

// crear el esquema para el registro del usuario (vendedor)
const ClientSchema = mongoose.Schema({
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
  company: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
    inique: true
  },
  phone: {
    type: String,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now()
  },
  // Relation type with User (seller)
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

/*
  Exportar el esquema con el metodo [.model()] que recibe dos parametros 
  Nombre asignado al modelo y el esquema en el cual se basara la estructura
*/
module.exports = mongoose.model('Client', ClientSchema);