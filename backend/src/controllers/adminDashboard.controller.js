const dashboardService = require('../services/adminDashboard.service');

exports.getDashboard = async (req, res) => {
  try {
    const response = await dashboardService.getDashboardData();

    return res.status(200).json(response);

  } catch (error) {
    console.error("Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};