import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'ngs',

    PORT: process.env.PORT ? parseInt(process.env.PORT) : 4000,
    
    JWT_SECRET: process.env.JWT_SECRET || 'configura-tu-propia-secret-key',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1d',
};

if (!config.JWT_SECRET || config.JWT_SECRET === 'configura-tu-propia-secret-key') {
    console.error("JWT_SECRET no configurado o es el valor por defecto.");
    process.exit(1);
}