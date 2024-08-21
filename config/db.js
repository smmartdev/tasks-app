const mongoose = require('mongoose');
const mongoURI ='mongodb+srv://smartdev989:63NQtc5fnNurSdR0@cluster0.i1ryl.mongodb.net/ecommerce-db?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect('mongoURI', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
