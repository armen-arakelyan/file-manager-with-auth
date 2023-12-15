const { Op } = require('sequelize');
const TokenBlackList = require('../models/TokenBlackList');
const AppError = require('./AppError');
const { HTTP_STATUS_CODES } = require('../constants/httpStatusCodes');

const checkBlackList = async (accessToken, refreshToken) => {
    const tokenInBlacklist = await TokenBlackList.findOne({
        where: { token: { [Op.or]: [accessToken, refreshToken] } },
    });

    if (tokenInBlacklist) {
        throw new AppError(HTTP_STATUS_CODES.BAD_REQUEST, 'Your token in blacklist!')
    }
};

const addToBlackList = async (token, type) => TokenBlackList.create({
        token,
        type
    });

module.exports = {
    checkBlackList,
    addToBlackList
};
