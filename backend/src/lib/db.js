import mongoose from "mongoose";

let gfsBucket;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    const db = mongoose.connection.db;
    gfsBucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "profile_pics",
    });
    console.log("GridFS Bucket Initialized");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

export const getGfsBucket = () => {
  if (!gfsBucket) {
    throw new Error("GridFS Bucket not initialized");
  }
  return gfsBucket;
};
