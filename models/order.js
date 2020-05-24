const mongoose = require('mongoose');

// crear el esquema para el registro del usuario (vendedor)
const OrderSchema = mongoose.Schema({
  order: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  // Relation type with Client
  client: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Client'
  },
  // Relation type with User (seller)
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  state: {
    type: String,
    default: 'PENDING'
  },
  created: {
    type: Date,
    default: Date.now()
  },
})

/*
  Exportar el esquema con el metodo [.model()] que recibe dos parametros 
  Nombre asignado al modelo y el esquema en el cual se basara la estructura
*/
module.exports = mongoose.model('Order', OrderSchema);