import { Booking } from '../models/Booking';
import { Property } from '../models/Property';
import { BlockedDate } from '../models/BlockedDate';
import { Op } from 'sequelize';
import moment from 'moment';
import { UserInputError } from 'apollo-server-express';

export const bookingService = {
    
    async checkOverlap(propertyId: number, start: string, end: string): Promise<boolean> {
        // Solapamiento (Fecha Inicio < Fecha Existente Fin) AND (Fecha Fin > Fecha Existente Inicio)
        const overlapWhere = {
            propertyId,
            [Op.and]: [
                { startDate: { [Op.lt]: end } }, // Empieza antes de que termine el rango de fecha
                { endDate: { [Op.gt]: start } }  // Termina despues de que empiece el rango de fechas
            ]
        };

        // Verificar con reservas que sean diferentes de canceladas
        const conflictingBooking = await Booking.count({
            where: {
                ...overlapWhere,
                status: { [Op.ne]: 'CANCELLED' }
            }
        });

        if (conflictingBooking > 0) return true;

        // Verificar fechas que estén bloqueadas
        const conflictingBlock = await BlockedDate.count({
            where: overlapWhere
        });

        return conflictingBlock > 0;
    },

    async createBooking(data: any, userId: number) {
        const { propertyId, start, end, guests } = data;

        const mStart = moment(start);
        const mEnd = moment(end);
        
        if (!mStart.isValid() || !mEnd.isValid()) throw new UserInputError('Fechas invalidas');
        if (mEnd.isSameOrBefore(mStart)) throw new UserInputError('La fecha fin debe ser posterior a la de inicio');

        // validad propiedad y capacidad de propiedad
        const property = await Property.findByPk(propertyId);
        if (!property) throw new UserInputError('Propiedad no encontrada');
        
        if (guests > property.maxGuests) {
            throw new UserInputError(`El límite de huéspedes es de ${property.maxGuests}.`);
        }

        // verificar disponibilifad
        const isOverlapped = await this.checkOverlap(propertyId, start, end);
        if (isOverlapped) {
            throw new UserInputError('Las fechas seleccionadas no estan disponibles');
        }

        // Precio total
        const nights = mEnd.diff(mStart, 'days');
        const totalPrice = Number(property.basePricePerNight) * nights;

        return Booking.create({
            propertyId,
            userId,
            startDate: start,
            endDate: end,
            status: 'PENDING',
            totalPrice
        });
    }
};