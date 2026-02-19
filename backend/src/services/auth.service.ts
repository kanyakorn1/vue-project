import { User, IUser } from '../schemas/user.schema.js';

export class AuthService {

    async register(data: { username: string, email: string, gender: string }): Promise<IUser> {
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const newUser = new User({
            username: data.username,
            email: data.email,
            gender: data.gender,
            password: 'password123', // Default for demo
            role: 'Employee',      // Default to Employee
            position: 'New Recruit',
            avatarUrl: `https://ui-avatars.com/api/?name=${data.username}&background=random`
        });

        return await newUser.save();
    }

    async login(email: string, role: string): Promise<IUser | null> {
        // For this demo, we will find by email. 
        // In a real app, verify password hash.
        const user = await User.findOne({ email });

        if (user) {
            // Check if role matches if strictly required, or update it
            if (user.role !== role) {
                // Determine if we should allow role switching or fail. 
                // For simplicity, let's just return the user found.
            }
            return user;
        } else {
            // Seed user if not found (Lazy Seeding for Demo Convenience)
            const newUser = new User({
                username: email.split('@')[0],
                email,
                password: 'password', // Default
                role,
                position: role === 'Manager' ? 'Project Manager' : 'Software Engineer',
                avatarUrl: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
            });
            return await newUser.save();
        }
    }
}
