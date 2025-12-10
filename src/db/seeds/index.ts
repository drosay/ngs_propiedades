import { sequelize } from '..';
import { User, UserRole } from '../../models/User';
import { Property } from '../../models/Property';
import { Booking, BookingStatus } from '../../models/Booking';
import { BlockedDate } from '../../models/BlockedDate';

// const loadAssociations = () => {
//     const models = { User, Property, Booking, BlockedDate };
//     Object.values(models).forEach((model: any) => {
//         if (model.associate) model.associate(models);
//     });
// };

const runSeed = async () => {
    try {

        await sequelize.authenticate();
        // loadAssociations();
        await sequelize.sync({ force: true }); 
        
        console.log('Base de datos limpiada');

        // 2. CREAR USUARIOS
        // Owners
        const dilan = await User.create({
            email: 'dilan@gmail.com',
            password: '123',
            role: UserRole.OWNER
        });

        const sandra = await User.create({
            email: 'sandra@gmail.com',
            password: '123',
            role: UserRole.OWNER
        });

        // Travelers
        const gybram = await User.create({
            email: 'gybram@traveler.com',
            password: '123',
            role: UserRole.TRAVELER
        });

        const elkin = await User.create({
            email: 'elkin@traveler.com',
            password: '123',
            role: UserRole.TRAVELER
        });

        console.log('Uuarios creados');

        // 3. CREAR PROPIEDADES
        // propiedades dilan
        const beach = await Property.create({
            title: "Casota de lujo en la playa",
            description: "Vista al mar, jacuzzi y piscina extra grande",
            ownerId: dilan.id,
            maxGuests: 10,
            basePricePerNight: 600.00
        });

        const cabin = await Property.create({
            title: "Cabaña a las afueras",
            description: "Ideal para desconectar",
            ownerId: dilan.id,
            maxGuests: 3,
            basePricePerNight: 180.00
        });

        // propiedades sandra
        const city = await Property.create({
            title: "Casa moderna en bocagrande",
            description: "Para vacaciones",
            ownerId: sandra.id,
            maxGuests: 4,
            basePricePerNight: 200.00
        });

        console.log('Propiedades creadas');

        // Gybram tiene una reserva CONFIRMADA en la casota
        // Del 20 al 25 de ene 2026
        await Booking.create({
            propertyId: beach.id,
            userId: gybram.id,
            startDate: '2026-01-20',
            endDate: '2026-01-25',
            status: BookingStatus.CONFIRMED,
            totalPrice: 3000.00,
            guests: 5
        });

        // Dilan bloqueó la cabaña por mantenimiento
        // Del 10 al 14 de feb 2026
        await BlockedDate.create({
            propertyId: cabin.id,
            startDate: '2026-02-10',
            endDate: '2026-02-14',
            reason: "Mantenimiento"
        });

        // Elkin se quedó en la casa de sandra
        // Del 1 al 5 de dic 2025
        await Booking.create({
            propertyId: city.id,
            userId: elkin.id,
            startDate: '2023-12-01',
            endDate: '2023-12-05',
            status: BookingStatus.CONFIRMED,
            totalPrice: 800.00,
            guests: 2
        });

        console.log('Datos de prueba de reservas y bloqueos generados');
        console.log('SEEDING COMPLETADO');
        process.exit(0);

    } catch (error) {
        console.error('Error en el seeding:', error);
        process.exit(1);
    }
};

runSeed();