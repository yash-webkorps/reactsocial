import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const {
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_DIALECT,
    DB_HOST,
} = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_DIALECT || !DB_HOST) {
    throw new Error("Missing required environment variables")
}
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    dialect: DB_DIALECT as 'mysql',
    host: DB_HOST
})

export default sequelize;

