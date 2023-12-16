const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const File = sequelize.define('File', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    extension: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    uploadDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

module.exports = File;
