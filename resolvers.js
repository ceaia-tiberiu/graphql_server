export default {
    User: {
        boards: ({ id }, args, { models }) =>
            models.Board.findAll({
                where: {
                    owner: id
                }
            }),
        suggestions: ({ id }, args, { models }) =>
            models.Suggestion.findAll({
                where: {
                    creatorId: id
                }
            })
    },

    Board: {
        suggestions: ({ id }, args, { models }) =>
            models.Suggestion.findAll({
                where: {
                    boardId: id
                }
            })
    },

    Suggestion: {
        creatorUsername: async ({ creatorId }, args, { models }) => {
            const { username } = await models.User.findOne({
                where: {
                    id: creatorId
                }
            });

            return username;
        }
    },

    Query: {
        allUsers: (parent, args, { models }) => models.User.findAll(),
        getUser: (parent, { username }, { models }) =>
            models.User.findOne({
                where: {
                    username
                }
            }),
        userBoards: (parent, { owner }, { models }) =>
            models.Board.findAll({
                where: {
                    owner
                }
            }),

        userSuggestions: (parent, { creatorId, boardId }, { models }) =>
            models.Suggestion.findAll({
                where: {
                    creatorId,
                    boardId
                }
            })
    },

    Mutation: {
        createUser: (parent, args, { models }) => models.User.create(args),
        updateUser: (parent, { id, newUsername }, { models }) =>
            models.User.update({ username: newUsername }, { where: { id } }),
        deleteUser: (parent, args, { models }) =>
            models.User.destroy({
                where: args
            }),

        createBoard: (parent, args, { models }) => models.Board.create(args),
        createSuggestion: (parent, args, { models }) =>
            models.Suggestion.create(args)
    }
};
