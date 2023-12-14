// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });
//
// module.exports = db;

// database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, 'root', process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
