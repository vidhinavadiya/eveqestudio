import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOTPEmail = async (toEmail, otp) => {
  try {
    await transporter.sendMail({
      from: `"3D Printer Hub" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Your OTP for Password Reset - 3D Printer Hub',
      html: `
        <h2>Password Reset OTP</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <br>
        <p>Thanks,<br>3D Printer Hub Team</p>
      `
    });
    console.log('OTP email sent to', toEmail);
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send OTP email');
  }
};



// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: 'smtp.zoho.in', // Zoho SMTP
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// export const sendOTPEmail = async (toEmail, otp) => {
//   try {
//     await transporter.sendMail({
//       from: `"3D Printer Hub" <${process.env.EMAIL_USER}>`, // ye no-reply@eveqestudio.com
//       to: toEmail,
//       subject: 'Your OTP for Password Reset - 3D Printer Hub',
//       html: `
//         <h2>Password Reset OTP</h2>
//         <p>Your OTP is: <strong>${otp}</strong></p>
//         <p>This OTP is valid for 10 minutes.</p>
//         <p>If you didn't request this, please ignore this email.</p>
//         <br>
//         <p>Thanks,<br>3D Printer Hub Team</p>
//       `
//     });
//     console.log('OTP email sent to', toEmail);
//   } catch (error) {
//     console.error('Email send error:', error);
//     throw new Error('Failed to send OTP email');
//   }
// };
