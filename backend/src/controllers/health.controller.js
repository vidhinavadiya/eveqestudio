const { sequelize } = require("../database/config/db");

const healthCheck = async (req, res) => {
  try {
    // Actually check Aiven MySQL connection
    await sequelize.authenticate();

    return res.status(200).json({
      success: true,
      message: "Server and database are running",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error("❌ Health check DB error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
};

module.exports = {
  healthCheck,
};