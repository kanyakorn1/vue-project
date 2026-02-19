<template>
  <div class="min-h-full flex flex-col gap-6 animate-fade-up pb-10">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
      <div>
        <h2 class="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-relaxed">Mission Control</h2>
        <p class="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
            {{ currentUser.statusText || 'STATUS CHECK: ALL SYSTEMS NORMAL' }}
        </p>
      </div>
    
       <div class="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-slate-100">
        <div class="bg-indigo-100 p-2 rounded-xl">
           <img :src="`https://api.dicebear.com/9.x/avataaars/svg?seed=${currentUser.name || 'User'}`" class="w-8 h-8 rounded-lg" />
        </div>
        <div>
           <p class="text-xs font-black text-slate-800">{{ currentUser.name || 'Guest' }}</p>
           <p class="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
               {{ currentUser.role || 'Offline' }}
               <span v-if="currentUser.department" class="text-slate-400"> | {{ currentUser.department }}</span>
           </p>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <div class="bg-gradient-to-br from-indigo-600 to-violet-800 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-300 relative overflow-hidden group hover:-translate-y-1 transition-transform"
             style="background: linear-gradient(135deg, #4f46e5 0%, #5b21b6 100%);">
            <div class="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-700"></div>
            <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <i class="fas fa-layer-group text-2xl"></i>
                    </div>
                    <span class="bg-white/20 px-2 py-1 rounded-lg text-[10px] font-bold backdrop-blur-sm">+12%</span>
                </div>
                <h3 class="text-4xl font-black mb-1">{{ stats.activeMissions }}</h3>
                <p class="text-[10px] font-bold uppercase tracking-widest opacity-80">Active Missions</p>
            </div>
        </div>

        <div class="bg-white rounded-[2rem] p-6 text-slate-800 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-lg transition-all">
             <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <i class="fas fa-check-circle text-2xl"></i>
                    </div>
                </div>
                <h3 class="text-4xl font-black mb-1">{{ stats.completedMissions }}</h3>
                <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Completed Tasks</p>
            </div>
        </div>

        <div class="bg-white rounded-[2rem] p-6 text-slate-800 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-lg transition-all">
             <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                        <i class="fas fa-clock text-2xl"></i>
                    </div>
                </div>
                <h3 class="text-4xl font-black mb-1">{{ stats.timeTracked }}h</h3>
                <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Time Tracked</p>
            </div>
        </div>

         <div class="bg-white rounded-[2rem] p-6 text-slate-800 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-lg transition-all">
             <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                        <i class="fas fa-bug text-2xl"></i>
                    </div>
                    <span class="bg-rose-50 text-rose-600 px-2 py-1 rounded-lg text-[10px] font-bold">-2</span>
                </div>
                <h3 class="text-4xl font-black mb-1">{{ stats.pendingIssues }}</h3>
                <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pending Issues</p>
            </div>
        </div>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <!-- Chart Section -->
        <!-- Incoming Reports Section -->
        <div class="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 flex flex-col relative overflow-hidden">
             <div class="flex justify-between items-center mb-6">
                 <div>
                    <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight">รายงานล่าสุด</h3>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Incoming Reports</p>
                 </div>
             </div>
             
             <!-- List of Reports -->
             <div class="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 max-h-[320px]">
                
                <div v-if="recentReports.length === 0" class="flex flex-col items-center justify-center h-40 text-slate-300">
                    <i class="fas fa-inbox text-4xl mb-2"></i>
                    <p class="text-xs font-bold uppercase tracking-widest">ไม่มีรายงานใหม่</p>
                </div>

                <div v-for="report in recentReports" :key="report.id" class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                    <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 overflow-hidden">
                         <img v-if="report.submittedBy" :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${report.submittedBy}`" class="w-full h-full object-cover">
                         <i v-else class="fas fa-file-alt"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start">
                            <h4 class="text-xs font-black text-slate-800 truncate pr-2 group-hover:text-indigo-600 transition-colors">{{ report.title }}</h4>
                            <span class="text-[9px] font-bold text-slate-400 shrink-0">{{ formatDate(report.date) }}</span>
                        </div>
                        <p class="text-[10px] text-slate-500 font-bold truncate mt-0.5">
                            <span class="text-indigo-500 uppercase tracking-wider">{{ report.submittedBy || 'Unknown' }}</span> 
                            <span class="text-slate-300 mx-1">•</span> 
                            {{ report.type || 'Report' }}
                        </p>
                    </div>
                </div>

             </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col shadow-2xl relative overflow-hidden">
             <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

             <h3 class="text-lg font-black uppercase tracking-tight mb-6 relative z-10">Live Feed</h3>
             <div class="space-y-6 overflow-y-auto custom-scrollbar pr-2 relative z-10 flex-1">
                 <div class="flex gap-4 items-start group">
                     <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 group-hover:border-indigo-500 transition-colors">
                         <i class="fas fa-code text-indigo-400"></i>
                     </div>
                     <div>
                         <p class="text-xs font-bold leading-relaxed"><span class="text-indigo-400">Agent X</span> pushed code to <span class="bg-slate-800 px-1 rounded text-[10px]">production</span></p>
                         <p class="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">2 mins ago</p>
                     </div>
                 </div>

                 <div class="flex gap-4 items-start group">
                     <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 group-hover:border-emerald-500 transition-colors">
                         <i class="fas fa-check text-emerald-400"></i>
                     </div>
                     <div>
                         <p class="text-xs font-bold leading-relaxed"><span class="text-emerald-400">System</span> backup completed successfully</p>
                         <p class="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">1 hour ago</p>
                     </div>
                 </div>

                 <div class="flex gap-4 items-start group">
                     <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 group-hover:border-rose-500 transition-colors">
                         <i class="fas fa-exclamation-triangle text-rose-400"></i>
                     </div>
                     <div>
                         <p class="text-xs font-bold leading-relaxed"><span class="text-rose-400">Alert</span> CPU usage exceeded 90%</p>
                         <p class="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">3 hours ago</p>
                     </div>
                 </div>
             </div>

             <button class="mt-4 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors backdrop-blur-sm">
                 View All Logs
             </button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '@/api';
import { formatDate } from '@/utils/date';

const props = defineProps(['deptName', 'refreshTrigger'])
const currentUser = ref({ name: 'Guest', role: 'Viewer', statusText: 'System Ready', department: '' })
const stats = ref({ activeMissions: 0, completedMissions: 0, timeTracked: 45, pendingIssues: 0 })
const recentReports = ref([])

const fetchPMStats = async (dept) => {
    try {
        const [statsData, reports] = await Promise.all([
            api.getStats({ dept }),
            api.getReports({ dept })
        ])

        if (statsData) {
            stats.value = {
                activeMissions: statsData.activeMissions,
                completedMissions: statsData.completedMissions,
                timeTracked: statsData.timeTracked,
                pendingIssues: statsData.pendingIssues
            }
        }
        
        if (reports) {
            // Sort by date desc
            recentReports.value = reports.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)
        }
    } catch (e) {
        console.error('Failed to fetch data', e)
    }
}

watch(() => props.refreshTrigger, () => {
    fetchPMStats(currentUser.value.department)
})

onMounted(async () => {
    // Load data from storage
    const role = localStorage.getItem('userRole') || 'staff'
    const name = localStorage.getItem('userName') || 'Unknown Agent'
    const dept = props.deptName || localStorage.getItem('deptName') || ''
    
    // Set Status Text
    let status = 'OPERATIONAL'
    if (role === 'manager') status = 'STRATEGIC COMMAND CENTER ACTIVE'
    else if (role === 'lead') status = 'TEAM OPERATIONS OVERVIEW'
    else status = 'ASSIGNED TASKS & DUTIES LOADING...'

    currentUser.value = {
        name,
        role: role.toUpperCase(),
        department: dept,
        statusText: status
    }

    await fetchPMStats(dept)

    console.log('Dashboard Initialized for:', role)
})
</script>
