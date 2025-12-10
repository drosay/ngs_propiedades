import jwt from 'jsonwebtoken';
import { config } from './index';

export const signToken = (payload: object) => {
	return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRATION });
};

export const verifyToken = (token: string) => {
	try {
		return jwt.verify(token, config.JWT_SECRET);
	} catch (err) {
		return null;
	}
};

