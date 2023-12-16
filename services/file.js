const fs = require('fs');
const path = require('path');
const File = require('../models/File');
const AppError = require('../utils/AppError');
const { createFolderIfNotExists } = require('../utils/file');
const { HTTP_STATUS_CODES } = require('../constants/httpStatusCodes');

const UPLOAD_DIR = 'files';

class FileService {
    async upload(originalname, mimetype, buffer) {
        const extension = originalname.split('.').pop();

        const savedFile = await File.create({
            name: originalname,
            extension,
            mimeType: mimetype,
            size: buffer.length,
            uploadDate: new Date(),
        });

        createFolderIfNotExists(UPLOAD_DIR);

        const filePath = path.join(UPLOAD_DIR, `${savedFile.id}.${extension}`);

        fs.writeFileSync(filePath, buffer);

        return savedFile;
    }

    async list(list_size, page) {
        const offset = (page - 1) * list_size;
        return File.findAll({
            limit: list_size,
            offset,
            order: [['uploadDate', 'DESC']],
        });
    }

    async getFile(id) {
        const file = await File.findByPk(id);

        if (!file) {
            throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, 'File with provided id not found!')
        }

        return file;
    }

    async deleteFile(id) {
        const file = await File.findByPk(id);

        if (!file) {
            throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, 'File with provided id not found!');
        }

        const filePath = path.join(UPLOAD_DIR, `${file.id.toString()}.${file.extension}`);

        fs.unlinkSync(filePath);

        return File.destroy({
            where: {
                id: file.id,
            },
        });
    }

    async downloadFile(req, res) {
        const file = await File.findByPk(req.params.id);

        if (!file) {
            throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, 'File with provided id not found!');
        }

        const filePath = path.join(UPLOAD_DIR, `${file.id.toString()}.${file.extension}`);

        try {
            fs.accessSync(filePath, fs.constants.R_OK);
        } catch (err) {
            throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, 'File not found on the server');
        }

        res.setHeader('Content-Type', file.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    }

    async updateFile(id, originalname, mimetype, buffer) {
        const extension = originalname.split('.').pop();

        const file = await File.findByPk(id);

        if (!file) {
            throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, 'File with provided id not found!');
        }

        createFolderIfNotExists(UPLOAD_DIR);

        const oldFilePath = path.join(UPLOAD_DIR, `${file.id}.${extension}`);

        fs.unlinkSync(oldFilePath);

        const fileData = {
            name: originalname,
            extension,
            mimeType: mimetype,
            size: buffer.length,
            uploadDate: new Date(),
        };

        const filePath = path.join(UPLOAD_DIR, `${file.id}.${fileData.extension}`);

        fs.writeFileSync(filePath, buffer);

        await File.update(
            fileData,
            { where: { id: +id } }
        )
    }
}

module.exports = new FileService;
