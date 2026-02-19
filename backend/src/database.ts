import mongoose from 'mongoose';

// เปลี่ยนจาก /aprojdb เป็น /my_project_db
const DB_URI: string = 'mongodb+srv://white_db:kanyakorn2546@cluster0.o702cvo.mongodb.net/my_project_db';

export const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('✅ MongoDB Atlas connected successfully to my_project_db');
    } catch (error) {
        console.error('❌ MongoDB connection error:', (error as Error).message);
    }
};