const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { HTTP_STATUS_CODES } = require('../constants/httpStatusCodes');
const { checkBlackList } = require('../utils/blackList');

const assertAuth = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;

        await checkBlackList(accessToken, req.cookies.refreshToken);

        if (!accessToken && !req.cookies.refreshToken) {
            throw new AppError(HTTP_STATUS_CODES.UNAUTHORIZED, 'Unauthorized');
        }

        const { id } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findByPk(id);

        if (!user) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, 'User not found!');
        }

        req.user = user;

        next();
    } catch (err) {
        if (!req.cookies.accessToken) {
            return handleTokenExpiredError(req, res, next);
        }
        switch (err.name) {
            case 'TokenExpiredError':
                return handleTokenExpiredError(req, res, next);
            case 'JsonWebTokenError':
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');
                next(new AppError(HTTP_STATUS_CODES.UNAUTHORIZED, 'Invalid access token'));
                break;
            default:
                next(err);
                break;
        }
    }
};

const handleTokenExpiredError = async (req, res, next) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        next(new AppError(HTTP_STATUS_CODES.UNAUTHORIZED, 'Unauthorized'));
    }

    try {
        const { id: decodedRefreshToken } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findByPk(decodedRefreshToken);

        if (!user) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, 'User not found!');
        }

        const newAccessToken = jwt.sign({ id: decodedRefreshToken }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });

        res.cookie('accessToken', newAccessToken, { httpOnly: true });

        req.user = user;

        next();
    } catch (refreshErr) {
        next(refreshErr);
    }
};

module.exports = {
    assertAuth
};
