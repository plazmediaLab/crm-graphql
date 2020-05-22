const mongoose = require('mongoose');

// crear el esquema para el registro del usuario (vendedor)
const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  exist: {
    type: Number,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
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
module.exports = mongoose.model('Product', ProductSchema);