const fileService = require('../services/file');
const sendResponse = require('../utils/sendResponse');
const { HTTP_STATUS_CODES } = require('../constants/httpStatusCodes');

class FileController {
    async upload(req, res) {
        const { originalname, mimetype, buffer } = req.file;
        const file = await fileService.upload(originalname, mimetype, buffer);

        sendResponse(res, HTTP_STATUS_CODES.CREATED, file);
    };

    async list(req, res) {
        const { list_size, page } = req.query;
        const list = await fileService.list(+list_size || 10, +page || 1);
        sendResponse(res, HTTP_STATUS_CODES.OK, list);
    }

    async getFile(req, res) {
        const file = await fileService.getFile(req.params.id);

        sendResponse(res, HTTP_STATUS_CODES.OK, file);
    }

    async deleteFile(req, res) {
        await fileService.deleteFile(req.params.id);

        sendResponse(res, HTTP_STATUS_CODES.NO_CONTENT);
    }

    async downloadFile(req, res) {
        await fileService.downloadFile(req, res)
    }

    async updateFile(req, res) {
        const { originalname, mimetype, buffer } = req.file;
        await fileService.updateFile(req.params.id, originalname, mimetype, buffer);

        sendResponse(res, HTTP_STATUS_CODES.NO_CONTENT);
    }
}

module.exports = new FileController;
