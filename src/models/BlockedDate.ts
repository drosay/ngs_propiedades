import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

// Tipo opcional para algunos datos debido a que en sequelize 45 no está disponible 
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface BlockedDateAttributes {
    id: number;
    startDate: string;
    endDate: string;
    propertyId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

type BlockedDateCreationAttributes = Optional<BlockedDateAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class BlockedDate extends Model<BlockedDateAttributes, BlockedDateCreationAttributes> implements BlockedDateAttributes {
    public id!: number;
    public startDate!: string;
    public endDate!: string;
    public propertyId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        BlockedDate.belongsTo(models.Property, { foreignKey: 'propertyId', as: 'property' });
    }
}

BlockedDate.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        startDate: { type: DataTypes.DATEONLY, allowNull: false },
        endDate: { type: DataTypes.DATEONLY, allowNull: false },
        propertyId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        sequelize,
        tableName: 'blockedDates',
        timestamps: true,
    }
);