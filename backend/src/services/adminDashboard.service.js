const dashboardRepo = require('../repositories/adminDashboard.repository');

exports.getDashboardData = async () => {
  try {
    const data = await dashboardRepo.getDashboardStats();

    return {
      success: true,
      message: "Dashboard data fetched successfully",
      data
    };

  } catch (error) {
    console.error("Service Error:", error);
    throw error;
  }
};