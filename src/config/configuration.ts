import { registerAs } from '@nestjs/config';
import { sqlConfig } from './sql.config';

export const databaseConfing = registerAs('database', () => ({
	sql: {
		...sqlConfig(),
	},
}))