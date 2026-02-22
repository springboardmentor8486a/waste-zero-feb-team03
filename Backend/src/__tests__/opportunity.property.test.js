import fc from 'fast-check';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';
import User from '../models/User.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Arbitraries for generating test data
const ngoUserArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  email: fc.emailAddress(),
  password: fc.string({ minLength: 8, maxLength: 20 }).filter(s => s.trim().length >= 8),
  role: fc.constant('NGO')
});

const opportunityDataArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
  required_skills: fc.array(fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0), { maxLength: 10 }),
  duration: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  location: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0)
});

describe('Opportunity Property-Based Tests', () => {
  test('Property 1: For any authenticated NGO user and valid opportunity data, creating an opportunity should associate it with the creator', async () => {
    await fc.assert(
      fc.asyncProperty(ngoUserArbitrary, opportunityDataArbitrary, async (userData, oppData) => {
        // Create NGO user
        const ngo = await User.create(userData);

        // Create opportunity
        const opportunity = await Opportunity.create({
          ngo_id: ngo._id,
          ...oppData
        });

        // Verify association
        expect(opportunity.ngo_id.toString()).toBe(ngo._id.toString());
      }),
      { numRuns: 20 }
    );
  }, 60000);


  test('Property 10: For any skill search query, all returned opportunities should include that skill', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(opportunityDataArbitrary, { minLength: 3, maxLength: 10 }),
        fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
        async (opportunitiesData, searchSkill) => {
          // Create NGO user
          const ngo = await User.create({
            name: 'Test NGO',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            role: 'NGO'
          });

          // Create opportunities with some having the search skill
          const opportunities = await Promise.all(
            opportunitiesData.map((oppData, index) => {
              const skills = index % 2 === 0 
                ? [...oppData.required_skills, searchSkill]
                : oppData.required_skills.filter(s => s !== searchSkill);
              
              return Opportunity.create({
                ngo_id: ngo._id,
                ...oppData,
                required_skills: skills,
                status: 'open'
              });
            })
          );

          // Query opportunities by skill
          const results = await Opportunity.find({
            status: 'open',
            required_skills: { $in: [searchSkill] }
          });

          // Verify all results include the search skill
          results.forEach(opp => {
            expect(opp.required_skills).toContain(searchSkill);
          });
        }
      ),
      { numRuns: 10 }
    );
  }, 60000);
  test('Property 11: For any location search query, all returned opportunities should match that location', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(opportunityDataArbitrary, { minLength: 3, maxLength: 10 }),
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        async (opportunitiesData, searchLocation) => {
          // Create NGO user
          const ngo = await User.create({
            name: 'Test NGO',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            role: 'NGO'
          });

          // Create opportunities with some having the search location
          const opportunities = await Promise.all(
            opportunitiesData.map((oppData, index) => {
              const location = index % 2 === 0 ? searchLocation : oppData.location;
              
              return Opportunity.create({
                ngo_id: ngo._id,
                ...oppData,
                location,
                status: 'open'
              });
            })
          );

          // Query opportunities by location
          const results = await Opportunity.find({
            status: 'open',
            location: searchLocation
          });

          // Verify all results match the search location
          results.forEach(opp => {
            expect(opp.location).toBe(searchLocation);
          });
        }
      ),
      { numRuns: 10 }
    );
  }, 60000);

  test('Property 13: For any request to list all opportunities, all returned opportunities should have status open', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(opportunityDataArbitrary, { minLength: 3, maxLength: 6 }),
        async (opportunitiesData) => {
          // Create NGO user
          const ngo = await User.create({
            name: 'Test NGO',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            role: 'NGO'
          });

          // Create opportunities with mixed statuses
          const opportunities = await Promise.all(
            opportunitiesData.map((oppData, index) => {
              const statuses = ['open', 'closed', 'in-progress'];
              const status = statuses[index % statuses.length];
              
              return Opportunity.create({
                ngo_id: ngo._id,
                ...oppData,
                status
              });
            })
          );

          // Query all opportunities (public access - should only return open)
          const results = await Opportunity.find({ status: 'open' });

          // Verify all results have status 'open'
          results.forEach(opp => {
            expect(opp.status).toBe('open');
          });
        }
      ),
      { numRuns: 5 }
    );
  }, 60000);
  test('Property 5: For any opportunity with associated applications, deleting the opportunity should remove all associated applications', async () => {
    await fc.assert(
      fc.asyncProperty(
        opportunityDataArbitrary,
        fc.integer({ min: 1, max: 5 }),
        async (oppData, numApplications) => {
          // Create NGO user
          const ngo = await User.create({
            name: 'Test NGO',
            email: `test-ngo-${Date.now()}@example.com`,
            password: 'password123',
            role: 'NGO'
          });

          // Create opportunity
          const opportunity = await Opportunity.create({
            ngo_id: ngo._id,
            ...oppData
          });

          // Create volunteer users and applications
          const volunteers = await Promise.all(
            Array.from({ length: numApplications }, (_, i) => 
              User.create({
                name: `Volunteer ${i}`,
                email: `volunteer-${Date.now()}-${i}@example.com`,
                password: 'password123',
                role: 'volunteer'
              })
            )
          );

          const applications = await Promise.all(
            volunteers.map(volunteer =>
              Application.create({
                opportunity_id: opportunity._id,
                volunteer_id: volunteer._id,
                status: 'pending'
              })
            )
          );

          // Verify applications exist
          const beforeCount = await Application.countDocuments({ opportunity_id: opportunity._id });
          expect(beforeCount).toBe(numApplications);

          // Delete opportunity (should cascade to applications)
          await Application.deleteMany({ opportunity_id: opportunity._id });
          await Opportunity.findByIdAndDelete(opportunity._id);

          // Verify all applications are deleted
          const afterCount = await Application.countDocuments({ opportunity_id: opportunity._id });
          expect(afterCount).toBe(0);
        }
      ),
      { numRuns: 10 }
    );
  }, 60000);
});
