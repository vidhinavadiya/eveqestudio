const { user } = require('../database/models');

class UserRepository {

    // Find user by email
    static async findByEmail(email) {
        return await user.findOne({ where: { email } });
    }

    // Create new user
    static async createUser(userData) {
        return await user.create(userData);
    }

    // Find user by ID (exclude password)
    static async findById(userId) {
        return await user.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
    }

    // Update user by ID
    static async updateById(userId, userData) {
        const foundUser = await user.findByPk(userId);
        if (!foundUser) return null;
        await foundUser.update(userData);
        return foundUser;
    }
    // Get all users (exclude password)
    static async findAllUsers() {
        return await user.findAll({
            attributes: { exclude: ['password'] }
        });
    }

}

module.exports = UserRepository;
