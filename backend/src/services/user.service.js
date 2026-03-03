const UserRepository = require('../repositories/user.repository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { sendOTPEmail } = require('../utils/email');

class UserService {

    // REGISTER
    static async register({ username, email, password, role }) {
        if (!username || !email || !password) {
            throw new Error('username, email and password are required');
        }

        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('email already exists')
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserRepository.createUser({
            username,
            email,
            password: hashedPassword,
            role: role || 'customer'
        });

        const token = jwt.sign(
            { id: newUser.id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const userJson = newUser.toJSON();
        delete userJson.password;

        return { user: userJson, token };
    }

    // LOGIN
    static async login({ email, password }) {
        if (!email || !password) {
            throw new Error('email and password are required')
        };

        const existingUser = await UserRepository.findByEmail(email);
        if (!existingUser) {
            throw new Error('invalid email')
        };

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            throw new Error('invalid password')
        };

        const token = jwt.sign(
            { id: existingUser.id, role: existingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const userJson = existingUser.toJSON();
        delete userJson.password;

        return { user: userJson, token };
    }

    // GET CURRENT USER
    static async getById(userId) {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new Error('User not found')
        };
        return user;
    }

    // UPDATE PROFILE (can update password)
    static async updateById(userId, userData) {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        const updatedUser = await UserRepository.updateById(userId, userData);
        if (!updatedUser) {
            throw new Error('user not found')
        };

        const userJson = updatedUser.toJSON();
        delete userJson.password;
        return userJson;
    }
// OTP generate function (same hai, good)
  static generateOTP() {
    return crypto.randomInt(100000, 999999).toString(); // 6 digit OTP
  }

static async forgotPassword(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error('User not found');

    const otp = this.generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await UserRepository.updateById(user.id, {
        otp,
        otpExpires
    });

    // Yahan direct utils/email.js ka function call karo
    await sendOTPEmail(email, otp);

    return { success: true, message: 'OTP sent to your email' };
}

  // Verify OTP & Reset Password
  static async verifyOTPAndResetPassword(email, otp, newPassword) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error('User not found');

    // OTP check
    if (!user.otp || user.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      throw new Error('OTP has expired');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user
    await UserRepository.updateById(user.id, {
      password: hashedPassword,
      otp: null,
      otpExpires: null
    });

    return { success: true, message: 'Password reset successful' };
  }
    // GET ALL USERS (ADMIN ONLY)
    static async getAllUsers() {
        const users = await UserRepository.findAllUsers();
        return users;
    }

}

module.exports = UserService;
