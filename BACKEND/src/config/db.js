import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Failed", error);
    process.exit(1); // used to shut down the server if MongoDB fails to connect, [0 - success, 1 - failure ]
  }
};

export default connectDB;