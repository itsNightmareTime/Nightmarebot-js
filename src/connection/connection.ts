import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();

export const database = mongoose.connect(
  process.env.DB_URL as string,
  {
    user: process.env.DB_USER as string,
    pass: process.env.DB_PASSWORD as string,
  }
)