// backend/src/controllers/project.controller.ts

import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service.js';

export class ProjectController {
    private projectService: ProjectService;

    constructor() {
        this.projectService = new ProjectService();
    }

    // POST /api/projects
    createProject = async (req: Request, res: Response) => {
        // *** เพิ่ม: Log ข้อมูลที่ได้รับ เพื่อยืนยันว่า Express ได้รับข้อมูลจาก Vue ***
        console.log('--- RECEIVED POST DATA:', req.body);

        try {
            const project = await this.projectService.createProject(req.body);
            res.status(201).json(project);
        } catch (error: any) {
            // *** ส่วนที่แก้ไข: จัดการ Error เพื่อส่งสถานะที่ชัดเจนกลับไป ***

            let status = 500;

            // ถ้า Error Message มีคำว่า 'Validation failed' หรือ 'Cast to number failed' 
            // ให้ถือว่าเป็น Bad Request (400)
            if (error.message.includes('Validation failed') || error.message.includes('Cast to number failed')) {
                status = 400;
            }

            // Log Error ให้ชัดเจนใน Terminal ของ Backend
            console.error('API Error in createProject:', error.message);

            res.status(status).json({
                message: 'Failed to create project',
                error: error.message
            });
        }
    }

    // GET /api/projects
    getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await this.projectService.getAllProjects();
            res.status(200).json(projects);
        } catch (error: any) {
            console.error('Get Projects Error:', error);
            res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
        }
    }
    // PUT /api/projects/:id
    updateProject = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const updatedProject = await this.projectService.updateProject(id, req.body);
            if (!updatedProject) {
                return res.status(404).json({ message: 'Project not found' });
            }
            res.status(200).json(updatedProject);
        } catch (error: any) {
            console.error('Update Project Error:', error);
            res.status(500).json({ message: 'Failed to update project', error: error.message });
        }
    }
    // DELETE /api/projects/:id
    deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const deletedProject = await this.projectService.deleteProject(id);
            if (!deletedProject) {
                return res.status(404).json({ message: 'Project not found' });
            }
            res.status(200).json({ message: 'Project deleted successfully' });
        } catch (error: any) {
            console.error('Delete Project Error:', error);
            res.status(500).json({ message: 'Failed to delete project', error: error.message });
        }
    }
}