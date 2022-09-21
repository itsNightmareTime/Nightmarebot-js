import { Sequelize, DataTypes } from 'sequelize';
import { database } from '../connection/connection';

export const User = database.define('users', {
	discordId: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false
	},
	steamId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	userName: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	{
		timestamps: false
	}
});