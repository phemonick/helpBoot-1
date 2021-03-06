import { Model, DataTypes, Op } from 'sequelize';
import sequelize from 'src/database/sequelize';
import hashPassword from 'src/utils/hashPassword';
import * as bcrypt from 'bcryptjs';

enum Status {
  VERIFIED = 'verified',
  UNVERIFIED = 'unverified',
}

export default class User extends Model {
  public id!: string;
  public firstname!: string | null;
  public lastname!: string | null;
  public email!: string;
  public password!: string;
  public status!: Status;
  public shortBio!: string;
  public locationCity!: string;
  public locationState!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static getByField: (field, value) => User;
  public static hasCorrectPassword: (password, user) => boolean;
}

User.init({
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shortBio: {
    type: DataTypes.STRING,
  },
  locationCity: {
    type: DataTypes.STRING,
  },
  locationState: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'users',
  sequelize,
  hooks: {
    beforeCreate(data) {
      data.password = hashPassword(data.password);
      data.status = Status.UNVERIFIED;
    },
  },
  scopes: {
    byField({ field, value }) {
      return {
        where: {
          [field]: {
            [Op.eq]: value,
          },
        },
      };
    },
  },
});

User.getByField = (field, value) => User.scope({ method: ['byField', { field, value }] }).findOne();

User.hasCorrectPassword = (password, user) => {
  return bcrypt.compareSync(password, user.password);
};