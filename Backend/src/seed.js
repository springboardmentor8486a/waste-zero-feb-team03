
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Opportunity from './models/Opportunity.js';
import Application from './models/Application.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Application.deleteMany({});
        await Opportunity.deleteMany({});
        await User.deleteMany({});
        console.log('✅ Data cleared');

        // Create NGO user
        console.log('📝 Creating NGO user...');
        const ngo = await User.create({
            name: 'Green Earth NGO',
            email: 'ngo@greenearth.org',
            password: 'ngo123456',
            role: 'NGO',
            location: 'Chennai',
            bio: 'Environmental conservation organization'
        });
        console.log(`✅ NGO created: ${ngo.email}`);

        // Create Volunteer user
        console.log('📝 Creating Volunteer user...');
        const volunteer = await User.create({
            name: 'John Volunteer',
            email: 'john.volunteer@example.com',
            password: 'volunteer123',
            role: 'volunteer',
            skills: ['Cleaning', 'Driving', 'Teamwork'],
            location: 'Chennai',
            bio: 'Passionate about environmental conservation'
        });
        console.log(`✅ Volunteer created: ${volunteer.email}`);

        // Create Opportunity
        console.log('📝 Creating Opportunity...');
        const opportunity = await Opportunity.create({
            ngo_id: ngo._id,
            title: 'Beach Cleanup Drive',
            description: 'Help clean Marina Beach from plastic waste and debris',
            required_skills: ['Cleaning', 'Teamwork'],
            duration: '4 hours',
            location: 'Marina Beach, Chennai',
            status: 'open'
        });
        console.log(`✅ Opportunity created: ${opportunity.title}`);

        // Create Application
        console.log('📝 Creating Application...');
        const application = await Application.create({
            opportunity_id: opportunity._id,
            volunteer_id: volunteer._id,
            status: 'pending'
        });
        console.log(`✅ Application created for: ${volunteer.name}`);

        console.log('\n🎉 DATABASE SEEDED SUCCESSFULLY! 🎉');

        // Disconnect
        await mongoose.connection.close();
        console.log('✅ Disconnected from MongoDB');

    } catch (error) {
        console.error('\n❌ Error seeding database:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();
