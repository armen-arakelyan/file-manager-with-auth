const controllerWrapper = (controllerFn) => async (req, res, next) => {
    try {
        await controllerFn(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = controllerWrapper;
