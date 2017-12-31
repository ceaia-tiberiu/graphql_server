import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './schema';
import resolvers from './resolvers';
// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const app = express();

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  })
);
// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

app.listen(1500);
