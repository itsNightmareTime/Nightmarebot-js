import { Sequelize } from 'sequelize';

export const database = new Sequelize('botdb', 'Class', 'Class123!', {
	dialect: 'mysql',
	logging: true,
});
