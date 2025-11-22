const AuditLog = require('../models/AuditLog');
exports.getLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find({ organisationId: req.user.organisationId })
                                 .sort({ createdAt: -1 })
                                 .populate('userId', 'name');
        res.json(logs);
    } catch (err) { res.status(500).send('Server Error'); }
};