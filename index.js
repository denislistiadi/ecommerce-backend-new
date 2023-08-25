const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();
const cors = require('cors');
const dbConnect = require('./config/dbConnect');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

const PORT = process.env.PORT || 4000;

const authRouter = require('./routes/authRoute');

const productRouter = require('./routes/productRoute');
const categoryRouter = require('./routes/prodCategoryRoute');
const brandRouter = require('./routes/brandRoute');
const couponRouter = require('./routes/couponRoute');

const cartRouter = require('./routes/cartRoute');
const orderRouter = require('./routes/orderRoute');

const blogRouter = require('./routes/blogRoute');
const blogCategoryRouter = require('./routes/blogCategoryRoute');

// connect DB
dbConnect();

app.use(cors());

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', categoryRouter);
app.use('/api/blog-category', blogCategoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// handler middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at ${PORT}`);
});
