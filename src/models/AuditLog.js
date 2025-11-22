const mongoose = require('mongoose');
const AuditLogSchema = new mongoose.Schema({
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  meta: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });
module.exports = mongoose.model('AuditLog', AuditLogSchema);