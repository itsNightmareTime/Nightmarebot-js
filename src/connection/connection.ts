import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const database = new Sequelize(
	process.env.DB_NAME ? process.env.DB_NAME : '',
	process.env.DB_USER_NAME ? process.env.DB_USER_NAME : '',
	process.env.DB_USER_PASSWORD ? process.env.DB_USER_PASSWORD : '', 
	{
		dialect: 'mysql',
	}
);
