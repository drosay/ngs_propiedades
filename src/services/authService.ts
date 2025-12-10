import { User, UserRole } from '../models/User';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthenticationError, UserInputError } from 'apollo-server-express';

interface TokenPayload {
    userId: number;
    role: UserRole;
    email: string;
}

export const authService = {
    
    async register(data: any) {
        const { email, password, role } = data;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new UserInputError('El email ya se registró anteriormente');
        }

        // El modelo user hace el hash por si mismo
        const newUser = await User.create({
            email,
            password,
            role
        });

        const token = this.generateToken(newUser);

        return {
            token,
            user: newUser
        };
    },

    async login(data: any) {
        const { email, password } = data;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new AuthenticationError('Credenciales inválidas.');
        }

        const isValid = await user.comparePassword(password);
        if (!isValid) {
            throw new AuthenticationError('Credenciales inválidas');
        }

        const token = this.generateToken(user);

        return {
            token,
            user
        };
    },

    generateToken(user: User): string {
        const payload: TokenPayload = {
            userId: user.id,
            role: user.role,
            email: user.email
        };

        return jwt.sign(payload, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRATION
        });
    },

    verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
        } catch (error) {
            throw new AuthenticationError('Token inválido o expirado');
        }
    }
};