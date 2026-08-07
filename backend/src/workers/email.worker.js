const { emailJob } = require('../database/models');
const sendOrderPlacedEmail = require('../utils/orderEmail');

const processJobs = async () => {
  while (true) {
    try {
      // 1️⃣ pending job uthao
      const job = await emailJob.findOne({
        where: { status: 'pending' },
        order: [['createdAt', 'ASC']]
      });

      if (!job) {
        await new Promise(res => setTimeout(res, 3000)); // wait
        continue;
      }

      // 2️⃣ mark processing
      job.status = 'processing';
      await job.save();

      const { userEmail, payload, type } = job;

      // 3️⃣ type ke hisaab se send karo
      if (type === 'order') {
        await sendOrderPlacedEmail(userEmail, payload);
      }

      // 4️⃣ success
      job.status = 'sent';
      await job.save();

      console.log("✅ Email sent:", userEmail);

    } catch (error) {
      console.error("❌ Worker error:", error.message);

      if (job) {
        job.attempts += 1;
        job.status = job.attempts >= 3 ? 'failed' : 'pending';
        job.error = error.message;
        await job.save();
      }
    }
  }
};

processJobs();