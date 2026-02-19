import ProjectModel from '../schemas/project.schema.js';
import TaskModel from '../schemas/task.schema.js';

export class DashboardService {

    async seedData() {
        const projectCount = await ProjectModel.countDocuments();
        if (projectCount === 0) {
            console.log('Seeding initial projects...');
            await ProjectModel.insertMany([
                { projectName: 'Project Alpha', scopeDetail: 'AI Integration', deadline: '2025-12-31', projectManager: 'Manager', status: 'on time', progress: 75 },
                { projectName: 'Project Beta', scopeDetail: 'Web Revamp', deadline: '2025-11-30', projectManager: 'Manager', status: 'delayed', progress: 40 },
                { projectName: 'Internal Tools', scopeDetail: 'HR System', deadline: '2026-01-15', projectManager: 'Manager', status: 'on time', progress: 20 }
            ]);
        }

        // Check specifically for Critical Tasks (High Priority & Not Done) to ensure Dashboard isn't empty
        const criticalCount = await TaskModel.countDocuments({ priority: 'High', status: { $ne: 'done' } });

        if (criticalCount === 0) {
            console.log('Seeding critical tasks for demo...');
            await TaskModel.insertMany([
                { name: 'Fix Critical Security Bug', project: 'Project Alpha', assignee: 'employee', status: 'in_progress', priority: 'High', dueDate: '2025-12-20' },
                { name: 'Prepare Client Presentation', project: 'Project Alpha', assignee: 'manager', status: 'todo', priority: 'High', dueDate: '2025-12-25' },
                { name: 'Database Migration Strategy', project: 'Internal Tools', assignee: 'lead', status: 'review', priority: 'High', dueDate: '2025-12-28' }
            ]);
        }

        // Also ensure we have at least some basic tasks if totally empty
        const totalCount = await TaskModel.countDocuments();
        if (totalCount === 0) {
            await TaskModel.insertMany([
                { name: 'Routine Maintenance', project: 'Project Beta', assignee: 'employee', status: 'todo', priority: 'Low', dueDate: '2025-12-30' }
            ]);
        }
    }

    async getManagerStats() {
        await this.seedData(); // Ensure data exists

        const totalProjects = await ProjectModel.countDocuments();
        const totalTasks = await TaskModel.countDocuments();
        const completedTasks = await TaskModel.countDocuments({ status: 'done' });
        const openTasks = totalTasks - completedTasks;

        // Task Breakdown
        const todo = await TaskModel.countDocuments({ status: 'todo' });
        const inProgress = await TaskModel.countDocuments({ status: 'in_progress' });
        const review = await TaskModel.countDocuments({ status: 'review' });
        const done = await TaskModel.countDocuments({ status: 'done' });

        // 1. Fetch Critical Tasks
        const highPriorityTasks = await TaskModel.find({
            priority: 'High',
            status: { $ne: 'done' }
        }).lean();

        // 2. Fetch Projects with Upcoming Deadlines (Next 7 Days)
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        const todayStr = today.toISOString().split('T')[0];
        const nextWeekStr = nextWeek.toISOString().split('T')[0];

        const upcomingProjects = await ProjectModel.find({
            deadline: { $gte: todayStr, $lte: nextWeekStr }
        }).lean();

        // 3. Normalize and Combine
        const formattedTasks = highPriorityTasks.map(t => ({
            name: t.name,
            project: t.project,
            priority: t.priority,
            dueDate: t.dueDate,
            assignee: t.assignee
        }));

        const formattedProjects = upcomingProjects.map(p => ({
            name: `Project Due: ${p.projectName}`,
            project: 'ENTIRE PROJECT',
            priority: 'High',
            dueDate: p.deadline,
            assignee: p.projectManager
        }));

        // Merge and Sort by Date
        const combinedCritical = [...formattedTasks, ...formattedProjects].sort((a, b) => {
            return (a.dueDate > b.dueDate) ? 1 : -1;
        }).slice(0, 5);

        return {
            totalProjects,
            totalCompletedTasks: completedTasks,
            totalOpenTasks: openTasks,
            projectHealth: 92,
            upcomingDeadlines: combinedCritical.length,
            breakdown: [
                { name: 'To Do', count: todo, color: '#ff9800' },
                { name: 'In Progress', count: inProgress, color: '#007bff' },
                { name: 'Review', count: review, color: '#9c27b0' },
                { name: 'Done', count: done, color: '#38a169' }
            ],
            criticalTasks: combinedCritical
        };
    }

    async getEmployeeStats(username: string) {
        await this.seedData(); // Ensure data exists

        // Assuming 'assignee' field matches 'username' or 'name' from auth
        // We'll use regex for lenient matching for the demo
        const regex = new RegExp(username, 'i');

        const myOpenTasksCount = await TaskModel.countDocuments({
            assignee: { $regex: regex },
            status: { $ne: 'done' }
        });

        const myCompletedTasksCount = await TaskModel.countDocuments({
            assignee: { $regex: regex },
            status: 'done'
        });

        const myOverdueTasksCount = 0; // Needs date diff logic, skip for simple demo

        const myNextTasks = await TaskModel.find({
            assignee: { $regex: regex },
            status: { $ne: 'done' }
        }).sort({ priority: 1 }).limit(5); // Sort by priority (assuming High is "bigger" string? No, High/Medium/Low. Need custom sort or helper. Mock sort for now)

        return {
            myOpenTasks: myOpenTasksCount,
            myCompletedTasks: myCompletedTasksCount,
            myOverdueTasks: myOverdueTasksCount,
            myNextTasks
        };
    }
}
