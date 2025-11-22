const Employee = require('../models/Employee');
const createLog = require('../utils/logger');

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ organisationId: req.user.organisationId });
    res.json(employees);
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.createEmployee = async (req, res) => {
  try {
    const newEmp = new Employee({ ...req.body, organisationId: req.user.organisationId });
    const emp = await newEmp.save();
    await createLog({ organisationId: req.user.organisationId, userId: req.user.id, action: 'CREATE_EMPLOYEE', meta: { employeeId: emp._id } });
    res.json(emp);
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.updateEmployee = async (req, res) => {
  try {
    const emp = await Employee.findOneAndUpdate(
      { _id: req.params.id, organisationId: req.user.organisationId },
      { $set: req.body },
      { new: true }
    );
    await createLog({ organisationId: req.user.organisationId, userId: req.user.id, action: 'UPDATE_EMPLOYEE', meta: { employeeId: emp._id } });
    res.json(emp);
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.deleteEmployee = async (req, res) => {
    try {
      await Employee.findOneAndDelete({ _id: req.params.id, organisationId: req.user.organisationId });
      await createLog({ organisationId: req.user.organisationId, userId: req.user.id, action: 'DELETE_EMPLOYEE', meta: { employeeId: req.params.id } });
      res.json({ msg: 'Employee removed' });
    } catch (err) { res.status(500).send('Server Error'); }
};