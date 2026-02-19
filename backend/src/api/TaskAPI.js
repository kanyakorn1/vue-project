// src/api/TaskAPI.js
/**
 * API Client สำหรับ Tasks
 * ทำหน้าที่เชื่อมต่อกับ Node.js Backend Server (http://localhost:3000)
 */

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * @typedef {object} Task
 * @property {string} _id
 * @property {string} name
 * @property {string} project
 * @property {string} assignee
 * @property {string} status ('todo', 'in_progress', 'review', 'done')
 * @property {string} priority ('High', 'Medium', 'Low')
 * @property {string} dueDate
 * @property {number} progress (0-100)
 */

/**
 * ดึงรายการ Tasks ทั้งหมดจาก Backend Server
 * Endpoint: GET /api/tasks
 * @returns {Promise<Task[]>}
 */
export async function getTasks() {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - Failed to fetch tasks.`);
        }

        return response.json();
    } catch (error) {
        console.error("API Fetch Error (GET /tasks):", error);
        throw new Error("Could not connect to the running backend server.");
    }
}

/**
 * สร้าง Task ใหม่
 * Endpoint: POST /api/tasks
 * @param {object} taskData - ข้อมูล Task ที่จะสร้าง (name, project, assignee, dueDate)
 * @returns {Promise<Task>}
 */
export async function createTask(taskData) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });

        if (response.status === 400) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || 'Invalid data provided.');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error("API Fetch Error (POST /tasks):", error);
        throw error;
    }
}