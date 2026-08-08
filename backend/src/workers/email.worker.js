const { emailJob } = require('../database/models');
const sendOrderPlacedEmail = require('../utils/orderEmail');

const processJobs = async () => {
  while (true) {
    let job = null;

    try {
      // 1️⃣ Pending job uthao
      job = await emailJob.findOne({
        where: { status: 'pending' },
        order: [['createdAt', 'ASC']],
      });

      if (!job) {
        await new Promise((res) => setTimeout(res, 3000));
        continue;
      }

      // 2️⃣ Mark processing
      job.status = 'processing';
      await job.save();

      const { userEmail, payload, type } = job;

      // 3️⃣ Type ke hisaab se email send karo
      if (type === 'order') {
        await sendOrderPlacedEmail(userEmail, payload);
      }

      // 4️⃣ Success
      job.status = 'sent';
      await job.save();

      console.log('✅ Email sent:', userEmail);
    } catch (error) {
      console.error('❌ Worker error:', error.message);

      if (job) {
        job.attempts += 1;
        job.status = job.attempts >= 3 ? 'failed' : 'pending';
        job.error = error.message;

        await job.save();
      }

      // Worker ko crash hone se bachane ke liye
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
};

processJobs();