import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { database } from "../connection/connection";

interface CharacterModel extends Model<InferAttributes<CharacterModel>, InferCreationAttributes<CharacterModel>> {
	id: string;
    userId: string;
    name: string;
    class: string;
    level: number;
    health: number;
    maxHealth: number;
    strength: number;
    magic: number;
    skill: number;
    speed: number;
    luck: number;
    defense: number;
    resistance: number;
    gold: number;
}

export const Character = database.define<CharacterModel>("character",
  {
    id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
	  primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    class: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    health: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    maxHealth: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    strength: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    magic: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    skill: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    speed: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    luck: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    defense: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    resistance: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gold: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    modelName: 'character'
  }
);