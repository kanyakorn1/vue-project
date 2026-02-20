<template>
  <transition name="notification-slide">
    <div v-if="notification.show" 
         class="fixed top-10 right-10 z-[200] flex items-center gap-5 bg-[#121926] text-white p-6 rounded-[2.5rem] shadow-2xl border border-indigo-500/30 min-w-[380px]">
      <div class="w-12 h-12 bg-[#5c56f0] rounded-2xl flex items-center justify-center text-xl animate-bounce shadow-lg shadow-indigo-500/20">
        <i class="fas fa-bell"></i>
      </div>
      <div class="text-left">
        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">ประกาศจากระบบ</p>
        <p class="text-sm font-bold mt-1 text-slate-100 leading-tight">{{ notification.message }}</p>
      </div>
      <button @click="notification.show = false" class="ml-auto w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
        <i class="fas fa-times text-slate-500 text-xs"></i>
      </button>
    </div>
  </transition>

  <SignInView v-if="!isLoggedIn" @login-success="handleLoginSuccess" />

  <div v-else class="relative flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
    <!-- Overlay for mobile sidebar -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"></div>
    <transition name="fade">
      <div v-if="showSetup" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6 text-center text-left">
        <div class="bg-white w-full max-w-[480px] rounded-[3.5rem] p-12 shadow-2xl animate-pop text-left">
          <div class="bg-amber-100 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 text-amber-600">
            <i class="fas fa-building text-4xl"></i>
          </div>
          <h2 class="text-3xl font-black text-slate-800 tracking-tighter mb-2 italic uppercase text-center">ระบุชื่อทีมของคุณ</h2>
          <p class="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-10 leading-relaxed text-center">
            หากมีแผนกอยู่แล้วจะนำท่านเข้าสู่ระบบทันที <br> หากยังไม่มีระบบจะทำการสร้างแผนกใหม่ให้ท่าน
          </p>
          <div class="space-y-6 text-left">
            <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-widest">ชื่อแผนกหรือทีม</label>
            <input v-model="departmentName" type="text" placeholder="เช่น IT, HR, Marketing..." class="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold text-slate-800 outline-none focus:border-indigo-500/30 transition-all text-center shadow-inner">
            <button @click="finishSetup" class="w-full py-6 bg-[#5c56f0] text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.15em] hover:bg-indigo-600 shadow-xl shadow-indigo-200 active:scale-95 transition-all">
              ดำเนินการต่อ <i class="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <aside v-if="isLoggedIn" 
      :class="['fixed lg:relative lg:flex flex-col w-64 h-full bg-white border-r border-slate-100 p-6 shrink-0 z-50 transition-transform duration-300 shadow-xl lg:shadow-sm text-left', 
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
      <div class="flex items-center justify-between mb-6 shrink-0 text-left">
        <div class="flex items-center gap-3">
          <div class="bg-[#5c56f0] p-2.5 rounded-xl text-white shadow-xl shadow-indigo-100">
            <i class="fas fa-cube text-xl"></i>
          </div>
          <div class="flex flex-col text-left">
            <span class="font-black text-2xl tracking-tighter text-slate-800 uppercase leading-none">CORP-X</span>
            <span class="text-[9px] text-indigo-500 font-bold uppercase tracking-[0.2em] mt-1.5 italic text-left">
              {{ userRole === 'staff' ? 'Staff v1.0' : 'Admin v5.2' }}
            </span>
          </div>
        </div>
        <!-- Close button mobile -->
        <button @click="isSidebarOpen = false" class="lg:hidden w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <nav class="space-y-2 flex-grow overflow-y-auto scrollbar-hide text-left">

        <button v-for="item in menuItems" :key="item.id" @click="handleTabChange(item.id)"
          :class="['w-full flex items-center gap-5 px-6 py-5 rounded-[1.8rem] transition-all text-sm font-black border text-left', 
          activeTab === item.id ? 'bg-[#121926] text-white border-[#121926] shadow-2xl' : 'text-slate-400 hover:bg-slate-50 border-transparent']">
          <i :class="[item.icon, activeTab === item.id ? 'text-indigo-400' : 'text-slate-300', 'text-lg w-6 text-center']"></i>
          <span>{{ item.label }}</span>
        </button>
      </nav>
      <div class="mt-4 pt-8 border-t border-slate-50 text-left">
        <button @click="handleLogout" class="w-full flex items-center gap-5 px-6 py-4 rounded-2xl text-slate-400 hover:text-rose-600 transition-all text-xs font-black uppercase tracking-widest text-left">
          <i class="fas fa-power-off"></i><span>ออกจากระบบ</span>
        </button>
      </div>
    </aside>

    <div id="modal-target" class="flex-1 flex flex-col min-w-0 overflow-hidden text-left relative">
      <header class="bg-white/80 backdrop-blur-md border-b border-slate-50 px-4 lg:px-10 shrink-0 z-20 flex justify-between items-center h-16 lg:h-20">
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Button -->
          <button @click="isSidebarOpen = true" class="lg:hidden w-12 h-12 rounded-2xl bg-[#121926] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all">
            <i class="fas fa-bars"></i>
          </button>
          
          <div class="flex flex-col text-left">
            <h1 class="text-xl lg:text-3xl font-black text-slate-900 tracking-tighter capitalize leading-none">{{ pageTitle }}</h1>
            <p class="text-[8px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 lg:mt-2">
              {{ userRole === 'staff' ? 'ศูนย์ปฏิบัติการส่วนบุคคล (Staff Hub)' : (userRole === 'pm' ? 'สถานะ: ผู้จัดการโครงการ (Project Manager)' : (userRole === 'manager' ? 'สถานะ: ผู้จัดการทั่วไป (General Manager)' : `บทบาท: หัวหน้ายุทธศาสตร์ (${departmentName || 'HR'})`)) }}
            </p>
          </div>
        </div>
        <div @click="openProfileModal" class="flex items-center gap-4 bg-white pl-3 pr-6 py-3 rounded-[2rem] border border-slate-100 shadow-sm text-left cursor-pointer hover:bg-slate-50 transition-all">
          <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`" class="w-12 h-12 rounded-2xl bg-slate-900 p-1">
          <div class="flex flex-col leading-none text-left">
            <span class="text-[13px] font-black text-slate-800">{{ userName || userEmail }}</span>
            <span class="text-[9px] font-black text-indigo-500 uppercase mt-1.5 tracking-tighter italic hover:text-indigo-600 transition-colors">
              {{ userPosition ? `หน้าที่: ${userPosition}` : 'Verified Identity' }}
            </span>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-4 lg:p-10 bg-[#f8fafc] custom-scrollbar">
        <div :class="[activeTab === 'kanban' ? 'w-full' : 'max-w-[1600px] mx-auto', 'text-left']">
          <transition name="page-fade" mode="out-in">
            <component 
              :is="currentView" 
              :all-staff="teamMembers"
              :dept-name="departmentName"
              :user-email="userEmail"
              :user-name="userName"
              :user-role="userRole"
              :projects="['team', 'dashboard'].includes(activeTab) ? allMissions : (activeTab === 'kanban' ? kanbanTasks : projects)"
              :selected-project="selectedProject"
              :editing-report="activeTab === 'submit-work' ? activeWorkSubmission : editingReport"
              :refresh-trigger="refreshTrigger"
              :target-task-id="targetTaskId"
              @add-staff="addNewStaff"
              @add-project="addNewProject"
              @delete-project="removeProject"
              @update-project="handleUpdateProject"
              @edit-report="handleEditReport"
              @go-to-report="activeTab = 'report'"
              @notify="triggerNotification" 
              @refresh="fetchMissions"
              @refresh-team="fetchTeam"
              @change-tab="(tab, data) => { 
                activeTab = tab; 
                if (tab === 'submit-work') activeWorkSubmission = data; 
              }"
              @go-to-task="(obj) => {
                targetTaskId = obj.targetTaskId;
                selectedProject = {
                  id: obj.id,
                  title: obj.title,
                  description: '', // dummy
                  deadline: new Date().toISOString(), // dummy
                  status: 'active'
                };
              }"
               @card-click="handleCardClick"
              @go-back="handleGoBack"
            />
          </transition>
        </div>
      </main>
    </div>

    <!-- 👤 Profile Edit Modal -->
    <transition name="page-fade">
      <div v-if="showProfileModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
        <div class="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative text-left animate-pop m-auto">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl p-1 relative overflow-hidden">
               <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`" class="w-full h-full rounded-xl">
            </div>
            <div>
              <h3 class="text-2xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">แก้ไขโปรไฟล์</h3>
              <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 ml-0.5">จัดการข้อมูลส่วนตัวของคุณ</p>
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="space-y-1">
              <label class="text-[10px] font-black text-slate-300 uppercase ml-4 tracking-widest">รหัสพนักงาน (ID)</label>
              <div class="w-full px-6 py-3 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-xs text-slate-400 cursor-not-allowed">
                {{ userEmail }}
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">ชื่อ-นามสกุล</label>
              <input v-model="profileForm.name" type="text" placeholder="ระบุชื่อจริงของคุณ" class="w-full px-6 py-3 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-sm outline-none focus:border-indigo-500/30 transition-all">
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">ตำแหน่ง / หน้าที่</label>
              <input v-model="profileForm.position" type="text" placeholder="ระบุหน้าที่" class="w-full px-6 py-3 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-sm outline-none focus:border-indigo-500/30 transition-all">
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">เปลี่ยนรหัสผ่านใหม่</label>
              <input v-model="profileForm.password" type="password" placeholder="••••••" class="w-full px-6 py-3 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-sm outline-none focus:border-indigo-500/30 transition-all">
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-black text-indigo-500 uppercase ml-4 tracking-widest flex items-center gap-2">
                <i class="fas fa-link"></i> ลิงก์เว็บไซต์จริง (URL)
              </label>
              <input v-model="profileForm.profile_url" type="url" placeholder="https://..." class="w-full px-6 py-3 bg-slate-50 border border-indigo-100 rounded-[1.5rem] font-bold text-sm outline-none focus:border-indigo-400 text-indigo-600 transition-all">
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button @click="handleUpdateProfile" class="flex-1 py-3 bg-[#0f172a] text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 hover:bg-emerald-500 active:scale-95 transition-all">
              บันทึกข้อมูล
            </button>
            <button @click="showProfileModal = false" class="flex-1 py-3 bg-slate-100 text-slate-400 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// --- Import Components ---
