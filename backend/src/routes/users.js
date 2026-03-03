const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

// REGISTER & LOGIN
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// CURRENT USER PROFILE (view & update)
router.get('/me', AuthMiddleware(['customer', 'admin', 'seller']), UserController.getProfile);
router.put('/me', AuthMiddleware(['customer', 'admin', 'seller']), UserController.updateProfile);

//otp
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', UserController.resetPassword);

// ADMIN → GET ALL USERS
router.get(
    '/admin/users',
    AuthMiddleware(['admin']),
    UserController.getAllUsers
);
module.exports = router;
