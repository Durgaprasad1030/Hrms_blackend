const AuditLog = require('../models/AuditLog');

const createLog = async ({ organisationId, userId, action, meta }) => {
  try {
    await AuditLog.create({ organisationId, userId, action, meta });
  } catch (error) {
    console.error("Logging failed:", error);
  }
};
module.exports = createLog;