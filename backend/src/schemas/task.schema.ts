import mongoose, { Schema } from 'mongoose';
import { ITask } from '../interfaces/task.interface.js';

const TaskSchema: Schema = new Schema({
    name: { type: String, required: true },
    project: { type: String, required: true },
    assignee: { type: String, required: true },
    status: {
        type: String,
        enum: ['todo', 'in_progress', 'review', 'done'],
        default: 'todo'
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    dueDate: { type: String },
    progress: { type: Number, default: 0, min: 0, max: 100 }
}, {
    timestamps: true
});

const TaskModel = mongoose.model<ITask>('Task', TaskSchema);
export default TaskModel;
