import { gql } from 'apollo-server-express';

export const baseTypeDefs = gql`
    # Tipos vacios para extender luego de booking, property y user
    type Query {
        _empty: String
    }

    type Mutation {
        _empty: String
    }
`;