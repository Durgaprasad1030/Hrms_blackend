const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organisation = require('../models/Organisation');
const createLog = require('../utils/logger');

exports.register = async (req, res) => {
  const { organisationName, adminName, adminEmail, password } = req.body;
  try {
    let user = await User.findOne({ email: adminEmail });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const org = new Organisation({ name: organisationName, code: organisationName.toLowerCase().replace(/\s/g, '-') });
    await org.save();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ organisationId: org._id, name: adminName, email: adminEmail, password: hashedPassword });
    await user.save();

    res.status(201).json({ msg: 'Organisation and Admin registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { user: { id: user._id, organisationId: user.organisationId } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      createLog({ organisationId: user.organisationId, userId: user._id, action: 'LOGIN' });
      res.json({ token, user: { name: user.name, email: user.email, organisationId: user.organisationId } });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};