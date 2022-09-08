const { Sequelize, DataTypes } = require('sequelize');
const database = require('../connection/connection');

const User = database.define('users', {
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

module.exports = User;