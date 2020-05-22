const User = require('../models/user');
const Product = require('../models/product');
const bcryptjs = require('bcryptjs');
// Inportar dotenv y acceder a su metodo [config], ubicación del erchivo .env
require('dotenv').config({path: 'variables.env'});
const jwt = require('jsonwebtoken');

const createToken = (user, key_word, expiresIn) => {
  const { id, name, lastname, email } = user;

  return jwt.sign( { id, name, lastname, email }, key_word, { expiresIn } );
};

// Resolvers
const resolvers = {
  Query: {
    getUser: async (_, { token }) => {
      const userID = await jwt.verify(token, process.env.KEY_WORD);

      return userID;
    },
    getProducts: async () => {

      return await Product.find()

    },
    getProduct: async (_,{ id }) => {

      const product = await Product.findById(id);
      if(!product){
        throw new Error('Product not found');
      } 

      return product;

    }
  },
  Mutation: {
    newUser: async (_, { input }) => {

      const { email, password } = input;

      // Revisar si el usuario ya esta registrado
      const userExist = await User.findOne({email});
      if(userExist){
        throw new Error('The user is already exist');
      } 

      // Hashear su password
      const salt = await bcryptjs.genSaltSync(10);
      input.password = await bcryptjs.hashSync(password, salt);
      console.log(input.password);

      try {
        // Guardarlo en la base de datos
        const user = new User(input);
        user.save(); // Guardarlo
        return user
      } catch (error) {
        console.log(error);
      }
    },
    authUser: async (_, { input }) => {
      const { email, password } = input;

      // Si el usuario existe 
      const userExist = await User.findOne({email});
      if(!userExist){
        throw new Error('The user are not exist');
      }
      
      // Revisar si el password es correcto
      const correctPass = bcryptjs.compareSync(password, userExist.password);
      if(!correctPass){
        throw new Error('The password is correct');
      }

      // Crear el token
      return {
        token: createToken(userExist, process.env.KEY_WORD, '24h')
      }
    },
    newProduct: async (_, { input }) => {
      try {

        const product = Product(input);
        // Almacenar an la DB
        const result = await product.save();

        return result;

      } catch (error) {
        console.log(error);
      }
    },
    updateProduct: async (_, { id, input }) => {
      let product = await Product.findById(id);
      if(!product){
        throw new Error('Product not found');
      }
      
      product = await Product.findOneAndUpdate({_id: id}, input, { new: true });

      return product;
    },
    deletProduct: async (_, { id }) => {
      let product = await Product.findById(id);
      if(!product){
        throw new Error('Product not found');
      }

      await Product.findOneAndDelete({_id: id });

      return 'The product was removed';
    }
  }
}

module.exports = resolvers;