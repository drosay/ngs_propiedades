import { gql } from 'apollo-server-express';

export const propertyTypeDefs = gql`
    type Property { 
        id: ID! 
        title: String! 
        description: String 
        ownerId: Int! 
        maxGuests: Int! 
        basePricePerNight: Float! 
    }

    type BlockedDate { 
        id: ID! 
        propertyId: Int! 
        startDate: String! 
        endDate: String! 
        reason: String 
    }

    input PropertyInput { 
        title: String! 
        description: String 
        maxGuests: Int! 
        basePricePerNight: Float! 
    }

    extend type Query {
        myProperties: [Property!]
        property(id: ID!): Property
        searchAvailableProperties(start: String! end: String! guests: Int!): [Property!]
    }

    extend type Mutation {
        createProperty(input: PropertyInput!): Property!
        updateProperty(id: ID! input: PropertyInput!): Property!
        deleteProperty(id: ID!): Boolean!
        
        createBlockedDate(propertyId: ID! start: String! end: String! reason: String): BlockedDate!
    }
`;