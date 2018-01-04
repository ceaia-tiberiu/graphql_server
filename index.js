import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';

// Put together a schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});
const SECRET = '1qsaonj1g9asodsahJNBKEWJB{Aasdsa';

const app = express();
const addUser = async (req, resp) => {
    const token = req.headers.authorization;
    try {
        const { user } = await jwt.verify(token, SECRET);
        req.user = user;
    } catch (err) {
        console.log(err);
    }
    req.next();
};
app.use(
    '/graphiql',
    graphiqlExpress({
        endpointURL: '/graphql'
    })
);

app.use(cors('*'));
app.use(addUser);
// bodyParser is needed just for POST.
app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress(req => ({
        schema,
        context: {
            models,
            SECRET,
            user: req.user
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
