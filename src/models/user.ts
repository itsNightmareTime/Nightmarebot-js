import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { database } from "../connection/connection";

interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
	id: string
	steamId: string;
	userName: string;
}

export const User = database.define<UserModel>("users",
  {
    id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
	  primaryKey: true
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
  }
);
