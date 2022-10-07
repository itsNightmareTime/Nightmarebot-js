import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { database } from "../connection/connection";

type StatsModifier = {
    [key: string]: number;
}

interface Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
	id: string
	inventoryId: string;
    storageId: string;
    value: number;
    name: string;
    stats: StatsModifier;
}

export const Item = database.define<Item>("item",
  {
    id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
	  primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    inventoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'inventory',
            key: 'id'
        }
    },
    storageId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'itemstorage',
            key: 'id'
        }
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stats: {
        type: DataTypes.JSON,
        allowNull: true,
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    modelName: 'item'
  }
);
