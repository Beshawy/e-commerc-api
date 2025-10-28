const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    console.log('Connecting to DB with:', process.env.DB_URL); // للتشخيص
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB connected');
  } catch (err) {
    console.error('DB connection error:', err.message);
    process.exit(1);
  }
};
module.exports = dbConnection;