import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import DataLoader from 'dataloader';
import groupBy from 'lodash/groupBy';

import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';
import { refreshTokens } from './auth';

// Put together a schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});
const SECRET = '1qsaonj1g9asodsahJNBKEWJB{Aasdsa';

const app = express();
const addUser = async (req, res, next) => {
    const token = req.headers['x-token'];
    if (token) {
        try {
            const { user } = jwt.verify(token, SECRET);
            req.user = user;
        } catch (err) {
            const refreshToken = req.headers['x-refresh-token'];
            const newTokens = await refreshTokens(
                token,
                refreshToken,
                models,
                SECRET
            );
            if (newTokens.token && newTokens.refreshToken) {
                res.set(
                    'Access-Control-Expose-Headers',
                    'x-token, x-refresh-token'
                );
                res.set('x-token', newTokens.token);
                res.set('x-refresh-token', newTokens.refreshToken);
            }
            req.user = newTokens.user;
        }
    }
    next();
};
app.use(
    '/graphiql',
    graphiqlExpress({
        endpointURL: '/graphql'
    })
);

app.use(cors('*'));
app.use(addUser);

const batchSuggestions = async (keys, { Suggestion }) => {
    // keys = [1, 2, 3 ..., 13]
    const suggestions = await Suggestion.findAll({
        raw: true,
        where: {
            boardId: {
                $in: keys
            }
        }
    });
    // suggestion = [{text:'hi', boardId: 1}, {text: 'bye', boardId: 2}, {text: 'bye2'. boardId: 2}]
    const gs = groupBy(suggestions, 'boardId');
    // gs = {1: [{text:'hi', boardId: 1}], 2: [{text: 'bye', boardId: 2}, {text: 'bye2'. boardId: 2}]}
    return keys.map(k => gs[k] || []);
};

app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress(req => ({
        schema,
        context: {
            models,
            SECRET,
            user: req.user,
            suggestionLoader: new DataLoader(keys =>
                batchSuggestions(keys, models)
            )
        }
    }))
);

const server = createServer(app);
models.sequilize.sync().then(() =>
    server.listen(1500, () => {
        new SubscriptionServer(
            {
                execute,
                subscribe,
                schema
            },
            {
                server,
                path: '/subscriptions'
            }
        );
    })
);
