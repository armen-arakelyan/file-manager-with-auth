class AppError extends Error {
    constructor(status, message) {
        super(message);

        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);

        this.status = status || 500;

        this.message = message;
    }
}

module.exports = AppError;
