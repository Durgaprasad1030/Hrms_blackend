const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'ADMIN' }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);