import DashboardHome from './lead/DashboardHome.vue'
import Dashboardpm from './pm/Dashboard.vue'
import DashboardStaff from './staff/DashboardStaff.vue' 
import DashboardManager from './manager/DashboardManager.vue' 
import ProjectsView from './lead/ProjectsView.vue'   
import ProjectsViewpm from './pm/Missions.vue'
import ProjectDetailLead from './lead/ProjectDetailLead.vue'
import ProjectDetailpm from './pm/ProjectDetailpm.vue' 
import KanbanView from './lead/KanbanView.vue'
import KanbanViewpm from './pm/Kanban.vue'
import TeamView from './lead/TeamView.vue'
import TeamViewpm from './pm/Team.vue'
import CreateMissionpm from './pm/CreateMission.vue'
import SignInView from './lead/Login.vue'
import ReportForm from './lead/ReportForm.vue'
import ReportIssuepm from './pm/Reports.vue'
import CalendarLead from './lead/Calendar.vue'
import Calendarpm from './pm/Calendar.vue'

import TimelineViewManager from './manager/TimelineView.vue'
import TimelineViewLead from './lead/TimelineView.vue'
import TimelineViewPM from './pm/TimelineView.vue'
import TimelineViewStaff from './staff/TimelineView.vue'
import ReportViewManager from './manager/ReportViewManager.vue'
import SubmitWorkForm from './staff/SubmitWorkForm.vue'


