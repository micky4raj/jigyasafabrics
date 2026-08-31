import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jigyasa_catalog';

export const connectMongo = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Mongo DB] Connected Successfully');
  } catch (err) {
    console.error('[Mongo DB Error]', err);
  }
};
