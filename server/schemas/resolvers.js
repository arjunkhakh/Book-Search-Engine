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

    saveBook: async (parent, {bookInfo}, context) => {
        if(context.user){
            const userBook = await User.findByIdAndUpdate({ _id: context.user._id }, 
                { $addToSet: { savedBooks: bookInfo } }, 
                { new: true, runValidators: true });
                return userBook
        }

        throw new AuthenticationError('You Must Be Logged In!');
    },

    removeBook: async (parent, { bookId }, context) => {

        if(context.user){
        const deleteBook = await User.savedBook.findOneAndDelete({ _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true });
        return deleteBook;
        }
        throw new AuthenticationError('You Must Be Logged In!');
    },
},
}

module.exports = resolvers;