<template>
  <div class="space-y-4 animate-fade-up text-left">
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div v-for="stat in summaryStats" :key="stat.label" 
        @click="handleStatClick(stat)"
        class="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
        
        <div class="flex justify-between items-start mb-6">
          <div :class="[stat.bgColor, 'w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20']">
            <i :class="[stat.icon, 'text-xl']"></i>
          </div>
          <div v-if="stat.trend" class="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full">
            <i class="fas fa-chart-line text-[8px]"></i>
            <span>{{ stat.trend || '-' }}</span>
          </div>
        </div>

        <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{{ stat.label }}</p>
        <h3 class="text-2xl font-black text-slate-800 tracking-tighter">{{ stat.value }}</h3>
      </div>
    </div>


    <!-- 🚨 Overdue Tasks Alert -->
    <!-- 🚨 Overdue Tasks Alert Removed (Moved to Modal) -->



    <!-- Action Section: Activations & Feedback -->
    <div class="space-y-4">
      <!-- 🎯 Activation Requests (Wait for approval) -->
      <ActivationApprovals 
        v-if="userRole === 'lead' || userRole === 'manager'" 
        :user-role="userRole"
        @notify="(msg) => $emit('notify', msg)"
        @refresh-team="fetchStats"
      />

      <!-- 🔥 New: Edit Requests (Completed Tasks) -->

      <!-- 🔄 Work Hub: Split Section (Returned vs New Submissions) -->
      <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fade-up">
          <div class="grid grid-cols-1 lg:grid-cols-2 divide-x divide-slate-100">
              
              <!-- Left Side: Reports returned by Manager -->
              <div class="p-5 flex flex-col">
                  <div class="flex items-center justify-between mb-8">
                      <div class="flex items-center gap-3">
                    <div class="w-1.5 h-8 bg-rose-500 rounded-full"></div>
                    <h2 class="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        รายงานที่ถูกตีกลับจากหัวหน้า
                    </h2>
                </div>
                <div class="px-3 py-1 bg-rose-50 rounded-full border border-rose-100 shadow-sm animate-pulse-subtle">
                    <span class="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{{ returnedReports.length }} Items</span>
                </div>
                  </div>

                  <div class="relative flex-1">
                      <div class="space-y-4 overflow-y-auto custom-scrollbar pr-2 h-[248px] pb-4">
                          <div v-if="returnedReports.length === 0" class="py-12 text-center opacity-30">
                              <i class="fas fa-check-circle text-3xl mb-2 text-emerald-400"></i>
                              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">ไม่มีงานที่ถูกตีกลับในขณะนี้</p>
                          </div>
                          <div v-for="report in returnedReports" :key="report.id" 
                               @click="$emit('edit-report', report)"
                               class="flex items-center gap-4 p-3 bg-rose-50/30 border border-rose-100 rounded-2xl hover:shadow-md transition-all group cursor-pointer relative overflow-hidden min-h-[72px]">
                              <div class="relative w-10 h-10 shrink-0">
                                   <div class="w-full h-full rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                                        <i class="fas fa-undo-alt text-lg"></i>
                                   </div>
                              </div>
                              <div class="flex-1 min-w-0">
                                  <h4 class="text-xs font-black text-slate-800 uppercase italic tracking-tighter truncate group-hover:text-rose-600">{{ report.title }}</h4>
                                  <p v-if="report.feedback" class="text-[9px] font-bold text-rose-400 uppercase tracking-widest mt-0.5 truncate italic">
                                      "{{ report.feedback }}"
                                  </p>
                                  <p v-else class="text-[9px] font-bold text-rose-300 uppercase tracking-widest mt-0.5">รอการแก้ไข...</p>
                              </div>
                              <div class="text-right shrink-0">
                                  <span class="text-[9px] font-bold text-slate-400 block">{{ formatDate(report.date) }}</span>
                                  <span class="text-[8px] font-black px-2 py-0.5 rounded mt-1 inline-block bg-rose-500 text-white uppercase tracking-widest">แก้ด่วน</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <!-- Right Side: New Submissions from Staff -->
              <div class="p-5 bg-slate-50/30 flex flex-col">
                  <div class="flex items-center justify-between mb-8">
                      <div class="flex items-center gap-3">
                          <div class="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                           <h3 class="text-lg font-black text-slate-800 italic uppercase">
                             {{ userRole === 'pm' ? 'รายงานที่ Staff ส่งมา' : 'รายงานที่ PM ส่งมา' }}
                           </h3>
                      </div>
                      <span class="text-[9px] font-bold bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest">
                          {{ incomingReports.length }} NEW
                      </span>
                  </div>

                  <div class="relative flex-1">
                      <div class="space-y-4 overflow-y-auto custom-scrollbar pr-2 h-[248px] pb-4">
                          <div v-if="incomingReports.length === 0" class="py-12 text-center opacity-30">
                              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">ยังไม่มีรายงานใหม่ส่งมา</p>
                          </div>
                          <div v-for="report in incomingReports" :key="report.id" 
                              @click="$emit('edit-report', report)"
                              class="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all group cursor-pointer relative overflow-hidden min-h-[72px]">
                              <div class="relative w-10 h-10 shrink-0">
                                   <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${report.submittedBy}`" class="w-full h-full rounded-2xl bg-indigo-50 group-hover:scale-110 transition-transform">
                                   <div :class="['absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[7px] text-white', report.isTask ? 'bg-emerald-400' : 'bg-amber-400']">
                                        <i :class="report.isTask ? 'fas fa-check' : 'fas fa-clock'"></i>
                                   </div>
                              </div>
                              <div class="flex-1 min-w-0">
                                  <h4 class="text-xs font-black text-slate-800 uppercase italic tracking-tighter truncate group-hover:text-indigo-600">{{ report.title }}</h4>
                                  <p class="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">
                                      {{ report.submittedBy }} <span class="text-slate-300">•</span> {{ report.type }}
                                  </p>
                              </div>
                              <div class="text-right shrink-0">
                                  <span class="text-[9px] font-bold text-slate-400 block">{{ formatDate(report.date) }}</span>
                                  <span :class="['text-[8px] font-black px-2 py-0.5 rounded mt-1 inline-block', 
                                    (report.status || '').toUpperCase() === 'RETURNED' ? 'bg-rose-50 text-rose-500' : 
                                    (report.isTask ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500')]">
                                      {{ (report.status || '').toUpperCase() === 'RETURNED' ? 'ถูกตีกลับ' : (report.isTask ? 'เสร็จสิ้น' : 'รอตรวจ') }}
                                  </span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      </div>

      <!-- 🔥 New Layout: 3 Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- 📥 งานย่อยและงานแทรก -->
          <div class="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden animate-fade-up flex flex-col lg:self-start" style="animation-delay: 100ms;">
              <div class="absolute top-0 right-0 w-48 h-48 bg-indigo-500 rounded-full blur-[80px] opacity-10 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <div class="flex justify-between items-end mb-6 shrink-0 relative z-10"> 
                  <div class="flex items-baseline gap-3">
                      <h3 class="text-base font-black text-indigo-600 tracking-tighter leading-none">งานย่อยและงานแทรก</h3>
                      <p class="text-[9px] font-black text-indigo-300 uppercase tracking-[0.2em]">SUB & AD-HOC TASKS</p>
                  </div>
                  <div class="flex items-center gap-2">
                       <span class="text-[9px] font-bold bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full uppercase tracking-widest">{{ subTasks.length }} ACTIVE</span>
                  </div>
              </div>

              <!-- Scrollable Area with Fade -->
              <div class="relative flex-1">
                  <div class="space-y-4 overflow-y-auto custom-scrollbar pr-2 h-[295px] pb-4">
                      <div v-if="subTasks.length === 0" class="py-10 text-center opacity-40">
                          <i class="fas fa-tasks text-3xl text-indigo-200 mb-2"></i>
                          <p class="text-[10px] uppercase font-bold text-slate-300">ไม่มีงานย่อยในขณะนี้</p>
                      </div>
                      <div v-for="task in subTasks" :key="task.id" 
                          @click="$emit('card-click', task)"
                          class="p-4 bg-white border border-slate-100 hover:border-indigo-100 rounded-[2rem] transition-all group cursor-pointer relative shadow-sm hover:shadow-md">
                          <div class="flex justify-between items-start mb-2">
                              <span class="text-[8px] font-black bg-indigo-50 text-indigo-500 px-2 py-1 rounded-lg uppercase tracking-widest">
                                  <i class="fas fa-layer-group mr-1"></i> งานทั่วไป
                              </span>
                              <span class="text-[9px] font-bold text-slate-300">{{ formatDate(task.createdAt) }}</span>
                          </div>
                          
                          <h4 class="text-xs font-black text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{{ task.title }}</h4>
                          
                          <div class="flex items-center gap-2 mt-3">
                               <div class="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                   {{ (task.assignee || 'A').charAt(0) }}
                               </div>
                               <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ task.assignee || 'Unassigned' }}</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          
          <!-- 🔥 New Urgent Tasks -->
          <div class="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm relative overflow-hidden animate-fade-up flex flex-col lg:self-start" style="animation-delay: 150ms;">
              <!-- BG GLOW -->
              <div class="absolute top-0 left-0 w-64 h-64 bg-rose-500 rounded-full blur-[80px] opacity-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

              <div class="flex justify-between items-end mb-6 shrink-0 relative z-10"> 
                  <div class="flex items-baseline gap-3">
                      <h3 class="text-base font-black text-rose-600 tracking-tighter leading-none">งานด่วนวิกฤติ</h3>
                      <p class="text-[9px] font-black text-rose-300 uppercase tracking-[0.2em]">URGENT INTERVENTIONS</p>
                  </div>
                  <div class="flex items-center gap-2">
                       <span class="text-[9px] font-bold bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full uppercase tracking-widest">{{ urgentTasks.length }} ACTIVE</span>
                  </div>
              </div>

              <!-- Scrollable Area with Fade -->
              <div class="relative flex-1">
                  <div class="space-y-4 overflow-y-auto custom-scrollbar pr-2 h-[295px] pb-4">
                      <div v-if="urgentTasks.length === 0" class="py-10 text-center opacity-40">
                          <i class="fas fa-check-circle text-3xl text-emerald-200 mb-2"></i>
                          <p class="text-[10px] uppercase font-bold text-slate-300">ไม่มีงานด่วนคงค้าง</p>
                      </div>
                      <div v-for="task in urgentTasks" :key="task.id" 
                          @click="$emit('card-click', task)"
                          class="p-4 bg-white border-2 border-slate-50 hover:border-rose-100 rounded-[2rem] transition-all group cursor-pointer relative shadow-sm hover:shadow-md">
                          <div class="flex justify-between items-start mb-2">
                              <span class="text-[8px] font-black bg-rose-500 text-white px-2 py-1 rounded-lg uppercase tracking-widest">
                                  <i class="fas fa-bolt mr-1"></i> ด่วนมาก
                              </span>
                              <span class="text-[9px] font-bold text-slate-300">{{ formatDate(task.createdAt) }}</span>
                          </div>
                          
                          <h4 class="text-xs font-black text-slate-800 leading-tight mb-2 group-hover:text-rose-600 transition-colors">{{ task.title }}</h4>
                          
                          <div class="flex items-center gap-2 mt-3">
                               <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                   {{ (task.assignee || 'A').charAt(0) }}
                               </div>
                               <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ task.assignee || 'Unassigned' }}</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- Edit Requests Notification Box -->
          <div class="bg-white rounded-3xl p-6 relative overflow-hidden shadow-xl border border-slate-100 flex flex-col justify-between animate-fade-up lg:self-start" style="animation-delay: 200ms;">
              <!-- BG GLOW -->
              <div class="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-[80px] opacity-10 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

              <div class="relative z-10 flex justify-between items-start mb-8 shrink-0">
                  <div class="flex items-baseline gap-3">
                      <h3 class="text-base font-black text-slate-800 uppercase tracking-tight">คำร้องขอแก้ไข</h3>
                      <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">EDIT REQUESTS (COMPLETED)</p>
                  </div>
                  <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm">
                      <i class="fas fa-bell"></i>
                  </div>
              </div>
              
              <!-- Scrollable Area with Fade -->
              <div class="relative flex-1">
                  <div class="space-y-4 overflow-y-auto custom-scrollbar pr-2 relative z-10 h-[295px] pb-4">
                      <div v-if="editRequests.length === 0" class="py-10 text-center opacity-40">
                          <i class="fas fa-check-circle text-3xl text-slate-300 mb-2"></i>
                          <p class="text-[10px] uppercase font-bold text-slate-400">ไม่มีคำร้องขอแก้ไข</p>
                      </div>
                      
                      <div v-for="req in editRequests" :key="req.id || req._id" 
                          @click="$emit('card-click', req)"
                          class="flex gap-4 group items-start p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100">
                          <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0 text-purple-600 group-hover:scale-110 transition-transform shadow-sm">
                              <i class="fas fa-comment-dots"></i>
                          </div>
                          <div class="flex-1 pt-1 min-w-0">
                               <h4 class="text-xs font-black text-slate-800 leading-tight truncate group-hover:text-purple-600 transition-colors">{{ req.title }}</h4>
                               <p class="text-[10px] font-medium text-slate-500 leading-relaxed line-clamp-2 mt-1">
                                  "{{ (req.comments && req.comments.length > 0) ? req.comments[req.comments.length-1].text : '-' }}"
                               </p>
                               <div class="flex items-center gap-2 mt-2">
                                   <span class="text-[8px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded">{{ req.staffName || 'Staff' }}</span>
                                   <span class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{{ formatDate(req.updatedAt || req.date) }}</span>
                               </div>
                          </div>
                      </div>
                  </div>
              </div>

              <button v-if="editRequests.length > 0" @click="$emit('go-to-report')" class="w-full bg-purple-600 active:bg-purple-700 mt-8 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-purple-500 transition-all shadow-lg shadow-purple-200 relative z-10 text-white shrink-0">
                  จัดการคำขอทั้งหมด
              </button>
          </div>

      </div>
    </div>



    <!-- 🚨 Overdue Modal -->
    <transition name="fade">
      <div v-if="showOverdueModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" @click.self="showOverdueModal = false">
        <div class="bg-rose-50 w-full max-w-[800px] rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-pop text-left border-4 border-white max-h-[85vh] overflow-y-auto custom-scrollbar relative">
          
          <button @click="showOverdueModal = false" class="absolute top-6 right-6 w-10 h-10 rounded-full bg-white text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-sm">
             <i class="fas fa-times"></i>
          </button>

          <div class="flex items-center gap-6 mb-8">
             <div class="w-16 h-16 bg-rose-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-rose-500/30 shrink-0">
                  <i class="fas fa-clock text-3xl animate-pulse"></i>
             </div>
             <div>
                  <h2 class="text-2xl md:text-3xl font-black text-rose-600 uppercase tracking-tighter leading-none mb-2">แจ้งเตือนงานล่าช้า</h2>
                  <p class="text-xs md:text-sm font-bold text-rose-400 uppercase tracking-widest">
                      พบ <span class="bg-rose-200 text-rose-700 px-2 py-0.5 rounded text-[11px] font-black">{{ overdueTasks.length }}</span> ภารกิจที่เลยกำหนดส่ง
                  </p>
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="task in overdueTasks" :key="task.id" 
                   @click="$emit('go-to-task', { id: task.projectId || task.id, title: task.projectTitle || task.title, targetTaskId: task.id })"
                   class="bg-white p-5 rounded-[1.5rem] border border-rose-100 shadow-sm hover:shadow-lg hover:border-rose-300 cursor-pointer flex items-center gap-4 group transition-all active:scale-95">
                   
                   <div class="relative w-12 h-12 shrink-0">
                       <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee}`" class="w-full h-full rounded-2xl bg-rose-50">
                       <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px]">
                           <i class="fas fa-exclamation"></i>
                       </div>
                   </div>

                   <div class="min-w-0 flex-1">
                      <h4 class="text-sm font-black text-slate-800 truncate group-hover:text-rose-600 transition-colors">{{ task.title }}</h4>
                      <p class="text-[10px] font-bold text-rose-400 mt-1 uppercase tracking-wider flex items-center gap-1">
                          <i class="far fa-calendar-times"></i> {{ formatDate(task.deadline) }}
                      </p>
                      <p class="text-[9px] font-bold text-slate-300 mt-1 uppercase tracking-widest truncate">Asg: {{ task.assignee }}</p>
                   </div>
                   
                   <div class="w-8 h-8 rounded-full bg-rose-50 text-rose-300 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all">
                       <i class="fas fa-chevron-right text-xs"></i>
                   </div>
              </div>
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'
import ActivationApprovals from '@/components/ActivationApprovals.vue'
import { formatDate } from '@/utils/date'

