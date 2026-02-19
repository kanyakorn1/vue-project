const API_BASE_URL = import.meta.env.VITE_API_URL ? (import.meta.env.VITE_API_URL + '/api') : 'http://localhost:3000/api';

/**
 * Generic Fetch Wrapper
 */
async function request(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            const errorMsg = error.message || error.error || `HTTP error! Status: ${response.status}`;
            throw new Error(errorMsg);
        }

        // Return null for 204 No Content
        if (response.status === 204) return null;

        return await response.json();
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

export const api = {
    // Auth
    login: (credentials) => request('/login', { method: 'POST', body: JSON.stringify(credentials) }),
    verifyStaff: (data) => request('/verify-staff', { method: 'POST', body: JSON.stringify(data) }),
    updateProfile: (data) => request('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),

    // Tasks & Missions
    getTasks: (type, params = {}) => {
        let url = type ? `/missions?type=${type}` : '/missions';
        if (params.dept) {
            url += (url.includes('?') ? '&' : '?') + `dept=${encodeURIComponent(params.dept)}`;
        }
        if (params.projectId) {
            url += (url.includes('?') ? '&' : '?') + `projectId=${params.projectId}`;
        }
        if (params.assignee) {
            url += (url.includes('?') ? '&' : '?') + `assignee=${encodeURIComponent(params.assignee)}`;
        }
        if (params.staffName) {
            url += (url.includes('?') ? '&' : '?') + `staffName=${encodeURIComponent(params.staffName)}`;
        }
        if (params.staffId) {
            url += (url.includes('?') ? '&' : '?') + `staffId=${encodeURIComponent(params.staffId)}`;
        }
        if (params.editRequested) {
            url += (url.includes('?') ? '&' : '?') + `editRequested=true`;
        }
        if (params.status) {
            url += (url.includes('?') ? '&' : '?') + `status=${encodeURIComponent(params.status)}`;
        }
        return request(url);
    },
    getMissionById: (id) => request(`/missions/${id}`),
    createTask: (data) => request('/missions', { method: 'POST', body: JSON.stringify(data) }),
    updateTask: (id, data) => request(`/missions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTask: (id) => request(`/missions/${id}`, { method: 'DELETE' }),
    addComment: (id, text, sender, extra = {}) => request(`/missions/${id}/comment`, { method: 'POST', body: JSON.stringify({ text, sender, ...extra }) }),

    // Reports
    getReports: (params = {}) => {
        let url = '/reports';
        const query = new URLSearchParams();
        if (params.status) query.append('status', params.status);
        if (params.missionId) query.append('missionId', params.missionId);
        if (params.type) query.append('type', params.type);
        if (params.dept) query.append('dept', params.dept);
        if (params.submittedBy) query.append('submittedBy', params.submittedBy);
        if (params.role) query.append('role', params.role);
        if (query.toString()) url += `?${query.toString()}`;
        return request(url);
    },
    createReport: (data) => request('/reports', { method: 'POST', body: JSON.stringify(data) }),
    updateReport: (id, data) => request(`/reports/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    // Notifications
    getNotifications: (role, params = {}) => {
        let url = role ? `/notifications?role=${role}` : '/notifications';
        if (params.user) {
            url += (url.includes('?') ? '&' : '?') + `user=${encodeURIComponent(params.user)}`;
        }
        if (params.dept) {
            url += (url.includes('?') ? '&' : '?') + `dept=${encodeURIComponent(params.dept)}`;
        }
        return request(url);
    },
    ackNotification: (id) => request('/notifications/ack', { method: 'POST', body: JSON.stringify({ id }) }),

    // Team
    getTeam: (params = {}) => {
        let url = '/team';
        if (params.dept) url += `?dept=${encodeURIComponent(params.dept)}`;
        return request(url);
    },
    createTeamMember: (data) => request('/team', { method: 'POST', body: JSON.stringify(data) }),
    updateTeamMember: (staffId, data) => request(`/team/${encodeURIComponent(staffId)}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteTeamMember: (staffId) => request(`/team/${encodeURIComponent(staffId)}`, { method: 'DELETE' }),

    // Stats
    getStats: (params = {}) => {
        let url = '/stats';
        if (params.dept) url += `?dept=${encodeURIComponent(params.dept)}`;
        return request(url);
    },

    // Activatons
    getActivations: (params = {}) => {
        let url = '/activations';
        const query = new URLSearchParams();
        if (params.approverRole) query.append('approverRole', params.approverRole);
        if (query.toString()) url += `?${query.toString()}`;
        return request(url);
    },
    createActivation: (data) => request('/activations', { method: 'POST', body: JSON.stringify(data) }),
    updateActivation: (id, data) => request(`/activations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export default api;
