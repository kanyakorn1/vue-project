
import TaskModel from '../schemas/task.schema.js';
import { ITask } from '../interfaces/task.interface.js';

export class TaskService {

    // Create a new task
    async createTask(data: Partial<ITask>): Promise<ITask> {
        try {
            const task = new TaskModel(data);
            return await task.save();
        } catch (error: any) {
            console.error('Error creating task:', error.message);
            throw error;
        }
    }

    // Get all tasks
    async getAllTasks(): Promise<ITask[]> {
        return await TaskModel.find().sort({ createdAt: -1 });
    }

    // Update a task
    async updateTask(id: string, data: Partial<ITask>): Promise<ITask | null> {
        try {
            return await TaskModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error: any) {
            console.error('Error updating task:', error.message);
            throw error;
        }
    }

    // Delete a task
    async deleteTask(id: string): Promise<ITask | null> {
        try {
            return await TaskModel.findByIdAndDelete(id);
        } catch (error: any) {
            console.error('Error deleting task:', error.message);
            throw error;
        }
    }
}
