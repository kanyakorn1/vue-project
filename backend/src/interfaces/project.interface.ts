// backend/src/interfaces/project.interface.ts

import { Document } from 'mongoose';

/**
 * @interface IProject
 * Defines the strict structure for a Project object in TypeScript.
 */
export interface IProject extends Document {
    projectName: string;
    scopeDetail: string;
    deadline: string;
    projectManager: string;
    customFields: Array<{
        label: string;
        type: string;
        options: string[];
        value: any;
    }>;
    createdAt: Date;
}
