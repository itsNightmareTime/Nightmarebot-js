import { Sequelize, DataTypes } from 'sequelize';
import { database } from '../connection/connection';

export const User = database.define('users', {
	steamId: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
	userName: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});