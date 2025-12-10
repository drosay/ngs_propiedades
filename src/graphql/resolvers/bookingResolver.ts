import { bookingService } from '../../services/bookingService';
import { UserRole } from '../../models/User';
import { UserInputError } from 'apollo-server-express';
import { hasRole } from '../../middlewares/permissions';

export default {
    Mutation: {
        createBooking: hasRole(UserRole.TRAVELER, async (_: any, args: any, context: any) => {
            try {
                return await bookingService.createBooking(args, context.user.id);
            } catch (error) {
                const message = (error as Error).message;
                throw new UserInputError(message); 
            }
        })
    }
};