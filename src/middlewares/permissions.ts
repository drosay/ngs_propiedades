import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { UserRole } from '../models/User';

// type para resolver estándar
type ResolverFunc = (parent: any, args: any, context: any, info: any) => any;

// Middleware usuario autenticado
export const isAuthenticated = (next: ResolverFunc): ResolverFunc =>
    (parent, args, context, info) => {
        if (!context.user) {
            throw new AuthenticationError('Debes iniciar sesión para realizar esta acción');
        }
        return next(parent, args, context, info);
    };

// Middleware para rol de usuario
export const hasRole = (role: UserRole, next: ResolverFunc): ResolverFunc =>
    (parent, args, context, info) => {

        if (!context.user) {
            throw new AuthenticationError('Debe iniciar sesión');
        }

        // Verificación del rol
        if (context.user.role !== role) {
            throw new ForbiddenError(`No tienes permisos suficientes`);
        }

        return next(parent, args, context, info);
    };