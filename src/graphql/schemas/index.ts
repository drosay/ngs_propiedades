import { baseTypeDefs } from './base';
import { userTypeDefs } from './user';
import { propertyTypeDefs } from './property';
import { bookingTypeDefs } from './booking';

// Apollo hace el merge
export const typeDefs = [
    baseTypeDefs,
    userTypeDefs,
    propertyTypeDefs,
    bookingTypeDefs
];