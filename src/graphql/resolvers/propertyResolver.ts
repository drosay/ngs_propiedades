import { propertyService } from '../../services/propertyService';
import { UserRole } from '../../models/User';
import { isAuthenticated, hasRole } from '../../middlewares/permissions';

export default {
    Query: {
        myProperties: isAuthenticated(async (_: any, __: any, context: any) => {
            return propertyService.getMyProperties(context.user.id);
        }),

        property: async (_: any, { id }: any) => {
            const { Property } = require('../../models/Property');
            return Property.findByPk(id);
        },

        searchAvailableProperties: async (_: any, { start, end, guests }: any) => {
            return propertyService.searchAvailableProperties(start, end, guests);
        },
    },

    Mutation: {

        createProperty: hasRole(UserRole.OWNER, async (_: any, { input }: any, context: any) => {
            return propertyService.createProperty(input, context.user.id);
        }),

        updateProperty: isAuthenticated(async (_: any, { id, input }: any, context: any) => {
            return propertyService.updateProperty(id, input, context.user.id);
        }),

        deleteProperty: isAuthenticated(async (_: any, { id }: any, context: any) => {
            return propertyService.deleteProperty(id, context.user.id);
        }),

        createBlockedDate: hasRole(UserRole.OWNER, async (_: any, { propertyId, start, end, reason }: any, context: any) => {
            return propertyService.createBlockedDate(propertyId, start, end, reason, context.user.id);
        }),
    },
};