const sendResponse = require('./sendResponse');
const AppError = require('./AppError');
const { HTTP_STATUS_CODES } = require('../constants/httpStatusCodes');

const beautifyValidationErrors = (error) => {
    if (error.name === 'ValidationError') {
        const formattedErrorMessage = Object.keys(error.errors)
            .map((errorKey) => error.errors[errorKey].message)
            .join('; ');
        return new AppError(HTTP_STATUS_CODES.BAD_REQUEST, formattedErrorMessage, error);
    }

    return error;
};

const toJsonErrors = (rawError, req, res, next) => {
    try {
        if (typeof rawError !== 'object') rawError = {};

        const err = beautifyValidationErrors(rawError);

        const status = err.status || 500;
        let message = err.message || 'An unknown error has occured.';

        // Only show full error in DEV mode
        const error = { status, message, data: err.data };
        if (process.env.NODE_ENV === 'development') error.stack = err.stack;

        if (err.status >= HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
            console.error('AppError', {
                ...error,
                originalUrl: req.originalUrl,
                method: req.method
            });
        }

        sendResponse(res, status, { error });

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = toJsonErrors;
