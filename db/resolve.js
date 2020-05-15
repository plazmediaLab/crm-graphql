const User = require('../models/user');
const bcryptjs = require('bcryptjs');

// Resolvers
const resolvers = {
  Query: {
    getCourse: () => 'Some thing...'
  },
  Mutation: {
    newUser: async (_, { input }) => {

      const { email, password } = input;

      // Revisar si el usuario ya esta registrado
      const userExist = await User.findOne({email});
      if(userExist){
        throw new Error('The user is already exist')
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
    }
  }
}

module.exports = resolvers;