import { Sequelize, Dialect } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const {
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_DIALECT,
    DB_HOST,
    DB_PORT,
    DB_POOL_MAX,
    DB_POOL_MIN,
    DB_POOL_IDLE,
    DB_POOL_ACQUIRE,
    DB_TIMEZONE,
} = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_DIALECT || !DB_HOST || 
    !DB_PORT || !DB_POOL_MAX || !DB_POOL_MIN || 
    !DB_POOL_IDLE || !DB_POOL_ACQUIRE || !DB_TIMEZONE) {
    throw new Error("Missing required environment variables");
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    dialect: DB_DIALECT as Dialect,
    host: DB_HOST,
    port: DB_PORT ? parseInt(DB_PORT) : undefined,
    logging: console.log,
    pool: {
        max: DB_POOL_MAX ? parseInt(DB_POOL_MAX) : 5,
        min: DB_POOL_MIN ? parseInt(DB_POOL_MIN) : 0,
        acquire: DB_POOL_ACQUIRE ? parseInt(DB_POOL_ACQUIRE) : 30000,
        idle: DB_POOL_IDLE ? parseInt(DB_POOL_IDLE) : 10000,
    },
    timezone: DB_TIMEZONE || "+00:00",
});

export default sequelize;
