const { emailJob } = require('../database/models');

const addEmailJob = async ({ userEmail, type, payload }) => {
  await emailJob.create({
    userEmail,
    type,
    payload,
    status: 'pending'
  });
};

module.exports = { addEmailJob };