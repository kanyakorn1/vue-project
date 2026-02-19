import { Document } from 'mongoose';

export interface ITask extends Document {
    name: string;
    project: string;
    assignee: string;
    status: 'todo' | 'in_progress' | 'review' | 'done';
    priority: 'High' | 'Medium' | 'Low';
    dueDate: string;
    progress: number;
    createdAt: Date;
    updatedAt: Date;
}
