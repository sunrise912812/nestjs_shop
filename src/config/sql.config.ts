import { registerAs } from '@nestjs/config';
import { Dialect } from 'sequelize';

export const sqlConfig = registerAs('database', () => ({
	dialect: <Dialect>process.env.SQL_DIALECT || 'mysql',
	logging: process.env.SQL_LOGGING === 'true' ? true : false,
	host: process.env.DATABASE_HOST,
	port: +process.env.DATABASE_PORT, //+ для того чтобы строку прировнять к числу
	username: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	autoLoadingEntities: true,
	synchronize: true,
}));
