import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service.js';

export class DashboardController {
    private dashboardService: DashboardService;

    constructor() {
        this.dashboardService = new DashboardService();
    }

    getManagerStats = async (req: Request, res: Response) => {
        try {
            const stats = await this.dashboardService.getManagerStats();
            res.status(200).json(stats);
        } catch (error: any) {
            console.error('Manager Stats Error:', error);
            res.status(500).json({ message: 'Failed to fetch manager stats', error: error.message });
        }
    }

    getEmployeeStats = async (req: Request, res: Response) => {
        try {
            // Expecting username in query ?username=John
            const username = req.query.username as string || 'Guest';
            const stats = await this.dashboardService.getEmployeeStats(username);
            res.status(200).json(stats);
        } catch (error: any) {
            console.error('Employee Stats Error:', error);
            res.status(500).json({ message: 'Failed to fetch employee stats', error: error.message });
        }
    }
}
