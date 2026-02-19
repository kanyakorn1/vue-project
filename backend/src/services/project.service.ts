// src/services/project.service.ts (เวอร์ชันแก้ไข)

import ProjectModel from '../schemas/project.schema.js';
import { IProject } from '../interfaces/project.interface.js';

export class ProjectService {

    // สร้าง Project ใหม่ลง MongoDB
    async createProject(data: Partial<IProject>): Promise<IProject> {
        try {
            const project = new ProjectModel(data);
            return await project.save(); // *** Mongoose save() Error มักเกิดตรงนี้ ***
        } catch (error: any) {
            // *** เพิ่มการแสดง Error ที่ละเอียดขึ้น ***
            console.error('Mongoose Validation Error Detail:', error.message);
            console.error('Error Code:', error.code);

            // ถ้าเป็น Validation Error, ให้โยน Error ที่ชัดเจนออกไป
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map((err: any) => err.message);
                throw new Error(`Validation failed: ${messages.join(', ')}`);
            }

            throw error; // โยน Error อื่นๆ ต่อไป
        }
    }

    // ดึง Project ทั้งหมดจาก MongoDB (เหมือนเดิม)
    async getAllProjects(): Promise<IProject[]> {
        return await ProjectModel.find().sort({ createdAt: -1 });
    }
    // อัปเดต Project ที่มีอยู่
    async updateProject(id: string, data: Partial<IProject>): Promise<IProject | null> {
        return await ProjectModel.findByIdAndUpdate(id, data, { new: true });
    }

    // ลบ Project
    async deleteProject(id: string): Promise<IProject | null> {
        return await ProjectModel.findByIdAndDelete(id);
    }
}