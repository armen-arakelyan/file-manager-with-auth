const jwt = require('jsonwebtoken');

const createAccessAndRefreshToken = id => {
    const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET);

    return { accessToken, refreshToken };
};

module.exports = {
    createAccessAndRefreshToken
};