// --- State Management ---
const isSidebarOpen = ref(false)
const activeTab = ref('dashboard')
const isLoggedIn = ref(false)
const showSetup = ref(false)
const showProfileModal = ref(false)
const userRole = ref('') 
const userEmail = ref('')
const userName = ref('')
const userPosition = ref('')
const userId = ref(null)
const profileForm = reactive({
  name: '',
  password: '',
  position: '',
  profile_url: ''
})
const departmentName = ref('')
const route = useRoute()
const router = useRouter()
const selectedProject = ref(null)
const targetTaskId = ref(null)
const projects = ref([])
const kanbanTasks = ref([])
const allMissions = ref([])
const activeWorkSubmission = ref(null)
// 🎯 สถานะสำหรับแก้ไขรายงาน
const editingReport = ref(null)

// 🎯 เพิ่มสถานะ Global Notification
const notification = reactive({
  show: false,
  message: ''
})

const teamMembers = ref([]);
const refreshTrigger = ref(0) // 🎯 Global Refresh Signal

import api from '@/api'

let pollInterval = null

// Load initial data
onMounted(async () => {
  // 1. Restore Login State
  const savedEmail = localStorage.getItem('userEmail')
  const savedRole = localStorage.getItem('userRole')
  const savedDept = localStorage.getItem('deptName')
  
  if (savedEmail && savedRole) {
    userEmail.value = savedEmail
    userRole.value = savedRole
    userId.value = localStorage.getItem('userId')
    userName.value = localStorage.getItem('userName') || ''
    userPosition.value = localStorage.getItem('userPosition') || ''
    departmentName.value = savedDept || ''
    isLoggedIn.value = true
    
    // 2. Sync Route with Active Tab
    syncRouteWithTab()
  }

  await Promise.all([
    fetchMissions(),
    fetchTeam()
  ])
  pollInterval = setInterval(pollNotifications, 3000)

  // 🎯 Listen for date input changes globally to toggle 'has-value' class
  // This is needed because CSS [value=""] doesn't sync with property changes in Vue
  document.addEventListener('input', (e) => {
    if (e.target && e.target.type === 'date') {
      if (e.target.value) e.target.classList.add('has-value')
      else e.target.classList.remove('has-value')
    }
  }, true)
  
  // Initial check for existing date inputs
  setTimeout(() => {
    document.querySelectorAll('input[type="date"]').forEach(el => {
      if (el.value) el.classList.add('has-value')
    })
  }, 500)
})

