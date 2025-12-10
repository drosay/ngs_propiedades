import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
}

interface BookingAttributes {
    id: number;
    startDate: string;
    endDate: string;
    status: BookingStatus;
    totalPrice: number;
    userId: number;
    propertyId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

type BookingCreationAttributes = Optional<BookingAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status'>;

export class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
    public id!: number;
    public startDate!: string;
    public endDate!: string;
    public status!: BookingStatus;
    public totalPrice!: number;
    public userId!: number;
    public propertyId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        // Una reserva pertenece a un viajero
        Booking.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

        // Una reserva pertenece a una Propiedad
        Booking.belongsTo(models.Property, { foreignKey: 'propertyId', as: 'property' });
    }
}

Booking.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        startDate: { type: DataTypes.DATEONLY, allowNull: false },
        endDate: { type: DataTypes.DATEONLY, allowNull: false },
        status: {
            type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'PENDING',
        },
        totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        propertyId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        sequelize,
        tableName: 'bookings',
        timestamps: true,
    }
);