import {
  DataTypes, Model,
} from 'sequelize';
import database from '../connection/connection';

type UserAttributes = {
  id: string;
  steamId: string;
  userName: string;
};

class UserModel extends Model<UserAttributes, UserAttributes> {
  declare id: string;

  declare steamId: string;

  declare userName: string;
}

const User = database.define<UserModel>(
  'users',
  {
    id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
    steamId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

export default User;