// 🎯 Helper: Get Canonical Dept Name for broader search
const getDeptCanonicalName = (name) => {
    const n = (name || '').toLowerCase().trim();
    if (n === 'it' || n === 'information technology') return 'IT';
    if (n === 'hr' || n === 'human resources') return 'HR';
    if (n === 'ds' || n === 'design' || n === 'creative design') return 'DS';
    if (n === 'mk' || n === 'marketing' || n === 'sales' || n.includes('marketing')) return 'MK';
    return name;
};

const fetchTeam = async () => {
  try {
    const params = {}
    if (userRole.value !== 'manager' && departmentName.value) {
      params.dept = getDeptCanonicalName(departmentName.value)
    }
    const data = await api.getTeam(params)
    if (data) teamMembers.value = data
  } catch (e) {
      console.error("Failed to fetch team", e)
  }
}

const syncRouteWithTab = () => {
  const path = route.path.toLowerCase()
  
  // 1. Detect Role from Path
  if (path.startsWith('/lead/')) userRole.value = 'lead'
  else if (path.startsWith('/manager/')) userRole.value = 'manager'
  else if (path.startsWith('/pm/')) userRole.value = 'pm'
  else if (path.startsWith('/staff/')) userRole.value = 'staff'

  // 2. Detect Tab from Path
  if (path.includes('/dashboard')) activeTab.value = 'dashboard'
  else if (path.includes('/projects')) activeTab.value = 'projects'
  else if (path.includes('/kanban')) activeTab.value = 'kanban'
  else if (path.includes('/calendar') || path.includes('/timeline')) activeTab.value = 'timeline'
  else if (path.includes('/team')) activeTab.value = 'team'
  else if (path.includes('/reports')) activeTab.value = 'report'
  else if (path.includes('/create-mission')) activeTab.value = 'create-mission'
  else {
    activeTab.value = 'dashboard'
  }
}

