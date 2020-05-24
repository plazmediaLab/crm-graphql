const User = require('../models/user');
const Product = require('../models/product');
const Client = require('../models/client');
const Order = require('../models/order');
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

    },
    getClients: async () => {

      try {
        
        return await Client.find({});

      } catch (error) {
        console.log(error);
      }

    },
    getSellerClients: async (_, { }, ctx) => {
      
      try {

        return await Client.find({seller: ctx.id.toString()});
        
      } catch (error) {
        console.log(error);
      }
      
    },
    getSellerClient: async (_, { id }, ctx) => {
      // Revisar si el cliente existe
      const client = await Client.findById(id);
      if(!client){
        throw new Error('Client not found');
      }
      
      // Validar que el cliente pertenezca al vendedor 
      if(client.seller.toString() !== ctx.id){
        throw new Error("You don't have the credentials for this client");
      }

      return client;
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
      console.log(id);
      let product = await Product.findById(id);
      if(!product){
        throw new Error('Product not found');
      }

      await Product.findOneAndDelete({_id: id });

      return 'The product was removed';
    },
    // (ctx) -> Es el contexto que vamos a extraer de los Headers para asignar el ID
    // que viene encapsulado dentro del token de autenticación
    newClient: async (_, { input }, ctx) => {
      const { email } = input;
      // Verificar que el cliente ya este regitrado
      const client = await Client.findOne({email: email})
      if(client){
        throw new Error('This client is already exist');
      }

      // Nueva instancia de Client
      const newClient = new Client(input);

      // Asignar el vendedor
      newClient.seller = ctx.id;

      try {
        // Guardarlo en la DB
        const result = await newClient.save();
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    updateClient: async (_, { id, input }, ctx) => {
      // Revisar si el cliente existe
      let client = await Client.findById(id);
      
      if(!client){
        throw new Error('Client not found');
      }

      // Validar que el cliente pertenezca al vendedor 
      if(client.seller.toString() !== ctx.id){
        throw new Error("You don't have the credentials for this client");
      }

      // Actualizar cliente
      client = await Client.findOneAndUpdate({_id: id}, input, { new: true });

      return client;
    },
    deletClient: async (_, { id }, ctx) => {
      console.log(id);
      // Revisar si el cliente existe
      let client = await Client.findById(id.toString());
      console.log(client);
      if(!client){
        throw new Error('Client not found');
      }

      // Validar que el cliente pertenezca al vendedor 
      if(client.seller.toString() !== ctx.id){
        throw new Error("You don't have the credentials for this client");
      }
      // Eliminar Cliente
      await Client.findOneAndDelete({_id: id });

      return 'The client was removed';
    },
    newOrder: async (_, { input }, ctx) => {

      const { order, client } = input;

      // Verificar si el cliente existe
      let clientExist = await Client.findById(client);
      
      if(!clientExist){
        throw new Error('Client not found');
      }
      
      // Verificar si el cliente es del vendedor 
      if(clientExist.seller.toString() !== ctx.id){
        throw new Error("You don't have the credentials for this client");
      }
      
      // Revisar que el stock del producto este disponible
      order.map(async item => {
        // Verificar que el producto exixta
        const { id, quantity } = item;
        const productitem = await Product.findById(id);
        if(!productitem){
          throw new Error('Product not found');
        }
        if(quantity > productitem.exist){
          throw new Error('There is not enough stock to fulfill the order');
        };
      });

      // Nueva instancia de Client
      const newOrder = new Order(input);

      // Asignar el vendedor
      newOrder.seller = ctx.id;

      // Guardarlo en la DB
      try {
        // Guardarlo en la DB
        const result = await newOrder.save();
        return result;
      } catch (error) {
        console.log(error);
      }
    }
  }
}

module.exports = resolvers;