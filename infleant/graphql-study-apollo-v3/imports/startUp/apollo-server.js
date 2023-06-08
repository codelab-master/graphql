import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebApp } from 'meteor/webapp';

import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'

import depthLimit from 'graphql-depth-limit'

import typeDefs_board from '/imports/api/board/schemas';
import resolvers_board from '/imports/api/board/resolvers_origin';
// import resolvers_board from '/imports/api/board/resolvers_nova';

import typeDefs_human from '/imports/api/human/schemas';
import resolvers_human from '/imports/api/human/resolvers';

import typeDefs_comment from '/imports/api/comment/schemas';
// import resolvers_comment from '/imports/api/comment/resolvers_origin';
import resolvers_comment from '/imports/api/comment/resolvers_nova';


import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

(async function () {

  const typeDefs = [typeDefs_board, typeDefs_human, typeDefs_comment];
  const resolvers = [resolvers_board, resolvers_human, resolvers_comment];

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    onConect: async (connectionParams, websocket) => {
      console.log(`Subscription client connected using new SubscriptionServer.`)
    },
    onDisconnect: async (WebSocket, context) => {
      console.log(`Subscription client disconnected.`)
    },

  },
    {
      server: WebApp.httpServer,
      path: '/graphql'
    });

  const server = new ApolloServer({
    playground: true,
    schema,
    // validationRules: [ depthLimit(2)], 
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(), // 추가
      {
        async serverWillStart() { // 추가
          return {
            async drainServer() {
              subscriptionServer.close();
            }
          };
        }
      }
    ],
    context: '',
  });

  await server.start();

  server.applyMiddleware({
    app: WebApp.connectHandlers,
    cors: true,
    path: '/graphql',
  });

})();
