
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Opportunity from './models/Opportunity.js';
import Application from './models/Application.js';

dotenv.config();

const testDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test 1: Create NGO user
    console.log('📝 Test 1: Creating NGO user...');
    const ngo = await User.create({
      name: 'Green Earth NGO',
      email: 'ngo@greenearth.org',
      password: 'ngo123456',
      role: 'NGO',
      location: 'Chennai',
      bio: 'Environmental conservation organization'
    });
    console.log('✅ NGO created:', ngo.email, '\n');

    // Test 2: Create Volunteer user
    console.log('📝 Test 2: Creating Volunteer user...');
    const volunteer = await User.create({
      name: 'John Volunteer',
      email: 'john.volunteer@example.com',
      password: 'volunteer123',
      role: 'volunteer',
      skills: ['Cleaning', 'Driving', 'Teamwork'],
      location: 'Chennai',
      bio: 'Passionate about environmental conservation'
    });
    console.log('✅ Volunteer created:', volunteer.email, '\n');

    // Test 3: Create Opportunity
    console.log('📝 Test 3: Creating Opportunity...');
    const opportunity = await Opportunity.create({
      ngo_id: ngo._id,
      title: 'Beach Cleanup Drive',
      description: 'Help clean Marina Beach from plastic waste and debris',
      required_skills: ['Cleaning', 'Teamwork'],
      duration: '4 hours',
      location: 'Marina Beach, Chennai',
      status: 'open'
    });
    console.log('✅ Opportunity created:', opportunity.title, '\n');

    // Test 4: Create Application
    console.log('📝 Test 4: Creating Application...');
    const application = await Application.create({
      opportunity_id: opportunity._id,
      volunteer_id: volunteer._id,
      status: 'pending'
    });
    console.log('✅ Application created for:', volunteer.name, '\n');

    // Test 5: Query with population
    console.log('📝 Test 5: Querying with population...');
    const populatedApp = await Application.findById(application._id)
      .populate('volunteer_id', 'name email')
      .populate('opportunity_id', 'title location');
    console.log('✅ Application details:');
    console.log('   Volunteer:', populatedApp.volunteer_id.name);
    console.log('   Opportunity:', populatedApp.opportunity_id.title);
    console.log('   Status:', populatedApp.status, '\n');

    // Clean up
    console.log('🧹 Cleaning up test data...');
    await Application.deleteOne({ _id: application._id });
    await Opportunity.deleteOne({ _id: opportunity._id });
    await User.deleteOne({ _id: volunteer._id });
    await User.deleteOne({ _id: ngo._id });
    console.log('✅ Test data deleted\n');

    // Disconnect
    await mongoose.connection.close();
    console.log('✅ Disconnected from MongoDB');
    console.log('\n🎉 ALL DATABASE TESTS PASSED! 🎉');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    
    // Ensure cleanup even on error
    await mongoose.connection.close();
    process.exit(1);
  }
};

testDatabase();
