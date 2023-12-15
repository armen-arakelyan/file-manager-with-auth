const express = require('express');
const authController = require('../controllers/auth');
const controllerWrapper = require('../utils/controllerWrapper');
const { assertAuth } = require('../middlewares/auth');

const router = express.Router();

router.post('/signin', controllerWrapper(authController.signIn));
router.post('/signup', controllerWrapper(authController.signUp));
router.post('/signin/new_token', assertAuth, controllerWrapper(authController.generateTokensFromRefreshToken));

module.exports = router;
