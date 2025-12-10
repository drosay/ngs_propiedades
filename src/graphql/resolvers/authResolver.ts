import { authService } from '../../services/authService';
import { AuthenticationError, UserInputError } from 'apollo-server-express';

export default {
  Query: {
    account: (_: any, __: any, context: any) => {
      if (!context.user) return null;
      return context.user;
    },
  },

  Mutation: {
    register: async (_: any, args: any) => {

      try {
        const result = await authService.register(args);

        if (!result || !result.user) {
          throw new Error("Se de volvieron atos vacíos del register");
        }

        return result.user;

      } catch (error) {
        const errorMessage = (error as Error).message;
        throw new UserInputError(errorMessage);
      }
    },

    login: async (_: any, args: any) => {
      try {
        return await authService.login(args);
      } catch (error) {
        const errorMessage = (error as Error).message;
        throw new AuthenticationError(errorMessage);
      }
    },
  },
};