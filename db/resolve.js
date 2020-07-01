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
    getUser: async (_, {}, ctx) => {

      return ctx;

    },
    // PRODUCTS
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
    // CLIENTS
    getClients: async () => {

      try {
        
        return await Client.find({});

      } catch (error) {
        console.log(error);
      }

    },
    getSellerClients: async (_, {}, ctx) => {
      // console.log(ctx);
      
      try {
        const clients = await Client.find({seller: ctx.id.toString()});
        // console.log(clients);

        return clients;
        
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
    },
    // ORDERS
    getOrders: async () => {
      try {

        return await Order.find({});
        
      } catch (error) {
        console.log(error);
      }
    },
    getOrder: async (_, { id }) => {
      // Comprobar que la orden exista
      const order = await Order.findById(id);
      if(!order){
        throw new Error('Order not found');
      } 

      return order;
    },
    getSellerOrders: async (_, { }, ctx) => {

      try{
        const orders = await Order.find({seller: ctx.id});
  
        // Filtrar resultados solamente del usuario (vendedor) logeado
        // const result = orders.filter(orderItem => orderItem.seller.toString() === ctx.id);
        
        return orders;
        
      }catch(error){
        console.log(error)
      }
    },
    getSellerOrder: async (_, { id }, ctx) => {
      // Revisar si la orden existe
      const orderExist = await Order.findById(id);
      if(!orderExist){
        throw new Error('Order not found');
      }
      
      // Validar que la orden del cliente pertenesca al vendedor 
      if(orderExist.seller.toString() !== ctx.id){
        throw new Error("You don't have the credentials for this client");
      }

      return orderExist;
    },
    getStatusOrders: async (_, { state }, ctx) => {
      try {

        return await Order.find({state: state, seller: ctx.id});
        
      } catch (error) {
        console.log(error);
      }
    },
    // ADVANCED
    getBestClients: async () => {
      // [aggregate] -> Realiza multiples operaciones y devuelve un valor
      const clients = await Order.aggregate([
        // Filtra elementos. Se puede usar tanto antes de la agregación (sería el where de SQL) como después (sería el having).
        { $match: { state: "COMPLETED" } },
        // En base a los resultados, separar por ID de cliente y sumar
        // el total de sus ventas
        { $group: {
          // Es el modelo, pero en minusculas
          // De este modelo obtenemos los ID para separar por cliente
            _id: "$client",
          // Dato a sumar de los resultados
            total: { $sum: "$total" }
        } },
        {
          // únir a varias colecciones [join]
          $lookup: {
            // colección para unirse
            from: 'clients',
            // campo de los documentos de entrada
            localField: '_id',
            // campo de los documentos de la colección "de"
            foreignField: "_id",
            // campo de matriz de salida
            as: "client"
          }
        },
        {
          $sort: { total: -1 }
        }
      ]);

      return clients
    },
    getBestSeller: async () => {
      const sellers = await Order.aggregate([
        { $match: { state: "COMPLETED" } },
        { $group: {
          _id: '$seller',
          total: { $sum: '$total' }
        } },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'seller'
          }
        },
        {
          $limit: 3
        },
        {
          $sort: { total: -1 }
        }
      ])

      return sellers;
    },
    serchProduct: async (_, { text }) => {
      const products = await Product.find({ $text: { $search: text } }).limit(10);

      return products;
    }
  },
  Mutation: {
    // USERS
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
      // console.log(input.password);

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
        throw new Error('The password is not correct');
      }

      // Crear el token
      return {
        token: createToken(userExist, process.env.KEY_WORD, '24h')
      }
    },
    // PRODUCTS
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
    deleteProduct: async (_, { id }) => {
      // console.log(id);
      let product = await Product.findById(id);
      if(!product){
        throw new Error('Product not found');
      }

      await Product.findOneAndDelete({_id: id });

      return 'The product was removed';
    },
    // CLIENTS
    // (ctx) -> Es el contexto que vamos a extraer de los Headers para asignar el ID
    // que viene encapsulado dentro del token de autenticación
    newClient: async (_, { input }, ctx) => {
      // console.log(input);
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
    deleteClient: async (_, { id }, ctx) => {
      // console.log(id);
      // Revisar si el cliente existe
      let client = await Client.findById(id.toString());
      
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
    // ORDERS
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
      // Operador asincrono para iteraciones de Nodeç
      for await ( const orderItem of order ){
        const { id, quantity } = orderItem;
        const productitem = await Product.findById(id);
        if(!productitem){
          throw new Error('Product not found');
        }
        if(quantity > productitem.exist){
          throw new Error(`PRODUCT: ${productitem.name} - There is not enough stock to fulfill the order`);
        }else{
          productitem.exist = productitem.exist - quantity;

          await productitem.save();        
        };
      }

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
    },
    updateOrder: async (_, { id, input }, ctx) => {

      const { order } = input;

      // Revisar si la orden existe
      let orderExist = await Order.findById(id);
      if(!orderExist){
        throw new Error('Order not found');
      }
      
      // Revisar que el cliente existe
      let clientExist = await Client.findById(input.client);
      if(!clientExist){
        throw new Error('Client not found');
      }

      
      // Validar que la orden del cliente pertenesca al vendedor 
      if(orderExist.seller.toString() !== ctx.id){
        throw new Error("You don't have the credentials for this client");
      }

      // revisar el Stock
      for await ( const orderItem of order ){
        const { id, quantity } = orderItem;
        const productitem = await Product.findById(id);
        if(!productitem){
          throw new Error('Product not found');
        }
        const { name } = productitem;
        if(quantity > productitem.exist){
          throw new Error(`There is not enough stock to fulfill the order of the product: ${name}`);
        }else{
          productitem.exist = productitem.exist - quantity;

          await productitem.save();        
        };
      }
      
      // Actualizar Order
      orderExist = await Order.findOneAndUpdate({_id: id}, input, { new: true });

      return orderExist;
    },
    deleteOrder: async (_, { id }, ctx) => {

      // Revisar si la orden existe
      let orderExist = await Order.findById(id);
      if(!orderExist){
        throw new Error('Order not found');
      }

      // Validar que la orden del cliente pertenesca al vendedor 
      if(orderExist.seller.toString() !== ctx.id){
        throw new Error("You do not have the credentials to delete the order from this customer.");
      }

      await Order.findByIdAndDelete(id);

      return 'The order was deletd successfully'
    }
  }
}

module.exports = resolvers;