import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { database } from "../connection/connection";

interface BankModel extends Model<InferAttributes<BankModel>, InferCreationAttributes<BankModel>> {
	id: string
    characterId: string;
	balance: number;
}

export const Bank = database.define<BankModel>("bank",
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
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    modelName: 'bank'
  }
);
