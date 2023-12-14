const phoneUtil = require('libphonenumber-js');
const validator = require('validator');
const AppError = require('./AppError');
const { HTTP_STATUS_CODES } = require('../constants/httpStatusCodes');

const validatePhoneNumber = phoneNumber => {
    if (!phoneUtil.isValidNumber(phoneNumber)) {
        throw new AppError(HTTP_STATUS_CODES.BAD_REQUEST, 'Not valid number!')
    }
}

const validateEmail = email => {
    if (!validator.isEmail(email)) {
        throw new AppError(HTTP_STATUS_CODES.BAD_REQUEST, 'Not valid email!')
    }
}

const validateEmailOrPhoneNumber = (input) => {
    let emailValid = false;
    let phoneValid = false;

    try {
        validatePhoneNumber(input);
        phoneValid = true;
    } catch (error) {
        // Phone number validation failed
    }

    try {
        validateEmail(input);
        emailValid = true;
    } catch (error) {
        // Email validation failed
    }

    if (!emailValid && !phoneValid) {
        throw new AppError(HTTP_STATUS_CODES.BAD_REQUEST, 'Not a valid email or phone number!');
    }
};

const checkUsernameAndPassword = (username, password) => {
    if (!username || !password) {
        throw new AppError(HTTP_STATUS_CODES.BAD_REQUEST, 'Username and password is required!');
    }
}

module.exports = {
    validatePhoneNumber,
    validateEmail,
    validateEmailOrPhoneNumber,
    checkUsernameAndPassword
};
