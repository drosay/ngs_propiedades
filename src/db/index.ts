import { Sequelize } from 'sequelize';
import { config } from '../config';

// Se importan los modelos después de instanciar sequelize para evitar que sea undefined en su inicialización
export const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    dialect: 'mysql',
    // Cambiar, solo puesto para probar que funciona
    logging: console.log,
  }
);


import { User } from '../models/User'; 
import { Property } from '../models/Property'; 
import { Booking } from '../models/Booking'; 
import { BlockedDate } from '../models/BlockedDate'; 

const models = {
  User,
  Property,
  Booking,
  BlockedDate,
};

// Asociamos modelos
Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexion establecida con base de datos');

    // Sincronizamos tablas, alter true para pruebas
    await sequelize.sync({ alter: true }); 
    console.log('Tablas sincronizadas en base de datos');

    const [results] = await sequelize.query('SHOW TABLES;');
    console.log('Tablas creadas en base de datos:', results);
    
  } catch (error) {
    console.error('Error con la base de datos: ', error);
    process.exit(1);
  }
};