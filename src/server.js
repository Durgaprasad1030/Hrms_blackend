const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/auth.middleware');
require('dotenv').config();

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (Inline for simplicity, typically separate files)
const authController = require('./controllers/auth.controller');
const empController = require('./controllers/employee.controller');
const teamController = require('./controllers/team.controller');
const logController = require('./controllers/log.controller');

// Auth Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// Employee Routes
const empRouter = express.Router();
empRouter.get('/', empController.getEmployees);
empRouter.post('/', empController.createEmployee);
empRouter.put('/:id', empController.updateEmployee);
empRouter.delete('/:id', empController.deleteEmployee);
app.use('/api/employees', authMiddleware, empRouter);

// Team Routes
const teamRouter = express.Router();
teamRouter.get('/', teamController.getTeams);
teamRouter.post('/', teamController.createTeam);
teamRouter.post('/:teamId/members', teamController.addMember);
teamRouter.delete('/:teamId/members/:employeeId', teamController.removeMember);
app.use('/api/teams', authMiddleware, teamRouter);

// Log Routes
app.get('/api/logs', authMiddleware, logController.getLogs);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));