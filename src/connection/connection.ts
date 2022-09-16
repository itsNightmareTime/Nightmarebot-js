import { Sequelize } from 'sequelize';

export const database = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
