const { Sequelize } = require('sequelize');

const database = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

module.exports = database;