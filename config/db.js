// Importar mongoose
const mongoose = require('mongoose');
// Inportar dotenv y acceder a su metodo [config], ubicación del erchivo .env
require('dotenv').config({path: 'variables.env'});

// Función que conectara con la DB
const connectDB = async () => {
  try {
    // Conectar a la dirección designada en la variable de entorno
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    
    console.log('DB is connect');
  } catch (error) {
    console.log('There was an error');
    console.log(error);
    process.exit(1); // Detener la app
  }
}

module.exports = connectDB;