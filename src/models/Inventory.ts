import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { database } from "../connection/connection";

interface InventoryModel extends Model<InferAttributes<InventoryModel>, InferCreationAttributes<InventoryModel>> {
	id: string
	characterId: string;
	maxSize: number;
}

export const Inventory = database.define<InventoryModel>("inventory",
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
    modelName: 'inventory'
  }
);
