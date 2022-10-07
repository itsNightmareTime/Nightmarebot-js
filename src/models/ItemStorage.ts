import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { database } from "../connection/connection";

interface ItemStorageModel extends Model<InferAttributes<ItemStorageModel>, InferCreationAttributes<ItemStorageModel>> {
	id: string
	characterId: string;
	maxSize: number;
}

export const ItemStorage = database.define<ItemStorageModel>("itemstorage",
  {
    id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
	    primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    characterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'character',
        key: 'id',
      },
    },
    maxSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    modelName: 'itemstorage'
  }
);
