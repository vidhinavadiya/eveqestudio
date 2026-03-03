const UserService = require('../services/user.service');

class UserController {

    // REGISTER
    static async register(req, res) {
        try {
            const result = await UserService.register(req.body);
            return res.status(201).json({
                success: true,
                message: 'user registered successfully',
                data: result
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // LOGIN
    static async login(req, res) {
        try {
            const result = await UserService.login(req.body);
            return res.status(200).json({
                success: true,
                message: 'login successful',
                data: result
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET CURRENT USER PROFILE
    static async getProfile(req, res) {
        try {
            const userId = req.user.id; // from AuthMiddleware
            const user = await UserService.getById(userId);
            return res.status(200).json({ success: true, user });
        } catch (error) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    // UPDATE PROFILE
    static async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const updatedUser = await UserService.updateById(userId, req.body);
            return res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                user: updatedUser
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

            const result = await UserService.forgotPassword(email);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
    //reset password
    static async resetPassword(req, res) {
        try {
            const { email, otp, newPassword } = req.body;
            if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
            }

            const result = await UserService.verifyOTPAndResetPassword(email, otp, newPassword);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
    // GET ALL USERS (ADMIN)
    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

}

module.exports = UserController;
