const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organisation = require('../models/Organisation');
const createLog = require('../utils/logger');

exports.register = async (req, res) => {
  const { organisationName, adminName, adminEmail, password } = req.body;

  try {
    // 1. Check if the Admin Email is already used
    let user = await User.findOne({ email: adminEmail });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // 2. Generate a unique code for the organisation (e.g., "Tech Corp" -> "tech-corp")
    const orgCode = organisationName.trim().toLowerCase().replace(/\s+/g, '-');

    // 3. CHECK IF ORGANISATION ALREADY EXISTS (Prevents Duplicate Key Error)
    let existingOrg = await Organisation.findOne({ code: orgCode });
    if (existingOrg) {
      return res.status(400).json({ msg: 'Organisation name is already registered. Please choose a different name.' });
    }

    // 4. Create and Save Organisation
    const org = new Organisation({ 
      name: organisationName, 
      code: orgCode 
    });
    await org.save();

    // 5. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Create and Save Admin User
    user = new User({ 
      organisationId: org._id, 
      name: adminName, 
      email: adminEmail, 
      password: hashedPassword,
      role: 'ADMIN' 
    });
    await user.save();

    res.status(201).json({ msg: 'Organisation and Admin registered successfully' });

  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 2. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Create JWT Payload
    const payload = { 
      user: { 
        id: user._id, 
        organisationId: user.organisationId 
      } 
    };

    // 4. Sign Token & Return
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      
      // Log the login action
      createLog({ 
        organisationId: user.organisationId, 
        userId: user._id, 
        action: 'LOGIN' 
      });

      res.json({ 
        token, 
        user: { 
          name: user.name, 
          email: user.email, 
          organisationId: user.organisationId 
        } 
      });
    });

  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).send('Server error');
  }
};