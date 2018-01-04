import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pick from 'lodash/pick';
import { PubSub } from 'graphql-subscriptions';
import { requiresAuth, requiresAdmin } from './permission';
import { refreshTokens, tryLogin } from './auth';

export const pubsub = new PubSub();

const USER_REGISTERD = 'USER_REGISTRED';

export default {
    Subscription: {
        userRegistred: {
            subscribe: () => pubsub.asyncIterator(USER_REGISTERD)
        }
    },

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
        createBoard: requiresAdmin.createResolver((parent, args, { models }) =>
            models.Board.create(args)
        ),
        createSuggestion: (parent, args, { models }) =>
            models.Suggestion.create(args),
        register: async (parent, args, { models }) => {
            const user = args;
            // 12 is how many charaters salt should have
            user.password = await bcrypt.hash(user.password, 12);
            const userRegistred = await models.User.create(user);
            pubsub.publish(USER_REGISTERD, {
                userRegistred
            });
            return userRegistred;
        },
        login: async (parent, { email, password }, { models, SECRET }) =>
            tryLogin(email, password, models, SECRET),
        refreshTokens: (parent, { token, refreshToken }, { models, SECRET }) =>
            refreshTokens(token, refreshToken, models, SECRET)
    }
};
