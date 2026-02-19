<template>
  <div class="space-y-10 animate-fade-up text-left">
    <div class="flex justify-between items-start">
      <div class="text-left">
        <h2 class="text-[16px] font-black text-slate-900 uppercase tracking-tighter leading-none">ภาพรวมการจัดการ</h2>
        <p class="text-slate-400 text-[12px] font-bold uppercase mt-2 tracking-[0.2em]">สถานะ: ผู้จัดการทั่วไป</p>
      </div>

      <!-- View Switcher -->

    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div v-for="stat in dashStats" :key="stat.label" 
        class="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden text-left"
      >
        <div class="flex justify-between items-start mb-4">
          <div :class="[stat.bgColor, 'p-3 rounded-xl text-white shadow-lg shadow-emerald-100 transition-transform group-hover:scale-110']">
            <i :class="[stat.icon, 'text-lg']"></i>
          </div>
          <span class="text-[12px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            {{ stat.trend }}
          </span>
        </div>

        <div class="space-y-0.5">
          <p class="text-[12px] font-black text-slate-400 uppercase tracking-widest">{{ stat.label }}</p>
          <h3 class="text-[16px] font-black text-slate-900 tracking-tighter">{{ stat.value }}</h3>
        </div>
      </div>
    </div>






    <!-- 🎯 Activation Requests (Wait for approval) -->
    <div class="mt-10">
      <ActivationApprovals 
        :user-role="'manager'"
        @notify="(msg) => $emit('notify', msg)"
        @refresh-team="() => { fetchDashboardData(); $emit('refresh-team'); }"
      />
    </div>

    <!-- Recent Submissions (Wrapped in a Container Box) -->
    <div class="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden mt-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 divide-x divide-slate-50">
        
        <!-- Left Column: Progress Reports -->
        <div class="p-8 bg-white flex flex-col">
           <div class="flex justify-between items-center mb-8">
              <div class="flex items-center gap-3">
                  <div class="w-1.5 h-6 bg-[#5c56f0] rounded-full"></div>
                  <h3 class="text-sm font-black text-slate-800 uppercase tracking-tight italic">รายงานจากหัวหน้า</h3>
              </div>
           </div>

           <div class="relative flex-1">
              <div class="space-y-4 overflow-y-auto custom-scrollbar pr-2 h-[278px] text-left">
                <div v-for="report in progressReports" :key="report.id" 
                     @click="selectedDetailReport = report"
                     class="group bg-slate-50 border border-slate-100 flex items-center gap-4 p-4 rounded-3xl hover:bg-white hover:shadow-md transition-all cursor-pointer min-h-[82px]">
                  
                  <!-- Icon -->
                  <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg shadow-sm shrink-0', report.type === 'completion' ? 'bg-emerald-500' : 'bg-[#5c56f0]']">
                    <i :class="['fas', report.type === 'completion' ? 'fa-check-circle' : 'fa-chart-line']"></i>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 text-left min-w-0">
                    <p class="text-xs font-black text-slate-800 uppercase tracking-tight truncate">{{ report.title }}</p>
                    <p class="text-[9px] text-slate-400 font-black uppercase italic tracking-widest mt-0.5">
                      {{ report.submittedBy || 'Unknown' }} • {{ formatDate(report.date) }}
                    </p>
                  </div>

                  <!-- Action -->
                  <div class="shrink-0">
                    <span class="text-[9px] font-black bg-white text-slate-400 px-4 py-2 rounded-full uppercase tracking-widest group-hover:bg-[#5c56f0] group-hover:text-white transition-colors border border-slate-100">อ่าน</span>
                  </div>
                </div>
                
                <div v-if="progressReports.length === 0" class="flex flex-col items-center justify-center py-20 opacity-30 gap-3">
                   <i class="fas fa-inbox text-3xl text-slate-200"></i>
                   <p class="text-[11px] text-slate-400 font-black uppercase tracking-widest">ไม่มีรายงานความคืบหน้า</p>
                </div>
              </div>
           </div>
        </div>

        <!-- Right Column: Issues & Requests -->
        <div class="p-8 bg-slate-50/30 flex flex-col">
           <div class="flex justify-between items-center mb-8">
              <div class="flex items-center gap-3">
                  <div class="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                  <h3 class="text-sm font-black text-slate-800 uppercase tracking-tight italic">รายงานด่วน</h3>
              </div>
           </div>

           <div class="relative flex-1">
              <div class="space-y-4 overflow-y-auto custom-scrollbar pr-2 h-[278px]">
                <div v-for="report in issueReports" :key="report.id" 
                     @click="selectedDetailReport = report"
                     class="group bg-white border border-slate-100 flex items-center gap-4 p-4 rounded-3xl hover:shadow-md transition-all cursor-pointer min-h-[82px]">
                  
                  <!-- Icon -->
                  <div class="w-12 h-12 rounded-2xl bg-rose-500 shadow-sm flex items-center justify-center text-white text-lg shrink-0">
                    <i :class="['fas', report.type === 'budget' ? 'fa-file-invoice-dollar' : 'fa-exclamation-triangle']"></i>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 text-left min-w-0">
                    <p class="text-xs font-black text-slate-800 uppercase tracking-tight truncate">{{ report.title }}</p>
                    <p class="text-[9px] text-slate-400 font-black uppercase italic tracking-widest mt-0.5">
                      {{ report.submittedBy || 'Unknown' }} • {{ formatDate(report.date) }}
                    </p>
                  </div>

                  <!-- Action -->
                  <div class="shrink-0">
                     <span class="text-[9px] font-black bg-slate-50 text-slate-400 px-4 py-2 rounded-full uppercase tracking-widest group-hover:bg-slate-800 group-hover:text-white transition-colors">ดู</span>
                  </div>
                </div>
                
                <div v-if="issueReports.length === 0" class="flex flex-col items-center justify-center py-20 opacity-30 gap-3">
                    <i class="fas fa-check-circle text-3xl text-slate-200"></i>
                    <p class="text-[11px] text-slate-400 font-black uppercase tracking-widest">เรียบร้อยทุกอย่าง</p>
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>

    <!-- Bottom Section: Department Status -->
    <div class="mt-10">

      <div class="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl">
        <div class="flex justify-between items-center mb-8">
           <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">สถานะแผนก</h3>
        </div>
        
        <div class="space-y-4">
          <div v-for="dept in departments" :key="dept.name" class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-slate-100 transition-colors">
            <div class="flex items-center gap-4 text-left">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" :class="dept.color">
                {{ dept.code }}
              </div>
              <div>
                <p class="text-xs font-black text-slate-800 uppercase">{{ dept.name }}</p>
                <p class="text-[10px] text-slate-400 font-bold uppercase italic">หัวหน้า: {{ dept.head }}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="block text-xl font-black text-slate-800">{{ dept.progress }}%</span>
              <span class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ประสิทธิภาพ</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 📄 Report Detail Modal (Manager In-Place Review) -->
    <transition name="fade">
      <div v-if="selectedDetailReport" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" @click.self="selectedDetailReport = null">
        <div class="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col animate-scale-up border border-slate-100">
            
            <!-- Header -->
            <div class="px-10 pt-10 pb-6 border-b border-slate-50 flex justify-between items-center shrink-0 bg-white">
                <div class="flex flex-col text-left leading-none">
                     <span class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-2 italic">Detailed Report Viewer</span>
                     <h2 class="text-2xl font-black text-slate-900 tracking-tighter">{{ selectedDetailReport.title }}</h2>
                </div>
                <button @click="selectedDetailReport = null" class="w-10 h-10 rounded-full bg-slate-50 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-colors shadow-sm">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Content -->
            <div class="p-10 overflow-y-auto custom-scrollbar space-y-10 text-left">
                
                <!-- Metadata Grid -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-slate-50 p-5 rounded-2xl flex flex-col gap-1 border border-slate-100/50">
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">ผู้ส่งรายงาน</span>
                    <span class="text-xs font-black text-slate-700">{{ selectedDetailReport.submittedBy }}</span>
                  </div>
                  <div class="bg-slate-50 p-5 rounded-2xl flex flex-col gap-1 border border-slate-100/50">
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">วันที่ส่ง</span>
                    <span class="text-xs font-black text-slate-700">{{ formatDate(selectedDetailReport.date) }}</span>
                  </div>
                </div>

                <!-- Main Content -->
                <div class="space-y-4">
                    <label class="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-4">รายละเอียดงานที่ดำเนินการ</label>
                    <div class="bg-white p-8 rounded-[2rem] text-slate-700 text-sm font-bold leading-relaxed border-2 border-slate-50 shadow-inner whitespace-pre-wrap">
                        {{ selectedDetailReport.description || selectedDetailReport.title || '-' }}
                    </div>
                </div>

                <!-- 🕒 Report History (Previous Versions) -->
                <div v-if="selectedDetailReport?.reportHistory && selectedDetailReport.reportHistory.length > 0" class="space-y-4 pt-10 border-t border-slate-50">
                    <label class="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-4">ประวัติการแก้ไข (Previous Versions)</label>
                    <div class="space-y-4">
                        <div v-for="(version, vIdx) in selectedDetailReport.reportHistory" :key="vIdx" class="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50 hover:bg-white hover:shadow-lg hover:border-indigo-200 transition-all group overflow-y-auto custom-scrollbar">
                           <div class="flex flex-col gap-2 mb-3 border-b border-indigo-100 pb-3">
                               <div class="flex justify-between items-center">
                                    <span class="text-[10px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                                        <i class="fas fa-history"></i> {{ new Date(version.editedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }) }}
                                    </span>
                                    <span class="bg-white px-2 py-1 rounded-lg text-[8px] font-black text-slate-400 uppercase border border-slate-100 shadow-sm">Ver. {{ vIdx + 1 }}</span>
                               </div>
                               <p class="text-[9px] font-black text-slate-300 uppercase tracking-widest">Modified by {{ version.editedBy }}</p>
                           </div>
                           
                           <div class="space-y-3">
                               <p class="text-xs font-black text-slate-700 leading-snug">{{ version.title || version.content }}</p>
                               <div v-if="version.description && version.description !== '-'" class="pt-2 border-t border-indigo-100/30">
                                   <p class="text-[10px] text-slate-500 font-bold leading-relaxed">{{ version.description }}</p>
                               </div>

                               <div v-if="version.attachments && version.attachments.length > 0" class="flex flex-wrap gap-2 pt-2">
                                    <div v-for="(file, fIdx) in version.attachments" :key="fIdx" class="flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-100/50 rounded-xl shadow-sm">
                                        <i class="fas fa-paperclip text-[8px] text-indigo-400"></i>
                                        <span class="text-[9px] font-bold text-slate-600 truncate max-w-[100px]">{{ file.name }}</span>
                                    </div>
                               </div>
                           </div>

                           <div v-if="version.feedback" class="mt-4 bg-rose-50 p-4 rounded-2xl border border-rose-100 flex items-start gap-3">
                                <div class="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                    <i class="fas fa-comment-dots text-rose-500 text-[10px]"></i>
                                </div>
                                <div class="min-w-0">
                                     <p class="text-[8px] font-black text-rose-400 uppercase tracking-wider mb-1">MANAGER FEEDBACK</p>
                                     <p class="text-[10px] text-rose-700 font-bold leading-relaxed">{{ version.feedback }}</p>
                                </div>
                           </div>
                        </div>
                    </div>
                </div>

                <!-- Attachments Section -->
                <div class="space-y-4">
                    <label class="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-4">หลักฐานและไฟล์แนบ</label>
                    <div v-if="selectedDetailReport.attachments && selectedDetailReport.attachments.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div v-for="(file, idx) in selectedDetailReport.attachments" :key="idx" class="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl hover:border-indigo-300 transition-colors cursor-pointer group shadow-sm">
                            <div class="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <i class="fas fa-file-alt"></i>
                            </div>
                            <div class="min-w-0">
                                <p class="text-[11px] font-black text-slate-700 truncate max-w-[150px]">{{ file.name }}</p>
                                <p class="text-[9px] text-slate-400 uppercase tracking-wider font-bold italic">{{ (file.size / 1024).toFixed(1) }} KB</p>
                            </div>
                        </div>
                    </div>
                    <div v-else class="p-10 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300 gap-3">
                        <i class="fas fa-paperclip text-2xl"></i>
                        <span class="text-[10px] font-black uppercase tracking-widest">ไม่มีหลักฐานแนบ</span>
                    </div>
                </div>

                <!-- Previous Feedback (If Resubmitted or Has Feedback) -->
                <div v-if="selectedDetailReport.feedback" class="space-y-4 pt-10 border-t border-slate-50">
                    <label class="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-4">เหตุผลที่ถูกส่งกลับแก้ไข / ข้อความเดิม</label>
                    <div class="bg-rose-50 p-6 rounded-[2rem] text-rose-700 text-sm font-bold leading-relaxed border border-rose-100 shadow-inner">
                        {{ selectedDetailReport.feedback }}
                    </div>
                </div>

                <!-- Review Section (If Pending) -->
                <div v-if="selectedDetailReport.status === 'pending'" class="space-y-6 pt-10 border-t border-slate-50">
                    <div class="flex gap-4">
                        <button @click="openReturnModal" class="flex-1 py-5 bg-white text-rose-500 border border-rose-100 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2">
                            <i class="fas fa-undo-alt"></i> ส่งกลับไปแก้ไข
                        </button>
                        <button @click="updateReportStatus('reviewed')" class="flex-1 py-5 bg-[#0f172a] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
                            <i class="fas fa-check-circle text-emerald-400"></i> ตรวจสอบผ่าน
                        </button>
                    </div>
                </div>

                <div v-else class="pt-6 border-t border-slate-50 flex justify-center">
                    <span :class="['px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest', selectedDetailReport.status === 'reviewed' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500']">
                       สถานะ: {{ selectedDetailReport.status === 'reviewed' ? 'ตรวจสอบแล้ว' : 'ส่งกลับแก้ไข' }}
                    </span>
                </div>

            </div>
        </div>
      </div>
    </transition>

     <!-- 📩 Return Report Modal -->
    <Transition name="modal">
      <div v-if="showReturnModal" class="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
        <div class="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative text-left animate-pop">
          <h3 class="text-2xl font-black text-slate-900 uppercase mb-2 italic tracking-tighter">REQUEST INFORMATION</h3>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">SEND A MESSAGE TO {{ selectedDetailReport?.submittedBy }}</p>
          
          <textarea v-model="reviewFeedback" rows="4" placeholder="ระบุสิ่งที่ต้องการเพิ่มเติม..." class="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none font-bold text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:border-indigo-500/30 transition-all"></textarea>
          
          <div class="flex gap-4 mt-8">
            <button @click="confirmReturn" class="flex-1 py-4 bg-[#5c56f0] text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">
              SEND REQUEST
            </button>
             <button @click="showReturnModal = false" class="flex-1 py-4 bg-slate-100 text-slate-400 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import ActivationApprovals from '@/components/ActivationApprovals.vue'
import { formatDate } from '@/utils/date'

const router = useRouter()
const emit = defineEmits(['change-tab', 'notify', 'edit-report', 'refresh-team'])
    
const props = defineProps({
  allStaff: {
    type: Array,
    default: () => []
  },
  userRole: String,
  refreshTrigger: Number
})

import { watch } from 'vue'

watch(() => props.refreshTrigger, () => {
    console.log('[MANAGER] Refreshing dashboard...')
    fetchDashboardData()
})

const viewMode = ref('overview')
const isActivityExpanded = ref(true)
const selectedDetailReport = ref(null)
const reviewFeedback = ref('')
const showReturnModal = ref(false)

const openReturnModal = () => {
    reviewFeedback.value = '' // Reset feedback
    showReturnModal.value = true
}

const confirmReturn = async () => {
    if (!reviewFeedback.value.trim()) {
        emit('notify', { message: 'กรุณาระบุเหตุผลในการส่งกลับแก้ไข', type: 'error' })
        return
    }
    await updateReportStatus('returned')
    showReturnModal.value = false
}

const updateReportStatus = async (status) => {
    if (!selectedDetailReport.value) return
    
    // Validate feedback for returned reports
    if (status === 'returned' && !reviewFeedback.value.trim()) {
        emit('notify', { message: 'กรุณาระบุเหตุผลในการส่งกลับแก้ไข', type: 'error' })
        return
    }

    try {
        await api.updateReport(selectedDetailReport.value.id, { 
            status, 
            feedback: reviewFeedback.value 
        })
        
        const successMsg = status === 'returned' ? 'ส่งคืนรายงานให้แก้ไขแล้ว' : 'ดำเนินการตรวจสอบเรียบร้อยแล้ว'
        emit('notify', successMsg)
        
        selectedDetailReport.value = null
        reviewFeedback.value = ''
        fetchDashboardData()
    } catch (e) {
        console.error(e)
        emit('notify', { message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ', type: 'error' })
    }
}
    
const dashStats = ref([
  { label: 'โครงการทั้งหมด', value: '0', icon: 'fas fa-folder-open', bgColor: 'bg-emerald-500', trend: '+2.5%' },
  { label: 'ทีมที่ใช้งานอยู่', value: '0', icon: 'fas fa-users', bgColor: 'bg-teal-500', trend: 'คงที่' },
  { label: 'ประสิทธิภาพ', value: '0%', icon: 'fas fa-chart-line', bgColor: 'bg-cyan-500', trend: '+5.2%' },
  { label: 'การใช้งบประมาณ', value: '68%', icon: 'fas fa-wallet', bgColor: 'bg-blue-500', trend: 'เหมาะสม' },
  { label: 'รออนุมัติ', value: '0', icon: 'fas fa-stamp', bgColor: 'bg-amber-500', trend: 'รอการดำเนินการ' }
])

const progressReports = ref([])
const issueReports = ref([])

onMounted(async () => {
  await fetchDashboardData()
})

const fetchDashboardData = async () => {
    try {
        const stats = await api.getStats()
        if (stats) {
             dashStats.value[0].value = stats.activeMissions || '0'
             dashStats.value[1].value = stats.totalStaff || '0'
             dashStats.value[2].value = (stats.efficiency || '0') + '%'
             dashStats.value[3].value = '68%' // Mock budget for now
             dashStats.value[4].value = stats.pendingIssues || '0'
        }

        // Fetch All Reports (Bypass strict backend filtering, handle in frontend)
        // We don't pass 'role: manager' here to avoid the server-side strict 'submittedByRole: lead' check
        // which might be hiding reports that have missing/incorrect role tags.
        const reports = await api.getReports({}) || []
        
        // Helper to check if reporter is a Lead (Robust check)
        const isLead = (r) => {
            // 1. Direct Role Tag Check
            // 1. Direct Role Tag Check (Relaxed: Contains 'lead' or 'head')
            if (r.submittedByRole && (r.submittedByRole.toLowerCase().includes('lead') || r.submittedByRole.toLowerCase().includes('head'))) return true;
            
            // 2. Dynamic Lookup in Staff List (Fallback)
            if (props.allStaff && props.allStaff.length > 0) {
                 const staff = props.allStaff.find(s => s.name === r.submittedBy || s.username === r.submittedBy);
                 if (staff && (staff.role?.toLowerCase() === 'lead' || staff.position?.toLowerCase().includes('lead'))) return true;
            }
            return false;
        }

        // 1. Progress Reports (Weekly, Daily) - Filter for Lead only AND Not Urgent
        const progress = reports.filter(r => 
            ['weekly', 'daily'].includes(r.type) && 
            isLead(r) &&
            !(r.priority && ['high', 'urgent'].includes(r.priority.toLowerCase()))
        )
        progress.sort((a, b) => {
            if (a.status === 'pending' && b.status !== 'pending') return -1;
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            return new Date(b.date) - new Date(a.date)
        })
        progressReports.value = progress.slice(0, 15)

        // 2. Urgent Reports (Emergency, Issue, Budget, HR OR Priority High) - Filter for Lead only
        const issues = reports.filter(r => 
          (
            ['emergency', 'issue', 'budget', 'hr'].includes(r.type) || 
            (r.priority && ['high', 'urgent'].includes(r.priority.toLowerCase()))
          ) && isLead(r)
        )
        issues.sort((a, b) => {
            if (a.status === 'pending' && b.status !== 'pending') return -1;
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            return new Date(b.date) - new Date(a.date)
        })
        issueReports.value = issues.slice(0, 15)

    } catch (e) {
        console.error("Dashboard fetch error", e)
    }
}

const departments = ref([
  { name: 'เทคโนโลยีสารสนเทศ', code: 'IT', head: 'Somchai R.', progress: 92, color: 'bg-indigo-500' },
  { name: 'ออกแบบสร้างสรรค์', code: 'DS', head: 'Vipa S.', progress: 88, color: 'bg-rose-500' },
  { name: 'ทรัพยากรบุคคล', code: 'HR', head: 'Somsak K.', progress: 95, color: 'bg-amber-500' },
  { name: 'ทีมการตลาด', code: 'MK', head: 'Anong P.', progress: 85, color: 'bg-pink-500' },
  { name: 'ทีมขาย', code: 'SF', head: 'Wichai T.', progress: 98, color: 'bg-emerald-500' }
])



// Utility formatDate is now imported from @/utils/date

const getReportColor = (type) => {
  const colors = { emergency: 'bg-rose-500', weekly: 'bg-blue-500', daily: 'bg-emerald-500' }
  return colors[type] || 'bg-slate-400'
}
</script>

<style scoped>
.animate-fade-up {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
@keyframes pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-pop { animation: pop 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67); }

h1, h2, h3, h4, p, span {
  font-family: 'LINE Seed Sans TH', sans-serif;
}
</style>
