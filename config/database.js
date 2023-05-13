const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbConnect = await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useCreateIndex: true,
    });

    console.log(
      `Db is connected successfully on host: ${dbConnect.connection.host}`
    );
  } catch (error) {}
};

module.exports = connectDB;
