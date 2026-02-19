import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    register = async (req: Request, res: Response) => {
        try {
            const { username, email, gender } = req.body;

            if (!username || !email || !gender) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const newUser = await this.authService.register({ username, email, gender });

            res.status(201).json({
                message: 'User registered successfully',
                user: newUser
            });
        } catch (error: any) {
            console.error('Registration Error:', error);
            res.status(500).json({ message: 'Registration failed', error: error.message });
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password, role } = req.body;

            // Basic validation
            if (!email || !password || !role) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // In real app: Validate password here.
            // For demo: We trust the seed/lazy-create logic in service.

            const user = await this.authService.login(email, role);

            if (user) {
                res.status(200).json({
                    message: 'Login successful',
                    user,
                    token: 'mock-jwt-token-xyz'
                });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error: any) {
            console.error('Login Error:', error);
            res.status(500).json({ message: 'Login failed', error: error.message });
        }
    }
}
