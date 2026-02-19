
import { Request, Response } from 'express';
import { TaskService } from '../services/task.service.js';

export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    createTask = async (req: Request, res: Response) => {
        try {
            console.log('--- RECEIVED TASK DATA:', req.body);
            const task = await this.taskService.createTask(req.body);
            res.status(201).json(task);
        } catch (error: any) {
            console.error('Create Task Error:', error.message);
            res.status(400).json({ message: 'Failed to create task', error: error.message });
        }
    }

    // GET /api/tasks
    getAllTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await this.taskService.getAllTasks();
            res.status(200).json(tasks);
        } catch (error: any) {
            console.error('Get Tasks Error:', error.message);
            res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
        }
    }

    // PUT /api/tasks/:id - อัปเดตสถานะงาน (เช่น เปลี่ยนจาก Todo เป็น Done)
    updateTask = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const updatedTask = await this.taskService.updateTask(id, req.body);
            if (!updatedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }
            res.status(200).json(updatedTask);
        } catch (error: any) {
            console.error('Update Task Error:', error.message);
            res.status(500).json({ message: 'Failed to update task', error: error.message });
        }
    }

    // DELETE /api/tasks/:id - ลบงานที่ไม่ต้องการ
    deleteTask = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const deletedTask = await this.taskService.deleteTask(id);
            if (!deletedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }
            res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error: any) {
            console.error('Delete Task Error:', error.message);
            res.status(500).json({ message: 'Failed to delete task', error: error.message });
        }
    }
}