// ส่งสัญญาณไปที่ App.vue เพื่อสลับหน้าไป ReportForm
defineEmits(['go-to-report', 'edit-report', 'notify', 'card-click'])

import { watch } from 'vue'

const props = defineProps(['userRole', 'userName', 'userEmail', 'deptName', 'refreshTrigger'])

watch(() => props.refreshTrigger, () => {
    console.log('[DASH] Refreshing data from trigger...')
    fetchStats()
})

const editRequests = ref([])
const returnedReports = ref([])
const incomingReports = ref([])
const totalFetched = ref(0) // New debug ref
const urgentTasks = ref([])
const overdueTasks = ref([])
const showOverdueModal = ref(false)
const subTasks = ref([])
const systemLogs = ref([
    { id: 1, action: 'Agent X pushed code to production', time: '2 MINS AGO', type: 'code', icon: 'fas fa-code' },
    { id: 2, action: 'System backup completed successfully', time: '1 HOUR AGO', type: 'success', icon: 'fas fa-check' },
    { id: 3, action: 'Alert CPU usage exceeded 90%', time: '3 HOURS AGO', type: 'warning', icon: 'fas fa-exclamation-triangle' }
])

onMounted(async () => {
    await fetchStats()
})

const fetchStats = async () => {
    // Unify & Sanitize identity: Multiple fallbacks 
    const sanitize = (str) => (str || '').trim().toLowerCase();
    
    const rawName = props.userName || localStorage.getItem('userName') || '';
    const myName = sanitize(rawName);
    const myEmail = sanitize(props.userEmail || localStorage.getItem('userEmail'));
    const myRole = sanitize(props.userRole || localStorage.getItem('userRole') || 'lead');
    const myDept = (props.deptName || localStorage.getItem('deptName') || '').trim();
    
    // Identity params for tasks (keep basic dept filter for performance)
    const taskParams = { dept: myDept, role: myRole, submittedBy: rawName };
    const editParams = { editRequested: true }; // ULTIMATE LOOSE: No dept constraint for requests
    
    try {
        const [allReports, edits, completedTasks, urgent, allPendingTasks, statsData, teamData, allGlobalTasks] = await Promise.all([
            api.getReports({}), // ULTIMATE FETCH: Get everything, filter on client
            api.getTasks(null, editParams), // Broad fetch for edit requests
            api.getTasks(null, { status: 'completed', ...taskParams }),
            api.getTasks('urgent', { ...taskParams, status: 'pending' }), 
            api.getTasks(null, { status: 'pending', ...taskParams }), 
            api.getStats({ dept: myDept }),
            api.getTeam({ dept: myDept }), // Fetch actual team members
            api.getTasks('task') // NEW: Fetch ALL sub-tasks globally for accurate counting
        ])

        console.log('[DEBUG] Edit Requests Fetched:', edits?.length, edits);

        const reports = allReports || []
        const teamMembers = teamData || []  // Get team array
        totalFetched.value = reports.length; // Set debug value

        // ULTIMATE LOOSE HELPERS
        const isReturnedStatus = (s) => {
            const status = (s || '').toLowerCase();
            return status === 'returned' || status === 'rejected' || status.includes('ตีกลับ') || status.includes('returned');
        }

        const isMyReport = (report) => {
            const reportSubmittedBy = sanitize(report.submittedBy);
            const reportSubmittedByEmail = sanitize(report.submittedByEmail);
            return reportSubmittedBy === myName || reportSubmittedByEmail === myEmail;
        }

        // 1. Personal Action Box (Left): MY reports that were returned
        returnedReports.value = reports.filter(r => {
            const isReturned = isReturnedStatus(r.status);
            const isMe = isMyReport(r);
            return isReturned && isMe;
        })

        // 2. Monitoring Box (Right): PM reports that are pending
        incomingReports.value = reports
            .filter(r => {
                const status = (r.status || '').toLowerCase();
                const isPending = status === 'pending' || status === 'new';
                const reportSubmittedByRole = sanitize(r.submittedByRole);
                const reportDept = (r.dept || '').trim();
                
                // For a Lead, show pending reports from PMs in their department
                // For a Manager, show pending reports from Leads in their department
                // For a PM, show pending reports from Staff in their department
                // Do NOT show my own work here
                const isTeamReport = 
                    (myRole === 'lead' && reportSubmittedByRole === 'pm' && reportDept === myDept) ||
                    (myRole === 'manager' && reportSubmittedByRole === 'lead' && reportDept === myDept) ||
                    (myRole === 'pm' && reportSubmittedByRole === 'staff' && reportDept === myDept);

                const isMe = isMyReport(r);
                
                return isPending && isTeamReport && !isMe;
            })
            .map(r => ({ ...r, isTask: false }))
        
        // Sort by date
        incomingReports.value.sort((a, b) => new Date(b.date) - new Date(a.date))

        // 0. COLLECT ALL fetched tasks for master filtering
        const allFetchedTasks = [
            ...(edits || []),
            ...(urgent || []),
            ...(allPendingTasks || []),
            ...(completedTasks || [])
        ];
        
        // ULTIMATE DEDUPLICATION: Use a Map to deduplicate by ANY available ID
        const taskMap = new Map();
        allFetchedTasks.forEach(t => {
            if (!t) return;
            const tid = String(t.id || t._id || (t.mid ? t.mid : ''));
            if (!tid) return;
            
            const existing = taskMap.get(tid) || {};
            // CRITICAL FIX: Ensure editRequested flag is PRESERVED if it's true in ANY source
            const merged = { ...existing, ...t };
            if (existing.editRequested === true || String(existing.editRequested) === 'true' || t.editRequested === true || String(t.editRequested) === 'true') {
                merged.editRequested = true;
            }
            taskMap.set(tid, merged);
        });
        const uniqueTasks = Array.from(taskMap.values());

        // 1. Prioritize Edit Requests (Show them regardless of other status)
        // LOOSE TRUTH CHECK: catch boolean true, string "true", or 1
        editRequests.value = uniqueTasks.filter(t => 
            t.editRequested === true || 
            String(t.editRequested) === 'true' ||
            !!t.editRequested
        );
        const editIds = new Set(editRequests.value.map(t => String(t.id || t._id)));

        // 2. Assign Urgent Tasks (Exclude those already in Edit Requests)
        urgentTasks.value = uniqueTasks.filter(t => 
            (t.type === 'urgent' || t.priority === 'urgent' || t.isUrgent) && 
            t.status !== 'completed' && 
            !editIds.has(String(t.id || t._id))
        );
        
        // 🚨 OVERDUE CHECK
        const today = new Date();
        today.setHours(0,0,0,0);
        overdueTasks.value = uniqueTasks.filter(t => {
            if (!t.deadline || t.status === 'completed') return false;
            const d = new Date(t.deadline);
            d.setHours(0,0,0,0);
            return d < today;
        });

        // 3. Assign Sub-Tasks (Exclude Urgent and Edit)
        const urgentIds = new Set(urgentTasks.value.map(t => String(t.id || t._id)));
        subTasks.value = uniqueTasks.filter(t => 
            t.type === 'task' && 
            t.status !== 'completed' && 
            !editIds.has(String(t.id || t._id)) && 
            !urgentIds.has(String(t.id || t._id))
        );
        
        const totalProjectCount = uniqueTasks.filter(t => t.type === 'project').length
        // Count ONLY type='urgent' (Ad-hoc), ignoring priority='urgent' for this specific stat
        const totalAdHocCount = uniqueTasks.filter(t => t.type === 'urgent').length
        // Count all 'task' type (Operational Missions / Sub-tasks)
        // Use the global fetch length for accuracy
        const totalSubTaskCount = (allGlobalTasks || []).length

        if (statsData) {
            summaryStats.value = [
              { label: 'ภารกิจปฏิบัติการ (ทั้งหมด)', value: statsData.totalSubTasks ?? totalSubTaskCount, icon: 'fas fa-layer-group', bgColor: 'bg-indigo-500' },
              { label: 'โครงการทั้งหมด', value: statsData.totalProjects ?? totalProjectCount, icon: 'fas fa-folder', bgColor: 'bg-emerald-500', trend: 'Active' },
              { label: 'งานแทรก', value: totalAdHocCount, icon: 'fas fa-bolt', bgColor: 'bg-amber-500', trend: 'Volatile' }, 
              { label: 'กำลังพลรวม', value: teamMembers.length || statsData.totalStaff, icon: 'fas fa-user-shield', bgColor: 'bg-purple-500', trend: 'Stable' },
              { label: 'งานล่าช้า', value: overdueTasks.value.length, icon: 'fas fa-fire-extinguisher', bgColor: 'bg-rose-500', trend: 'Critical' },
            ]
        }
    } catch (e) {
        console.error("Failed to fetch dashboard data", e)
    }
}

const handleStatClick = (stat) => {
    if (stat.label === 'งานล่าช้า' && overdueTasks.value.length > 0) {
        showOverdueModal.value = true
    }
}

const summaryStats = ref([
  { label: 'ภารกิจปฏิบัติการ', value: '0', icon: 'fas fa-layer-group', bgColor: 'bg-indigo-500' },
  { label: 'ผลงานสำเร็จ', value: '0', icon: 'fas fa-check-double', bgColor: 'bg-emerald-500' },
  { label: 'เวลารวม', value: '0h', icon: 'fas fa-clock', bgColor: 'bg-blue-500' },
  { label: 'กำลังพลรวม', value: '0', icon: 'fas fa-user-shield', bgColor: 'bg-purple-500' },
  { label: 'งานด่วนวิกฤติ', value: '0', icon: 'fas fa-fire-extinguisher', bgColor: 'bg-rose-500' },
])
</script>
