var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var morgan = require('morgan'); // ← morgan का नाम अलग रखा
const winstonLogger = require('./src/utils/logger'); // ← winston का नाम अलग रखा (conflict हटा)

require('./src/database/config/db');

var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/users');
var categoryRouter = require('./src/routes/category');
var subCategoryRouter = require('./src/routes/subcategory');
var productRouter = require('./src/routes/product');
var couponRouter = require('./src/routes/coupon');
var cartRouter = require('./src/routes/cart');
var bxgycouponRouter = require('./src/routes/bxgycoupon');
var orderRouter = require('./src/routes/order');
var reviewRoutes = require('./src/routes/review');
var faqRoutes = require("./src/routes/faq");
var productAddon = require("./src/routes/productAddon");
var adminRoutes = require('./src/routes/admin.routes');


var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// ─── Logging ───
// Morgan से HTTP requests log करो (winston में भेजो)
app.use(morgan('dev', {
  stream: {
    write: message => winstonLogger.http(message.trim())
  }
}));

// Startup logs (winston से)
winstonLogger.info('Server is starting...');
winstonLogger.debug('Debug mode enabled (development only)');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));
// Routes
app.use('/', indexRouter);
app.use('/api/auth', usersRouter);
app.use('/api/category', categoryRouter);
app.use('/uploads/categories', express.static(path.join(__dirname, 'src/uploads/categories')));
app.use('/api/subcategory', subCategoryRouter);
app.use('/uploads/subcategories', express.static(path.join(__dirname, 'src/uploads/subcategories')));
app.use('/api/product', productRouter);
app.use('/uploads/products', express.static(path.join(__dirname, 'src/uploads/products')));
app.use('/api/coupon', couponRouter);
app.use('/api/cart' , cartRouter);
app.use('/api/bxgy-coupon', bxgycouponRouter);
app.use('/api/order', orderRouter);
app.use('/api/reviews', reviewRoutes);
app.use('/uploads/reviews', express.static(path.join(__dirname, 'src/uploads/reviews')));
app.use("/api/faqs", faqRoutes);
app.use("/api/link", productAddon);
app.use('/uploads/product-addons', express.static(path.join(__dirname, 'src/uploads/product_addons')));
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Eveqe Studio API is running' });
});

// 404 handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  winstonLogger.error('Server error occurred', {
    message: err.message,
    stack: err.stack,
    status: err.status || 500,
    url: req.originalUrl,
    method: req.method
  });

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(req.app.get('env') === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  winstonLogger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`); // optional
});



module.exports = app;