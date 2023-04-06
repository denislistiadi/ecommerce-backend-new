const { default: mongoose } = require('mongoose');

const dbConnect = () => {
  try {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MONGO_URL);
    // eslint-disable-next-line no-console
    console.log('DB Connected');
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = dbConnect;
