// type Query {
//     me: User
//   }

//   type Mutation {
//     login(email: String!, password: String!): Auth
//     addUser(username: String!, email: String!, password: String!): Auth
//     saveBook(): User // Look into this one
//     removeBook(bookId: ID!): User
//     }

const { User } = require('../models')

const resolvers = {
Query: {
    me: async () => {
        return User.find({});
    },
},

Mutation: {
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ 
        $or: [{ email, password }] });

        // const token = signToken(user);
        // return res.json({ token, user });
    },

    addUser: async (parent, { username, email, password }) => {
        return User.create({ username, email, password });
    },

    saveBook: async () => {
        
    },

    removeBook: async (parent, { bookId }) => {
        return User.savedBook.findOneAndDelete({ _id }),
        { $pull: { savedBooks: { bookId } } },
        { new: true };
    },
},
}

module.exports = resolvers;