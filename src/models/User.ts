import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';
import * as bcrypt from 'bcryptjs';

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export enum UserRole {
    OWNER = 'OWNER',
    TRAVELER = 'TRAVELER',
}

interface UserAttributes {
    id: number;
    email: string;
    password: string;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public password!: string;
    public role!: UserRole;
    
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

User.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        email: { type: DataTypes.STRING, allowNull: false, unique: true, },
        password: { type: DataTypes.STRING, allowNull: false, },
        role: { type: DataTypes.ENUM('OWNER', 'TRAVELER'), allowNull: false, },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
        hooks: {
            beforeCreate: async (user: User) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async (user: User) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        },
    }
);