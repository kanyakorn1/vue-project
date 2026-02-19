// src/index.ts

import express from 'express';
import cors from 'cors';
import { ProjectController } from './controllers/project.controller.js';
import { TaskController } from './controllers/task.controller.js';
import { AuthController } from './controllers/auth.controller.js';
import { DashboardController } from './controllers/dashboard.controller.js';
import { connectDB } from './database.js';

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// สร้าง instance ของ Controller
const projectController = new ProjectController();

// API Routes
app.post('/api/projects', (req, res) => projectController.createProject(req, res));
app.get('/api/projects', (req, res) => projectController.getAllProjects(req, res));
app.put('/api/projects/:id', (req, res) => projectController.updateProject(req, res));
app.delete('/api/projects/:id', (req, res) => projectController.deleteProject(req, res));

const taskController = new TaskController();
app.post('/api/tasks', (req, res) => taskController.createTask(req, res));
app.get('/api/tasks', (req, res) => taskController.getAllTasks(req, res));



const authController = new AuthController();
app.post('/api/register', (req, res) => authController.register(req, res));
app.post('/api/login', (req, res) => authController.login(req, res));

const dashboardController = new DashboardController();
app.get('/api/dashboard/manager', (req, res) => dashboardController.getManagerStats(req, res));
app.get('/api/dashboard/employee', (req, res) => dashboardController.getEmployeeStats(req, res));

// Start Server
app.listen(PORT, () => {
    console.log(`TypeScript Backend API running at http://localhost:${PORT}/`);
    console.log(`API endpoint: http://localhost:${PORT}/api/projects`);
});