// Watch for route changes (e.g. user typing in URL bar)
watch(() => route.path, () => {
  if (isLoggedIn.value) syncRouteWithTab()
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})

const fetchMissions = async () => {
  try {
    const params = {}
    if (userRole.value !== 'manager' && departmentName.value) {
      params.dept = getDeptCanonicalName(departmentName.value)
    }
    // Add User Info for filtering projects by participation
    if (userRole.value === 'staff') {
        params.staffId = userEmail.value
        params.assignee = userName.value
    }

    const [pData, kData, aData] = await Promise.all([
        api.getTasks('project', params),
        api.getTasks('urgent', params),
        api.getTasks(null, params)
    ])
    if (pData) {
        projects.value = pData
        // 🎯 Re-sync selected project metadata to reflect server-side auto-updates (like auto-completion)
        if (selectedProject.value) {
            const fresh = pData.find(p => String(p.id) === String(selectedProject.value.id));
            if (fresh) {
                selectedProject.value = fresh;
            }
        }
    }
    if (kData) kanbanTasks.value = kData
    if (aData) allMissions.value = aData
  } catch (e) {
    console.error("Failed to fetch missions", e)
  }
}

const pollNotifications = async () => {
    if (!isLoggedIn.value) return
    
    try {
        const notis = await api.getNotifications(userRole.value, { 
            user: localStorage.getItem('userName'),
            dept: departmentName.value || localStorage.getItem('deptName')
        })
        if (notis && notis.length > 0) {
            // Show first notification
            triggerNotification(notis[0].message)
            
            // Ack the notification so it doesn't show again
            await api.ackNotification(notis[0].id)
            
            // Refresh missions/data to reflect updates
            await Promise.all([
                fetchMissions(),
                fetchTeam()
            ])
            
            // 🎯 Trigger refresh in child components (Dashboards)
            refreshTrigger.value++
        }
    } catch (e) {
        console.error("Polling error", e)
    }
}

// --- 🎯 Logic การเลือก View ตาม Role และ Tab ---
const currentView = computed(() => {
  // Common Views mapping
  if (selectedProject.value) {
    if (userRole.value === 'pm') return ProjectDetailpm
    return ProjectDetailLead
  }
  
  // Dashboard Mapping
  if (activeTab.value === 'dashboard') {
    if (userRole.value === 'staff') return DashboardStaff
    if (userRole.value === 'manager') return DashboardManager
    if (userRole.value === 'pm') return DashboardHome
    return DashboardHome
  }
  
  // Projects Mapping
  if (activeTab.value === 'projects') {
    if (userRole.value === 'pm') return ProjectsViewpm
    return ProjectsView
  }
  
  // Team Mapping
  if (activeTab.value === 'team') {
    return TeamView
  }
  
  // Report Mapping
  if (activeTab.value === 'report') {
    if (userRole.value === 'pm') return ReportIssuepm
    if (userRole.value === 'manager') return ReportViewManager
    return ReportForm
  }
  
  if (activeTab.value === 'timeline') {
    if (userRole.value === 'staff') return TimelineViewStaff
    if (userRole.value === 'pm') return TimelineViewPM
    if (userRole.value === 'lead') return TimelineViewLead
    return TimelineViewManager
  }

  // Create Mission Mapping
  if (activeTab.value === 'create-mission') return CreateMissionpm

  if (activeTab.value === 'submit-work') return SubmitWorkForm

  // Status Mapping

  // Fallback / Other tabs
  if (activeTab.value === 'kanban') {
    if (userRole.value === 'pm') return KanbanViewpm
    return KanbanView
  }

  // FALLBACK: Return Dashboard or Null to prevent random rendering
  console.warn(`[APP] No view found for tab: ${activeTab.value}, role: ${userRole.value}`)
  return DashboardHome 
})

