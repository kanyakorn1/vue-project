import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../App.vue') },
    { path: '/login', name: 'login', component: () => import('../App.vue') },

    // Lead Routes
    { path: '/lead/dashboard', component: () => import('../App.vue') },
    { path: '/lead/projects', component: () => import('../App.vue') },
    { path: '/lead/kanban', component: () => import('../App.vue') },
    { path: '/lead/Calendar', component: () => import('../App.vue') },
    { path: '/lead/team', alias: ['/lead/Team', '/lead/TEAM'], component: () => import('../App.vue') },
    { path: '/lead/reports', alias: ['/lead/Reports'], component: () => import('../App.vue') },

    // Manager Routes
    { path: '/manager/dashboard', component: () => import('../App.vue') },
    { path: '/manager/reports', component: () => import('../App.vue') },
    { path: '/manager/team', component: () => import('../App.vue') },
    { path: '/manager/timeline', component: () => import('../App.vue') },

    // PM Routes
    { path: '/pm/dashboard', component: () => import('../App.vue') },
    { path: '/pm/projects', component: () => import('../App.vue') },
    { path: '/pm/team', component: () => import('../App.vue') },
    { path: '/pm/reports', component: () => import('../App.vue') },
    { path: '/pm/timeline', component: () => import('../App.vue') },

    // Staff Routes
    { path: '/staff/dashboard', component: () => import('../App.vue') },
    { path: '/staff/timeline', component: () => import('../App.vue') },
    { path: '/staff/projects', component: () => import('../App.vue') },

    // Mission & Dept Routes
    { path: '/create-mission', name: 'create-mission', component: () => import('../App.vue') },
    { path: '/create-department', name: 'create-department', component: () => import('../App.vue') },

    // Fallback/Legacy
    { path: '/dashboard', redirect: '/' },
    { path: '/projects', redirect: '/' },
    { path: '/kanban', redirect: '/' },
    { path: '/timeline', redirect: '/' },
    { path: '/team', redirect: '/' },
    { path: '/reports', redirect: '/' },
    { path: '/missions', redirect: '/pm/projects' },
  ]
})

export default router