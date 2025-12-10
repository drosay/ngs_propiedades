import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db'; 

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;


interface PropertyAttributes {
    id: number;
    title: string;
    description?: string;
    ownerId: number;
    maxGuests: number;
    basePricePerNight: number;
    createdAt?: Date;
    updatedAt?: Date;
}

type PropertyCreationAttributes = Optional<PropertyAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Property extends Model<PropertyAttributes, PropertyCreationAttributes> implements PropertyAttributes {
    public id!: number;
    public title!: string;
    public description?: string;
    public ownerId!: number;
    public maxGuests!: number;
    public basePricePerNight!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        // una propiedad pertenece a un owner
        Property.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner', onDelete: 'CASCADE'
        });
        // una propiedad tiene muchas reservas
        Property.hasMany(models.Booking, { foreignKey: 'propertyId', as: 'bookings' });
        // una propiedad tiene muchos Bloqueos
        Property.hasMany(models.BlockedDate, { foreignKey: 'propertyId', as: 'blockedDates' });
    }
}

Property.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        ownerId: { type: DataTypes.INTEGER, allowNull: false },
        maxGuests: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        basePricePerNight: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
    },
    {
        sequelize,
        tableName: 'properties',
        timestamps: true,
    }
);