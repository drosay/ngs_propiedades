import { User } from '../models/User';
import { authService } from '../services/authService';

export const context = async ({ req }: any) => {

    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
    
    if (!token) return { user: null };

    const payload = authService.verifyToken(token);
    
    if (!payload || !payload.userId) return { user: null };
    
    const user = await User.findByPk(payload.userId);
    
    return { user };
};