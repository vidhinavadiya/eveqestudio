const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

const sendCouponEmail = async (user, coupon, products, type = "general") => {

  let productHTML = "";

  // 🔹 BXGY OR Discount Products
  if (products && products.length > 0) {
    productHTML = products.map(p => `
      <div style="border:1px solid #ddd;padding:10px;margin:10px;border-radius:8px;">
        <img src="http://localhost:5000${p.images?.[0]?.fileUrl || ''}" width="120" />
        <h3>${p.productName}</h3>
        <p>₹${p.sellingPrice}</p>
        <a href="http://localhost:3000/product/${p.productId}" 
           style="display:inline-block;padding:8px 12px;background:#000;color:#fff;text-decoration:none;border-radius:5px;">
           View Product
        </a>
      </div>
    `).join("");
  }

  // 🔹 Discount Text
  const discountText =
    coupon.discountType === "percentage"
      ? `${coupon.discountValue}% OFF`
      : `₹${coupon.discountValue} OFF`;

  // 🔹 Final Email HTML
  const html = `
    <div style="font-family:Arial;padding:20px;">
      
      <h2>🎉 New Coupon Available!</h2>

      <p>Hi <b>${user.username}</b> 👋</p>

      <h3 style="color:green;">${discountText}</h3>

      <p><b>Coupon Code:</b> ${coupon.code}</p>

      ${coupon.minorderamount ? `<p>Valid on products above ₹${coupon.minorderamount}</p>` : ""}

      ${coupon.expiryDate ? `<p>Expiry: ${new Date(coupon.expiryDate).toDateString()}</p>` : ""}

      <hr/>

      ${productHTML ? `<h3>Applicable Products:</h3>${productHTML}` : ""}

      <br/>

      <a href="http://localhost:3000/products?minPrice=${coupon.minorderamount || 0}"
         style="display:inline-block;padding:12px 20px;background:#28a745;color:white;text-decoration:none;border-radius:6px;">
         🛒 Shop Now
      </a>

    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "🔥 New Coupon Just for You!",
    html
  });
};

module.exports = { sendCouponEmail };