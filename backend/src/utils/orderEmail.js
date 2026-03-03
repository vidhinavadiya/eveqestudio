// const nodemailer = require('nodemailer');

// const sendOrderConfirmation = async (userEmail, orderData) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.zoho.in", 
//       port: 465,
//       secure: true, 
//       auth: {
//         // Aapki .env file ke hisaab se variable names yahan change kar diye hain
//         user: process.env.EMAIL_USER, 
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const htmlContent = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px;">
//         <div style="text-align: center; border-bottom: 2px solid #4F46E5; padding-bottom: 20px;">
//           <h1 style="color: #4F46E5;">Order Confirmed!</h1>
//           <p style="font-size: 16px; color: #555;">Thank you for shopping with us, <b>${orderData.firstName}</b>!</p>
//         </div>
        
//         <div style="padding: 20px 0;">
//           <p><strong>Order Number:</strong> #${orderData.orderNumber}</p>
//           <p><strong>Total Amount:</strong> ₹${orderData.totalAmount}</p>
//           <p><strong>Payment Method:</strong> ${orderData.paymentMethod ? orderData.paymentMethod.toUpperCase() : 'N/A'}</p>
//         </div>

//         <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
//           <h3 style="margin-top: 0;">Shipping Address:</h3>
//           <p style="margin-bottom: 0; color: #666;">
//             ${orderData.addressLine1 || ''}, ${orderData.addressLine2 || ''}<br>
//             ${orderData.city || ''}, ${orderData.state || ''} - ${orderData.pincode || ''}<br>
//             Phone: ${orderData.phone || ''}
//           </p>
//         </div>

//         <div style="text-align: center; margin-top: 30px;">
//           <a href="http://aapki-website.com/my-orders" style="background-color: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Order Status</a>
//         </div>

//         <p style="font-size: 12px; color: #999; text-align: center; margin-top: 40px;">
//           If you have any questions, contact our support team. <br> &copy; 2024 3D Printer Hub
//         </p>
//       </div>
//     `;

//     const mailOptions = {
//       from: `"3D Printer Hub" <${process.env.EMAIL_USER}>`,
//       to: userEmail,
//       subject: `Order Confirmation - #${orderData.orderNumber}`,
//       html: htmlContent,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Order Email sent: " + info.response);
//     return true;
//   } catch (error) {
//     console.error("Order Email Error:", error);
//     return false;
//   }
// };

// module.exports = sendOrderConfirmation;


const nodemailer = require('nodemailer');

const sendOrderPlacedEmail = async (userEmail, orderData) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.in",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #4F46E5;">
          <h1 style="color: #4F46E5; margin: 0; font-size: 32px;">*Order Placed!* 🎉</h1>
          <p style="font-size: 18px; color: #333; margin: 10px 0 0;">
            Hey <strong>${orderData.firstName || 'there'}</strong>,
          </p>
        </div>

        <!-- Main Message -->
        <div style="padding: 25px 0; font-size: 16px; line-height: 1.6; color: #333;">
          <p>We have successfully received your order <strong>#${orderData.orderNumber}</strong></p>
          <p>Due to high demand, your order will be delivered to you in <strong>7-10 days</strong>.</p>
          <p>Sit back & relax! We'll share an order tracking link <strong>as soon as the order is shipped</strong>.</p>
          <p>We hope you enjoyed shopping with us!</p>
          <p style="margin-top: 25px; font-weight: bold; color: #4F46E5;">
            Thank You for choosing 3D Printer Hub!
          </p>
        </div>

        <!-- Order Details -->
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px; font-size: 15px;"><strong>Order Number:</strong> #${orderData.orderNumber}</p>
          <p style="margin: 0 0 10px; font-size: 15px;"><strong>Total Amount:</strong> ₹${orderData.totalAmount}</p>
          <p style="margin: 0; font-size: 15px;"><strong>Payment Method:</strong> ${orderData.paymentMethod ? orderData.paymentMethod.toUpperCase() : 'N/A'}</p>
        </div>

        <!-- Shipping Address -->
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px; color: #333;">Shipping Address:</h3>
          <p style="margin: 0; color: #555; line-height: 1.5;">
            ${orderData.addressLine1 || ''} ${orderData.addressLine2 ? ', ' + orderData.addressLine2 : ''}<br>
            ${orderData.city || ''}, ${orderData.state || ''} - ${orderData.pincode || ''}<br>
            Phone: ${orderData.phone || 'Not provided'}
          </p>
        </div>

        <!-- View Order Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://your-website.com/my-orders?order=${orderData.orderNumber}" 
             style="background-color: #4F46E5; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
            View Order Status
          </a>
        </div>

        <!-- Fraud Warning -->
        <div style="background-color: #fff3f3; border: 1px solid #ffcccc; border-radius: 8px; padding: 20px; margin: 25px 0; font-size: 15px; line-height: 1.6;">
          <p style="font-weight: bold; color: #c00; font-size: 18px; margin: 0 0 12px;">🔴 *Beware of Fraud Calls!* 🔴</p>
          <p>Dear Customer,</p>
          <p>Scammers may call you pretending to be from <strong>3D Printer Hub</strong> offering you gifts, asking for <strong>payments, OTPs, account details, or order information</strong></p>
          <p>These are fraud attempts designed to steal your money. Stay alert!</p>
          <ul style="margin: 12px 0; padding-left: 20px; color: #c00;">
            <li>❌ <strong>We never request re-payment</strong> for any stuck or failed transactions.</li>
            <li>❌ <strong>Our delivery executives will never ask for extra money.</strong></li>
          </ul>
          <p>Fraud calls are a growing concern across brands. Please stay cautious.</p>
          <p style="margin: 15px 0 0; font-weight: bold;">*If you receive a suspicious call:*</p>
          <ul style="margin: 8px 0 0; padding-left: 20px;">
            <li>❌ Do not share OTPs, passwords, or any personal/account details.</li>
            <li>❌ Do not click on unknown links or take any action they suggest.</li>
            <li>✅ Hang up immediately.</li>
            <li>✅ Report the incident here: <a href="https://your-report-link.com" style="color: #0066cc;">https://your-report-link.com</a></li>
          </ul>
          <p style="margin-top: 20px; color: #333;">Your safety is our priority! 💙</p>
          <p style="font-style: italic; margin-top: 10px; color: #555;">_- Team 3D Printer Hub_</p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; font-size: 13px; color: #777; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p>If you have any questions, contact our support team.</p>
          <p>© 2024 3D Printer Hub</p>
        </div>

      </div>
    `;

    const mailOptions = {
      from: `"3D Printer Hub" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Placed Successfully - #${orderData.orderNumber}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Order Placed Email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Order Placed Email Error:", error);
    return false;
  }
};

module.exports = sendOrderPlacedEmail;