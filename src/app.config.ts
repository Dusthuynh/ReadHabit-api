require('dotenv');

export const appConfig = {
	name: process.env.APP_NAME,
	version: process.env.APP_VERSION,
	jwtExpiresIn: '7d',
	jwtSecret: process.env.JWT_SECRET,
	jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
	jwtRefreshExp: '7d',
	fileHost: process.env.FILE_HOST,
	fileRoot: process.env.FILE_ROOT,
	env: process.env.NODE_ENV,
	database_config: {
		host: process.env.POSTGRES_HOST,
		port: process.env.POSTGRES_PORT,
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		db: process.env.POSTGRES_DB,
	},
	postgresConfig: {
		host: process.env.POSTGRES_HOST,
		port: process.env.POSTGRES_PORT as unknown as number,
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		synchronize: true,
	},
	redis: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT as unknown as number,
	},
};
