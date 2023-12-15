const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { HTTP_STATUS_CODES } = require('../constants/httpStatusCodes');
const { validateEmailOrPhoneNumber, checkUsernameAndPassword } = require('../utils/validations');
const { createAccessAndRefreshToken } = require('../utils/tokens');
const { addToBlackList } = require('../utils/blackList');

class AuthService {
    async signIn(username, password) {
        checkUsernameAndPassword(username, password);

        validateEmailOrPhoneNumber(username);

        const user = await User.findOne({ where: { username } });

        if (!user) {
            throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, 'User not found');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new AppError(HTTP_STATUS_CODES.BAD_REQUEST, 'Incorrect password');
        }

        return createAccessAndRefreshToken(user.id);
    }

    async signUp(username, password) {
        checkUsernameAndPassword(username, password);

        validateEmailOrPhoneNumber(username);

        const userIsExists = await User.findOne({ where: { username } });

        if (userIsExists) {
            throw new AppError(HTTP_STATUS_CODES.BAD_REQUEST, 'User already exists!');
        }

        const user = await User.create({ username, password });

        return createAccessAndRefreshToken(user.id);
    }

    async generateTokensFromRefreshToken(refreshToken) {
        if (!refreshToken) {
            throw new AppError(HTTP_STATUS_CODES.BAD_REQUEST, 'Refresh token is required!');
        }
        const { id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findByPk(id);

        if (!user) {
            throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, 'User not found');
        }

        return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
    }

    async logout(userId, oldAccessToken, oldRefreshToken, res) {
        const { accessToken, refreshToken } = createAccessAndRefreshToken(userId);
        await Promise.all([
            addToBlackList(oldAccessToken, 'accessToken'),
            addToBlackList(oldRefreshToken, 'refreshToken')
        ]);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return { accessToken, refreshToken };
    }
}

module.exports = new AuthService;
