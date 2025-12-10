import { typeDefs } from './schemas/index'; 
import authResolver from './resolvers/authResolver';
import propertyResolver from './resolvers/propertyResolver';
import bookingResolver from './resolvers/bookingResolver';

const resolvers = {
    Query: {
        ...authResolver.Query,
        ...propertyResolver.Query,
    },
    Mutation: {
        ...authResolver.Mutation,
        ...propertyResolver.Mutation,
        ...bookingResolver.Mutation
    }
};

export const schema = {
    typeDefs,
    resolvers
};