const Team = require('../models/Team');
const createLog = require('../utils/logger');

exports.getTeams = async (req, res) => {
  try {
    // Populate basic info of members
    const teams = await Team.find({ organisationId: req.user.organisationId }).populate('members', 'firstName lastName email');
    res.json(teams);
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.createTeam = async (req, res) => {
  try {
    const newTeam = new Team({ ...req.body, organisationId: req.user.organisationId });
    const team = await newTeam.save();
    await createLog({ organisationId: req.user.organisationId, userId: req.user.id, action: 'CREATE_TEAM', meta: { teamId: team._id } });
    res.json(team);
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.addMember = async (req, res) => {
    const { employeeId } = req.body;
    try {
        const team = await Team.findOneAndUpdate(
            { _id: req.params.teamId, organisationId: req.user.organisationId },
            { $addToSet: { members: employeeId } }, // prevent duplicates
            { new: true }
        ).populate('members', 'firstName lastName');
        await createLog({ organisationId: req.user.organisationId, userId: req.user.id, action: 'ADD_EMPLOYEE_TO_TEAM', meta: { teamId: team._id, employeeId } });
        res.json(team);
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.removeMember = async (req, res) => {
    try {
        const team = await Team.findOneAndUpdate(
            { _id: req.params.teamId, organisationId: req.user.organisationId },
            { $pull: { members: req.params.employeeId } },
            { new: true }
        );
        await createLog({ organisationId: req.user.organisationId, userId: req.user.id, action: 'REMOVE_EMPLOYEE_FROM_TEAM', meta: { teamId: team._id, employeeId: req.params.employeeId } });
        res.json(team);
    } catch (err) { res.status(500).send('Server Error'); }
};