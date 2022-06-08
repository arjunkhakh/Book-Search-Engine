const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const { User } = require('../models')

const resolvers = {
Query: {
    me: async () => {
        return User.find({});
    },
},

Mutation: {
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });

        if(!user){
            throw new AuthenticationError('Incorrect email/password');
        }

        const validatePW = await user.isCorrectPassword(password);

        if(!validatePW){
            throw new AuthenticationError('Incorrect email/password');
        }

        const token = signToken(user);
        return { token, user };
    },

    addUser: async (parent, args) => {
        const user = User.create(args);

        const token = signToken(user);

        return { token, user };
    },

    saveBook: async () => {
        return await User.findByIdAndUpdate({ _id: context.user._id }, 
            { $addToSet: { savedBooks: args.input } }, 
            { new: true, runValidators: true });
    },

    removeBook: async (parent, { bookId }) => {
        return await User.savedBook.findOneAndDelete({ _id }),
        { $pull: { savedBooks: { bookId } } },
        { new: true };
    },
},
}

module.exports = resolvers;