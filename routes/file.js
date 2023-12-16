const express = require('express');
const multer = require('multer');
const fileController = require('../controllers/file');
const controllerWrapper = require('../utils/controllerWrapper');
const { assertAuth } = require('../middlewares/auth');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/list', assertAuth, controllerWrapper(fileController.list));
router.get('/:id', assertAuth, controllerWrapper(fileController.getFile))
router.post('/upload', assertAuth, upload.single('file'), controllerWrapper(fileController.upload));
router.delete('/delete/:id', assertAuth, controllerWrapper(fileController.deleteFile));
router.get('/download/:id', assertAuth, controllerWrapper(fileController.downloadFile));
router.put('/update/:id', assertAuth, upload.single('file'), controllerWrapper(fileController.updateFile));

module.exports = router;
