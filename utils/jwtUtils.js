const jwt = require('jsonwebtoken');

const generateTokens = (id) => {
    const accessToken = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ id }, process.env.REFRESH_SECRET_KEY);
    return { accessToken, refreshToken };
};

const verifyToken = (token, callback) => {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, user);
        }
    });
};

module.exports = { generateTokens, verifyToken };
