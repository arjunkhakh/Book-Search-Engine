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

        const token = signToken(user);
        return ({ token, user });
    },

    addUser: async (parent, { username, email, password }) => {
        const user = User.create({ username, email, password });

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