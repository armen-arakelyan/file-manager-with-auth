const express = require('express');
const authController = require('../controllers/auth');
const controllerWrapper = require('../utils/controllerWrapper');

const router = express.Router();

router.post('/signin', controllerWrapper(authController.signIn));
router.post('/signin/new_token', controllerWrapper(authController.generateTokensFromRefreshToken));
router.post('/signup', controllerWrapper(authController.signUp));

module.exports = router;