const pageTitle = computed(() => {
  if (userRole.value === 'staff' && activeTab.value === 'dashboard') return 'ภารกิจของฉัน'
  if (selectedProject.value) return selectedProject.value.title || 'ภารกิจยุทธศาสตร์'
  const titles = { 
    dashboard: 'หน้าหลัก', projects: 'แผนงาน', kanban: 'งานแทรก', timeline: 'ไทม์ไลน์',
    team: 'ทีมพนักงาน', 
    report: userRole.value === 'pm' ? 'รายงานปัญหา' : 'ส่งรายงานสรุปผล',
    'submit-work': 'ส่งมอบงานภารกิจ'
  }
  return titles[activeTab.value]
})

const menuItems = computed(() => [
  { id: 'dashboard', label: 'หน้าแรก', icon: 'fas fa-chart-line' },
  { id: 'projects', label: 'โครงการ', icon: 'fas fa-rocket' },
  { id: 'kanban', label: 'งานแทรก', icon: 'fas fa-bolt' },
  { id: 'timeline', label: 'ไทม์ไลน์', icon: 'fas fa-stream' },
  { id: 'team', label: 'ทีมพนักงาน', icon: 'fas fa-users' },
  { id: 'report', label: userRole.value === 'manager' ? 'ดูรายงาน' : 'ส่งรายงาน', icon: 'fas fa-file-signature' },
].filter(item => {
  if (userRole.value === 'manager' && item.id === 'kanban') return false
  return true
}))

// --- 🎯 Functions ---
const handleGoBack = () => {
  selectedProject.value = null;
  targetTaskId.value = null;
  if (activeTab.value === 'submit-work') {
    activeTab.value = 'dashboard';
  }
};

const handleCardClick = (item) => {
  console.log('[APP] Handle Card Click:', item);
  targetTaskId.value = null; // Reset
  
  if (item.projectId) {
    // If it's a task/edit request, reconstruct project and target the task
    targetTaskId.value = item.id || item._id;
    selectedProject.value = {
      id: item.projectId,
      title: item.projectTitle || 'โครงการที่เกี่ยวข้อง',
      description: item.projectDesc || item.projectDescription || '',
      deadline: item.projectDeadline,
      status: item.projectStatus || 'active',
      dept: item.dept
    };
  } else {
    // It's a project card
    selectedProject.value = item;
  }
};

const triggerNotification = (msg) => {
  if (typeof msg === 'object' && msg !== null) {
    notification.message = msg.message || JSON.stringify(msg)
  } else {
    notification.message = msg
  }
  notification.show = true
  // หายไปเองหลัง 4 วินาที
  setTimeout(() => {
    notification.show = false
  }, 4000)
}

const handleLoginSuccess = (userData) => {
  isLoggedIn.value = true
  const email = userData.email
  userEmail.value = email
  userName.value = userData.userName
  userRole.value = userData.userRole 
  userId.value = userData.id
  
  // Setup logic: Only show for 'lead' role if dept is missing
  if (userRole.value === 'lead') {
      showSetup.value = !userData.userDept && !localStorage.getItem('deptName');
  } else {
      showSetup.value = false;
  }

  // Persist
  localStorage.setItem('userEmail', userEmail.value)
  localStorage.setItem('userId', userId.value || '')
  localStorage.setItem('userRole', userRole.value)
  localStorage.setItem('userName', userData.userName || '')
  localStorage.setItem('userPosition', userData.position || '')
  localStorage.setItem('deptName', userData.userDept || '')
  departmentName.value = userData.userDept || ''
  userPosition.value = userData.position || ''
  
  // Redirect to Role Dashboard
  let path = `/${userRole.value}/dashboard`
  if (userRole.value === 'lead') path = '/lead/dashboard'
  if (userRole.value === 'pm') path = '/pm/dashboard'
  if (userRole.value === 'manager') path = '/manager/dashboard'
  if (userRole.value === 'staff') path = '/staff/dashboard'
  
  router.push(path)
}

