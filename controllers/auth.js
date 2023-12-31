const authService = require('../services/auth');
const sendResponse = require('../utils/sendResponse');
const { HTTP_STATUS_CODES } = require('../constants/httpStatusCodes');

class AuthController {
    async signIn(req, res) {
        const { id, password } = req.body;
        const { accessToken, refreshToken } = await authService.signIn(id, password);

        sendResponse(res, HTTP_STATUS_CODES.OK, { accessToken, refreshToken });
    };

    async generateTokensFromRefreshToken(req, res) {
        const accessToken = await authService.generateTokensFromRefreshToken(req.cookies.refreshToken);

        sendResponse(res, HTTP_STATUS_CODES.OK, accessToken);
    };

    async signUp(req, res) {
        const { id, password } = req.body;
        const { accessToken, refreshToken } = authService.signUp(id, password);

        sendResponse(res, HTTP_STATUS_CODES.CREATED, { accessToken, refreshToken });
    };

    info(req, res) {
        sendResponse(res, HTTP_STATUS_CODES.OK, req.user.id);
    }

    async logout(req, res) {
        const { accessToken: oldAccessToken, refreshToken: oldRefreshToken } = req.cookies;
        const { accessToken, refreshToken } = await authService.logout(req.user.id, oldAccessToken, oldRefreshToken, res);

        sendResponse(res, HTTP_STATUS_CODES.OK, { accessToken, refreshToken });
    }
}

module.exports = new AuthController;
