import { Property } from '../models/Property';
import { Booking } from '../models/Booking';
import { BlockedDate } from '../models/BlockedDate';
import { Op } from 'sequelize';
import { UserInputError, ForbiddenError } from 'apollo-server-express';

export const propertyService = {
    
    async searchAvailableProperties(start: string, end: string, guests: number) {

        if (new Date(start) >= new Date(end)) {
            throw new UserInputError('La fecha de inicio debe ser anterior al finalización');
        }

        // TODO: Extraer para reutilizar
        const overlapWhere = {
            [Op.and]: [
                { startDate: { [Op.lt]: end } },
                { endDate: { [Op.gt]: start } }
            ]
        };

        // busqueda de ids de propiedades con reservas no canceladas
        const busyByBooking = await Booking.findAll({
            attributes: ['propertyId'],
            where: {
                status: { [Op.ne]: 'CANCELLED' },
                ...overlapWhere
            },
            raw: true
        });

        // Busqueda de ids de propiedades bloqueadas por el dueño
        const busyByBlock = await BlockedDate.findAll({
            attributes: ['propertyId'],
            where: overlapWhere,
            raw: true
        });

        // unir ids
        const busyIds = [
            ...busyByBooking.map((b: any) => b.propertyId),
            ...busyByBlock.map((b: any) => b.propertyId)
        ];

        // propiedades que no están en la lista de ocupadas
        return Property.findAll({
            where: {
                maxGuests: { [Op.gte]: guests }, // filtrar por capacidad
                id: { [Op.notIn]: busyIds }
            }
        });
    },

    async getMyProperties(userId: number) {
        return Property.findAll({ where: { ownerId: userId } });
    },

    async createProperty(data: any, userId: number) {
        return Property.create({ ...data, ownerId: userId });
    },

    async updateProperty(id: number, data: any, userId: number) {
        const prop = await Property.findByPk(id);
        if (!prop) throw new UserInputError('Propiedad no encontrada');
        if (prop.ownerId !== userId) throw new ForbiddenError('No eres el dueño de esta propiedad');
        
        return prop.update(data);
    },

    async deleteProperty(id: number, userId: number) {
        const prop = await Property.findByPk(id);
        if (!prop) throw new UserInputError('Propiedad no encontrada');
        if (prop.ownerId !== userId) throw new ForbiddenError('No eres el dueño de esta propiedad');
        
        await prop.destroy();
        return true;
    },

    async createBlockedDate(propertyId: number, start: string, end: string, reason: string, userId: number) {
        const prop = await Property.findByPk(propertyId);
        if (!prop) throw new UserInputError('Propiedad no encontrada');
        if (prop.ownerId !== userId) throw new ForbiddenError('No eres el dueño de esta propiedad');

        // Verificar si hay reservas CONFIRMADAS en esas fechas antes de bloquear
        const hasConflict = await Booking.count({
            where: {
                propertyId,
                status: 'CONFIRMED',
                [Op.and]: [
                    { startDate: { [Op.lt]: end } },
                    { endDate: { [Op.gt]: start } }
                ]
            }
        });

        if (hasConflict > 0) {
            throw new UserInputError('No se pueden bloquear fechas que ya han sido confirmadas');
        }

        return BlockedDate.create({ propertyId, startDate: start, endDate: end });
    }
};