const handleTabChange = (tabId) => {
  activeTab.value = tabId
  isSidebarOpen.value = false // Close on click mobile
  selectedProject.value = null
  if (tabId !== 'report') editingReport.value = null

  // Update Dynamic URL based on Role
  let subPath = tabId
  if (tabId === 'dashboard') subPath = 'dashboard'
  if (tabId === 'report') subPath = 'reports'
  if (tabId === 'create-mission') subPath = 'create-mission'
  if (tabId === 'timeline' && userRole.value === 'lead') subPath = 'Calendar'
  if (tabId === 'submit-work') subPath = 'submit-work'

  router.push(`/${userRole.value}/${subPath}`)
  
  if (tabId === 'report') {
    refreshTrigger.value++
  }
}

const handleEditReport = (report) => {
  editingReport.value = report
  activeTab.value = 'report'
}

const handleLogout = () => {
  isLoggedIn.value = false; 
  userRole.value = ''; 
  activeTab.value = 'dashboard'; 
  selectedProject.value = null
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userId')
  localStorage.removeItem('userRole')
  localStorage.removeItem('deptName')
  router.push('/login')
}

const finishSetup = () => { 
  if (departmentName.value) {
    showSetup.value = false
    localStorage.setItem('deptName', departmentName.value)
  }
}
const addNewStaff = async (data) => {
  console.log('[APP] Generating new staff entry:', data)
  try {
     const newStaff = await api.createTeamMember(data)
     if (newStaff) {
       await fetchTeam()
       triggerNotification(`สร้างรหัสผ่านสำหรับ ${data.staffId} เรียบร้อยแล้ว`)
     }
  } catch (e) {
     console.error("Failed to add staff", e)
     alert("Adding staff failed")
  }
}

const openProfileModal = () => {
  profileForm.name = userName.value
  profileForm.position = userPosition.value
  profileForm.profile_url = localStorage.getItem('userProfileUrl') || ''
  profileForm.password = ''
  showProfileModal.value = true
}

const handleUpdateProfile = async () => {
  if (!userId.value && !userEmail.value) {
    alert('ระบบไม่พบข้อมูลตัวตนของคุณในเซสชันนี้ กรุณาลอง Logout และ Login เข้ามาใหม่อีกครั้งครับ')
    return
  }

  const payload = {
    id: userId.value,
    username: userEmail.value,
    name: profileForm.name,
    position: profileForm.position,
    profile_url: profileForm.profile_url
  }
  if (profileForm.password) {
    payload.password = profileForm.password
  }

  console.log('[PROFILE] Attempting Update:', payload)

  try {
    const res = await api.updateProfile(payload)
    
    if (res && res.success) {
      userName.value = profileForm.name
      userPosition.value = profileForm.position
      localStorage.setItem('userName', profileForm.name)
      localStorage.setItem('userPosition', profileForm.position)
      localStorage.setItem('userProfileUrl', profileForm.profile_url)
      
      triggerNotification('อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้ว')
      showProfileModal.value = false
      
      // Refresh team data so changes show up in Team View cards immediately
      fetchTeam()
    }
  } catch (e) {
    console.error('[PROFILE] API Fail:', e)
    alert(`การอัปเดตขัดข้อง: ${e.message || 'Server Error'}`)
  }
}

