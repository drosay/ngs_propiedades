import { gql } from 'apollo-server-express';

export const bookingTypeDefs = gql`

    enum BookingStatus {
        PENDING
        CONFIRMED
        CANCELLED
    }

    type Booking { 
        id: ID! 
        propertyId: Int! 
        userId: Int! 
        startDate: String! 
        endDate: String! 
        guests: Int! 
        totalPrice: Float! 
        status: String! 
    }

    extend type Mutation {
        createBooking(propertyId: ID! start: String! end: String! guests: Int!): Booking!
    }
`;