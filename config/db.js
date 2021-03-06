const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

//mongoose return promises
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected...');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