const addNewProject = async (project) => {
  try {
    // 1. Map fields to match Server Schema
    const payload = {
      ...project,
      description: project.desc || project.description,
      dept: project.dept || departmentName.value,
      type: activeTab.value === 'kanban' ? 'urgent' : (project.type || 'project')
    }

    console.log('[APP] Deploying Project Payload:', payload)
    const savedProject = await api.createTask(payload)
    console.log('[APP] Saved Project Response:', savedProject)
    if (savedProject) {
      await fetchMissions()
      triggerNotification('เริ่มดำเนินการแผนงานเรียบร้อยแล้ว!')
    }
  } catch (e) {
    console.error("Error creating mission", e)
    alert("ระบบขัดข้อง กรุณาลองใหม่: " + e.message)
  }
}

const removeProject = async (id) => {
  try {
    await api.deleteTask(id)
    triggerNotification('ยกเลิกภารกิจเรียบร้อยแล้ว')
    await fetchMissions()
  } catch (e) {
    console.error("Error deleting mission", e)
    alert("ลบภารกิจล้มเหลว")
  }
}

const handleUpdateProject = async (id, data) => {
  try {
    await api.updateTask(id, data)
    triggerNotification('อัปเดตข้อมูลแผนงานเรียบร้อยแล้ว')
    await fetchMissions()
  } catch (e) {
    console.error("Error updating mission", e)
  }
}
</script>

<style>
/* 🎯 Animation สำหรับ Notification Slide */
.notification-slide-enter-active, .notification-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
.notification-slide-enter-from { opacity: 0; transform: translateX(100px); }
.notification-slide-leave-to { opacity: 0; transform: scale(0.9) translateY(-20px); }

/* สไตล์เดิม */
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes pop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-pop { animation: pop 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67); }
.page-fade-enter-active, .page-fade-leave-active { transition: all 0.3s ease; }
.page-fade-enter-from { opacity: 0; transform: translateY(10px); }
.page-fade-leave-to { opacity: 0; transform: translateY(-10px); }
.scrollbar-hide::-webkit-scrollbar { display: none; }

h1, h2, span, p, button, input { font-family: 'LINE Seed Sans TH', sans-serif; }

/* Custom Date Input Placeholder Fix */
input[type="date"] {
  position: relative;
  display: flex !important;
  align-items: center !important;
  padding-right: 2.5rem !important; /* เพิ่มพื้นที่ด้านขวาให้มากขึ้น */
  overflow: visible !important;
}

/* ปรับตำแหน่งไอคอนปฏิทินให้เข้ามาอยู่ในกรอบ */
input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 1.5rem; /* บังคับให้อยู่ห่างจากขอบขวา 1.5rem */
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 10;
  margin: 0;
}

/* Hide native segments (วว/มม/ปปปป) completely when empty */
input[type="date"]:not(.has-value)::-webkit-datetime-edit,
input[type="date"]:not(.has-value)::-webkit-datetime-edit-fields-wrapper,
input[type="date"]:not(.has-value)::-webkit-datetime-edit-text,
input[type="date"]:not(.has-value)::-webkit-datetime-edit-month-field,
input[type="date"]:not(.has-value)::-webkit-datetime-edit-day-field,
input[type="date"]:not(.has-value)::-webkit-datetime-edit-year-field {
  opacity: 0 !important;
  color: transparent !important;
}

/* Show native segments only when a value exists */
input[type="date"].has-value::-webkit-datetime-edit {
  opacity: 1 !important;
  color: inherit !important;
}

/* Placeholder Styling */
input[type="date"]::before {
  content: "วัน / เดือน / ปี" !important;
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: #cbd5e1;
  pointer-events: none;
  font-weight: bold;
  font-size: 0.9em;
  opacity: 1;
  z-index: 5;
  letter-spacing: -0.02em;
}

/* Hide custom placeholder when value exists */
input[type="date"].has-value::before {
  opacity: 0 !important;
  display: none !important;
}
</style>
