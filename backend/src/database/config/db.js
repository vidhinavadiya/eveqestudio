const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize (
    process.env.DB_NAME_DEVELOPMENT,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: 3306,
        logging: false
    }
);

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('database connected succesfully...!');
    } catch (error) {
        console.error('unable to connect to the database..!', error);
    }
}

connectDB()

module.exports = sequelize;