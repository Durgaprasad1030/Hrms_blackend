const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// 1. Load env vars safely (Finds .env in 'backend' folder)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import Models
const User = require('./models/User');
const Organisation = require('./models/Organisation');
const Employee = require('./models/Employee');
const Team = require('./models/Team');

// 2. Configuration
// It will now prioritize the Atlas URL from your .env file
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hrms_db';

const seedData = async () => {
  try {
    // Hide password in logs for security
    const secureURI = MONGO_URI.includes('@') 
      ? MONGO_URI.replace(/:([^:@]+)@/, ':****@') 
      : MONGO_URI;
      
    console.log(`⏳ Connecting to MongoDB: ${secureURI}...`);
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas!');

    // 1. CLEANUP
    console.log('🧹 Clearing existing data...');
    try {
      await User.deleteMany({});
      await Organisation.deleteMany({});
      await Employee.deleteMany({});
      await Team.deleteMany({});
    } catch (e) {
      console.log('   (No previous data to clear)');
    }

    // 2. CREATE ORGANISATION
    console.log('🏢 Creating Organisation...');
    const org = await Organisation.create({
      name: 'Tech Innovators Inc.',
      code: 'tech-innovators'
    });

    // 3. CREATE ADMIN USER
    console.log('👤 Creating Admin User...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      organisationId: org._id,
      name: 'Admin User',
      email: 'admin@tech.com',
      password: hashedPassword,
      role: 'ADMIN'
    });

    // 4. CREATE EMPLOYEES
    console.log('👥 Creating Employees...');
    const employees = await Employee.insertMany([
      { organisationId: org._id, firstName: 'Alice', lastName: 'Johnson', email: 'alice@tech.com', position: 'Senior Developer', status: 'active' },
      { organisationId: org._id, firstName: 'Bob', lastName: 'Smith', email: 'bob@tech.com', position: 'Product Manager', status: 'active' },
      { organisationId: org._id, firstName: 'Charlie', lastName: 'Davis', email: 'charlie@tech.com', position: 'UX Designer', status: 'active' },
      { organisationId: org._id, firstName: 'Diana', lastName: 'Prince', email: 'diana@tech.com', position: 'QA Engineer', status: 'active' },
      { organisationId: org._id, firstName: 'Evan', lastName: 'Wright', email: 'evan@tech.com', position: 'DevOps Engineer', status: 'inactive' },
    ]);

    // 5. CREATE TEAMS
    console.log('🚀 Creating Teams...');
    const teamEngineering = await Team.create({
      organisationId: org._id,
      name: 'Engineering',
      description: 'Core product development team',
      members: [employees[0]._id, employees[4]._id] // Alice & Evan
    });

    const teamProduct = await Team.create({
      organisationId: org._id,
      name: 'Product & Design',
      description: 'Product strategy and UI/UX',
      members: [employees[1]._id, employees[2]._id] // Bob & Charlie
    });

    console.log('------------------------------------------------');
    console.log('🎉 SEEDING COMPLETE!');
    console.log('------------------------------------------------');
    console.log('Login Credentials:');
    console.log(`Email:    admin@tech.com`);
    console.log(`Password: password123`);
    console.log('------------------------------------------------');

    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    if (err.message.includes('bad auth')) {
        console.error('👉 TIP: Check your database username and password in .env');
    } else if (err.message.includes('whitelisted')) {
        console.error('👉 TIP: Go to Network Access in Atlas and click "Add IP Address" -> "Allow Access from Anywhere"');
    }
    process.exit(1);
  }
};

seedData();