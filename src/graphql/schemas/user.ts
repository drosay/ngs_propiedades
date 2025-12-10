import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
    enum UserRole { 
        OWNER 
        TRAVELER 
    }

    type User { 
        id: ID! 
        email: String! 
        role: UserRole! 
    }

    type AuthPayload { 
        token: String! 
        user: User! 
    }

    extend type Query {
        account: User
    }

    extend type Mutation {
        register(email: String! password: String! role: UserRole!): User! 
        login(email: String! password: String!): AuthPayload!
    }
`;