import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { connectDB } from './db/index';
import { config } from './config';
import { schema } from './graphql/schema'; 
import { context } from './graphql/context';

const startServer = async () => {

    const app = express();

    await connectDB();

    const server = new ApolloServer({
        typeDefs: schema.typeDefs,
        resolvers: schema.resolvers,
        context: context, 
        playground: true,      
        introspection: true    
    });

    server.applyMiddleware({ app });

    app.listen(config.PORT, () => {
        console.log(`
        Servicio corriendo en: http://localhost:${config.PORT}${server.graphqlPath}
        `);
    });
};

startServer();