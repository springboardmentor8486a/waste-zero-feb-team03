import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

// Load env vars
dotenv.config();

const seedAdmin = async () => {
    await connectDB();
    try {
        const adminEmail = 'admin@wastezero.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            console.log('Admin user already exists:', adminEmail);
            process.exit(0);
        }

        await User.create({
            name: 'System Admin',
            email: adminEmail,
            password: 'password123',
            role: 'admin',
            status: 'active'
        });

        console.log('Admin user seeded successfully. Email: admin@wastezero.com, Password: password123');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
