import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pick from 'lodash/pick';

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
        me: (parent, args, { models, user }) => {
            if (user) {
                return models.User.findOne({
                    where: {
                        id: user.id
                    }
                });
            }
            return null;
        },

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
        updateUser: (parent, { id, newUsername }, { models }) =>
            models.User.update({ username: newUsername }, { where: { id } }),
        deleteUser: (parent, args, { models }) =>
            models.User.destroy({
                where: args
            }),

        createBoard: (parent, args, { models }) => models.Board.create(args),
        createSuggestion: (parent, args, { models }) =>
            models.Suggestion.create(args),
        register: async (parent, args, { models }) => {
            const user = args;
            // 12 is how many charaters salt should have
            user.password = await bcrypt.hash(user.password, 12);
            return models.User.create(user);
        },
        login: async (parent, { email, password }, { models, SECRET }) => {
            const user = await models.User.findOne({ where: { email } });
            if (!user) {
                throw new Error('No user with that email');
            }
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error('Incorect password');
            }
            // Token = '12313123sadadasdaas3141313asadsd'
            // verify - needs secret - use me for authentication
            // decode - no need for secret - use me on the client side
            const token = jwt.sign(
                {
                    user: pick(user, ['id', 'username'])
                },
                SECRET,
                {
                    expiresIn: '1y'
                }
            );

            return token;
        }
    }
};
