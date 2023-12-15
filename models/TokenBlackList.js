const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const TokenBlackList = sequelize.define('TokenBlackList', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    type: {
        type: DataTypes.ENUM('refreshToken', 'accessToken'),
        allowNull: false,
    }
});

module.exports = TokenBlackList;
