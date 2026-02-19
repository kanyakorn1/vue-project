<template>
  <div class="space-y-10 animate-fade-up text-left">
    <!-- 📄 MODE: INBOX (Picture 1 Landing) -->
    <template v-if="currentView === 'inbox'">
        <div class="flex flex-col h-[calc(100vh-8rem)]">
          <ReportInbox 
            :user-role="userRole" 
            @write-report="handleWriteReport" 
            @show-history="currentView = 'history'" 
            @edit="handleEditFromInbox"
          />
        </div>
    </template>

    <!-- ✍️ MODE: FORM (Writing/Editing Mode) -->
    <template v-else-if="currentView === 'form'">
      <!-- Header Section for Submission -->
      <div class="flex justify-between items-start mb-10">
          <div class="flex items-center gap-6">
              <!-- Back Button to Inbox -->
              <button @click="currentView = 'inbox'" class="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm cursor-pointer shrink-0">
                  <i class="fas fa-arrow-left"></i>
              </button>
              
              <div class="flex items-end gap-4">
                  <div :class="[accentColor, 'w-2 h-16 rounded-full transition-colors duration-500']"></div>
                  <div>
                      <h2 class="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                          {{ report.id ? 'แก้ไขรายงานสรุปผล' : 'ส่งรายงานสรุปผล' }}
                      </h2>
                      <p class="text-slate-400 text-[10px] font-black uppercase mt-3 tracking-[0.2em] italic">
                          IDENTITY: {{ userRole?.toUpperCase() || 'STRATEGIC LEAD' }}
                      </p>
                  </div>
              </div>
          </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div :class="[userRole === 'lead' ? 'lg:col-span-3' : 'lg:col-span-2', 'space-y-6']">
          <div class="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8 text-left">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[9px] font-black text-slate-400 uppercase ml-4 tracking-widest leading-none">ประเภทรายงาน</label>
                <select v-model="report.type" @change="checkPriority" class="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-bold text-sm text-slate-800 outline-none focus:border-indigo-500/30 transition-all appearance-none cursor-pointer">
                  <option value="daily">รายงานประจำวัน</option>
                  <option value="weekly">รายงานประจำสัปดาห์</option>
                  <option value="emergency">รายงานเหตุฉุกเฉิน</option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-[9px] font-black text-slate-400 uppercase ml-4 tracking-widest leading-none">ระดับความสำคัญ</label>
                <div class="flex gap-2 p-1.5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <button v-for="p in priorities" :key="p.id" @click="setPriority(p.id)" :disabled="report.type === 'emergency'" 
                    :class="['flex-1 py-2.5 rounded-[1.2rem] text-[9px] font-black uppercase transition-all', 
                    report.priority === p.id ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400']">
                    {{ p.label }}
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-2">
               <div v-if="report.feedback" class="bg-rose-50 p-4 rounded-[1.5rem] border border-rose-100 mb-4 flex items-start gap-3">
                  <i class="fas fa-exclamation-triangle text-rose-500 text-lg mt-0.5"></i>
                  <div class="space-y-0.5">
                      <p class="text-[9px] font-black text-rose-400 uppercase tracking-widest leading-none">ความคิดเห็นจากผู้จัดการ</p>
                      <p class="text-xs font-bold text-rose-800 leading-relaxed">{{ report.feedback }}</p>
                  </div>
              </div>

              <label class="text-[9px] font-black text-slate-400 uppercase ml-4 tracking-widest leading-none">{{ dynamicLabels.main }}</label>
              <textarea v-model="report.content" :placeholder="dynamicLabels.placeholderMain" class="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-bold text-sm text-slate-800 outline-none focus:border-indigo-500/30 transition-all resize-none shadow-inner h-32"></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-[9px] font-black text-slate-400 uppercase ml-4 tracking-widest leading-none">{{ dynamicLabels.footer }}</label>
              <input v-model="report.footer" type="text" :placeholder="dynamicLabels.placeholderFooter" class="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-bold text-sm text-slate-800 outline-none focus:border-indigo-500/30 shadow-inner">
            </div>

            <div class="space-y-3">
               <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-widest leading-none">หลักฐานแนบ</label>
               <div class="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative group" @click="triggerFileUpload">
                  <input type="file" ref="fileInput" multiple class="hidden" @change="handleFileUpload">
                  <div v-if="report.attachments.length === 0" class="flex flex-col items-center gap-2 py-4">
                      <div class="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center text-xl mb-1 group-hover:scale-110 transition-transform">
                          <i class="fas fa-cloud-upload-alt"></i>
                      </div>
                      <p class="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">คลิกเพื่อแนบรูปภาพหรือเอกสาร</p>
                  </div>
                  <div v-else class="text-left space-y-3">
                      <div v-for="(file, index) in report.attachments" :key="index" class="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                          <div class="flex items-center gap-3">
                              <div class="w-8 h-8 bg-emerald-100 text-emerald-500 rounded-xl flex items-center justify-center text-xs">
                                  <i class="fas fa-file-image" v-if="file.type.includes('image')"></i>
                                  <i class="fas fa-file-pdf" v-else-if="file.type.includes('pdf')"></i>
                                  <i class="fas fa-file text-slate-400" v-else></i>
                              </div>
                              <span class="text-xs font-bold text-slate-700 truncate max-w-[150px]">{{ file.name }}</span>
                          </div>
                          <button @click.stop="removeFile(index)" class="w-6 h-6 rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500 flex items-center justify-center transition-colors">
                              <i class="fas fa-times text-[10px]"></i>
                          </button>
                      </div>
                  </div>
               </div>
            </div>

            <div v-if="isReviewMode" class="bg-slate-100 p-8 rounded-[2.5rem] border border-slate-200 mt-8 animate-fade-up">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                        <i class="fas fa-user-check"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-black text-slate-800 uppercase tracking-tighter leading-none">ส่วนการตรวจสอบ</h3>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Review & Feedback</p>
                    </div>
                </div>
                <textarea v-model="feedback" placeholder="ระบุข้อเสนอแนะ หรือสิ่งที่ต้องแก้ไข (หากมี)..." class="w-full px-6 py-4 bg-white border-2 border-slate-200 rounded-[1.5rem] font-bold text-sm text-slate-800 outline-none focus:border-indigo-500/30 transition-all resize-none shadow-inner h-24 mb-4"></textarea>
                <div class="flex gap-4">
                    <button @click="returnReport" class="flex-1 py-4 bg-rose-50 text-rose-600 border-2 border-rose-100 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-lg active:scale-95">
                        <i class="fas fa-undo-alt mr-2"></i> ส่งกลับแก้ไข
                    </button>
                    <button @click="approveReport" class="flex-1 py-4 bg-emerald-500 text-white border-2 border-emerald-500 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 active:scale-95">
                        <i class="fas fa-check-circle mr-2"></i> ตรวจสอบแล้ว
                    </button>
                </div>
            </div>

            <button v-else @click="submitReport" class="w-full py-7 bg-[#5c56f0] hover:bg-[#4a44d8] text-white rounded-[2.5rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] duration-300 group overflow-hidden relative">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span class="relative z-10">{{ resubmitLabel }}</span>
            </button>
          </div>
        </div>

        <div v-if="userRole !== 'lead'" class="space-y-6">
          <!-- 🕒 Sidebar History List (Simplified) -->
          <div class="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 text-left h-fit relative">
            <h3 class="text-[11px] font-black uppercase tracking-[0.15em] text-slate-800 mb-6 flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span>ประวัติล่าสุด</span>
                <span class="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px]">{{ history.length }}</span>
              </div>
            </h3>
            
            <div class="space-y-4 overflow-y-auto custom-scrollbar pr-1 max-h-[500px]">
              <div v-for="item in history.slice(0, 5)" :key="item.id" @click="loadReportById(item.id)"
                class="group p-5 bg-slate-50/50 rounded-[2rem] border border-transparent hover:border-indigo-100 hover:bg-white transition-all cursor-pointer relative">
                <div class="flex justify-between items-start mb-3 text-left">
                  <span :class="['text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-wider', getTypeClass(item.type)]">
                    {{ item.type === 'daily' ? 'รายวัน' : item.type === 'weekly' ? 'รายสัปดาห์' : 'ฉุกเฉิน' }}
                  </span>
                  <span class="text-[9px] font-bold text-slate-300 uppercase tracking-tighter leading-none">{{ item.date }}</span>
                </div>
                <p class="text-xs font-black text-slate-800 line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-left">{{ item.title }}</p>
                <div class="flex items-center gap-2 text-left">
                  <div class="w-1.5 h-1.5 rounded-full shadow-sm" :class="item.status === 'REVIEWED' ? 'bg-emerald-500' : (item.status === 'RETURNED' ? 'bg-rose-500' : 'bg-amber-400')"></div>
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    {{ item.status === 'REVIEWED' ? 'ตรวจสอบแล้ว' : item.status === 'RETURNED' ? 'ถูกส่งกลับมาแก้ไข' : 'รอตรวจสอบ' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 📚 MODE: HISTORY (Picture 2 Grid View) -->
    <div v-else-if="currentView === 'history'" class="flex flex-col h-[calc(100vh-8rem)] animate-fade-up">
        <div class="flex items-center justify-between mb-8 shrink-0">
             <div class="flex items-center gap-6">
                <button @click="currentView = 'inbox'" class="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm cursor-pointer z-10 hover:shadow-md">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="flex items-end gap-4">
                    <div class="w-2 h-12 rounded-full bg-[#121926] transition-colors duration-500"></div>
                    <div>
                        <h2 class="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none text-left">รายงานทั้งหมด</h2>
                        <p class="text-slate-400 text-[10px] font-bold uppercase mt-2 tracking-[0.2em] italic leading-none text-left">ตรวจสอบข้อมูลรายงานปฏิบัติงานที่บันทึกไว้ในระบบ</p>
                    </div>
                </div>
             </div>

             <!-- Filter Selection -->
             <div class="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                <button v-for="tab in ['all', 'pending', 'reviewed', 'returned']" :key="tab" @click="inboxTab = tab"
                    :class="['px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', 
                    inboxTab === tab ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600']">
                    {{ tab === 'all' ? 'ทั้งหมด' : (tab === 'pending' ? 'รอตรวจสอบ' : (tab === 'reviewed' ? 'ตรวจสอบแล้ว' : 'ส่งกลับ')) }}
                </button>
             </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
            <div v-if="filteredFullHistory.length === 0" class="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                 <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200 text-3xl">
                    <i class="fas fa-folder-open"></i>
                 </div>
                 <p class="text-slate-400 font-bold uppercase tracking-widest text-xs leading-none">ไม่พบข้อมูลรายงานในหมวดหมู่นี้</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div v-for="item in filteredFullHistory" :key="item.id" @click="viewReportLocal(item.id)"
                  class="group bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer relative overflow-hidden flex flex-col h-full text-left">
                  <div class="flex justify-between items-start mb-6">
                    <span :class="['text-[9px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest leading-none', getTypeClass(item.type)]">
                      {{ item.type === 'daily' ? 'รายวัน' : item.type === 'weekly' ? 'รายสัปดาห์' : 'ฉุกเฉิน' }}
                    </span>
                    <span class="text-[9px] font-black text-slate-300 uppercase italic tracking-tighter leading-none">
                      {{ item.date }}
                    </span>
                  </div>
                  <h4 class="text-lg font-black text-slate-800 leading-tight uppercase tracking-tight mb-4 group-hover:text-indigo-600 transition-colors flex-1 line-clamp-2">
                     {{ item.title }}
                  </h4>
                  <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                     <div class="flex items-center gap-2">
                        <div :class="['w-1.5 h-1.5 rounded-full shadow-sm', item.status === 'RETURNED' ? 'bg-rose-500 animate-pulse' : (item.status === 'REVIEWED' ? 'bg-emerald-500' : 'bg-amber-400')]"></div>
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                            {{ item.status === 'RETURNED' ? 'ส่งกลับแก้ไข' : (item.status === 'REVIEWED' ? 'ตรวจสอบแล้ว' : 'รอตรวจสอบ') }}
                        </span>
                     </div>
                     <div class="w-8 h-8 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                        <i class="fas fa-chevron-right text-[10px]"></i>
                     </div>
                  </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Report Detail Modal -->
    <div v-if="selectedViewReport" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" @click.self="selectedViewReport = null">
        <div class="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col animate-scale-up">
            <!-- Header -->
            <div class="px-8 py-6 border-b border-slate-50 flex justify-between items-center shrink-0">
                <div class="flex items-center gap-4">
                     <span :class="['text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest', getTypeClass(selectedViewReport.type)]">
                         {{ selectedViewReport.type === 'daily' ? 'รายงานรายวัน' : selectedViewReport.type === 'weekly' ? 'รายงานสัปดาห์' : 'รายงานฉุกเฉิน' }}
                     </span>
                     <span class="text-xs font-black text-slate-300 uppercase tracking-wider">{{ selectedViewReport.date }}</span>
                </div>
                <button @click="selectedViewReport = null" class="w-8 h-8 rounded-full bg-slate-50 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-colors">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Content -->
            <div class="p-8 overflow-y-auto custom-scrollbar space-y-8 text-left">
                <h2 class="text-xl font-black text-slate-800 leading-tight uppercase tracking-tight">{{ selectedViewReport.title }}</h2>
                <div class="flex items-center gap-3">
                     <span :class="['px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border', 
                        selectedViewReport.status === 'RETURNED' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                        selectedViewReport.status === 'REVIEWED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        'bg-amber-50 text-amber-600 border-amber-100']">
                        {{ selectedViewReport.status === 'RETURNED' ? 'ส่งกลับแก้ไข' : (selectedViewReport.status === 'REVIEWED' ? 'ตรวจสอบแล้ว' : 'รอตรวจสอบ') }}
                     </span>
                </div>
                <div v-if="selectedViewReport.feedback" class="bg-rose-50 border border-rose-100 rounded-2xl p-6">
                    <h4 class="text-rose-800 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                        <i class="fas fa-exclamation-triangle"></i> ความเห็นจากผู้จัดการ
                    </h4>
                    <p class="text-rose-700 text-sm font-medium leading-relaxed">{{ selectedViewReport.feedback }}</p>
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-300 uppercase tracking-widest">รายละเอียด</label>
                    <div class="bg-slate-50 p-6 rounded-2xl text-slate-700 text-sm font-medium leading-relaxed whitespace-pre-wrap border border-slate-100">
                        {{ selectedViewReport.content || selectedViewReport.description || '-' }}
                    </div>
                </div>
                <!-- Attachments -->
                <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-300 uppercase tracking-widest">ไฟล์แนบ</label>
                    <div v-if="selectedViewReport.attachments && selectedViewReport.attachments.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div v-for="(file, idx) in selectedViewReport.attachments" :key="idx" class="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors cursor-pointer group">
                            <div class="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <i class="fas fa-file-alt"></i>
                            </div>
                            <div class="min-w-0">
                                <p class="text-xs font-black text-slate-700 truncate max-w-[150px]">{{ file.name }}</p>
                                <p class="text-[9px] text-slate-400 uppercase tracking-wider">{{ (file.size / 1024).toFixed(1) }} KB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-6 border-t border-slate-50 bg-slate-50 flex justify-end">
                <button @click="selectedViewReport = null" class="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-colors shadow-sm">
                    ปิดหน้าต่าง
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import api from '@/api'
import ReportInbox from './ReportInbox.vue'

const props = defineProps(['editingReport', 'userRole', 'refreshTrigger', 'userName', 'deptName', 'allStaff'])
const emit = defineEmits(['notify', 'refresh'])

const history = ref([])
const currentView = ref('inbox')
const inboxTab = ref('all')
const report = ref({ type: 'daily', priority: 'normal', content: '', footer: '', attachments: [], missionId: null })

// Listen for global reset from sidebar
watch(() => props.refreshTrigger, () => {
    currentView.value = 'inbox'
    inboxTab.value = 'new'
    report.value = { type: 'daily', priority: 'normal', content: '', footer: '', attachments: [] }
})
const fileInput = ref(null)
const feedback = ref('')
const selectedViewReport = ref(null)

const filteredFullHistory = computed(() => {
    let results = history.value
    if (!history.value) return []
    if (inboxTab.value === 'pending') results = history.value.filter(h => h.status === 'PENDING' || h.status === 'รอตรวจสอบ')
    else if (inboxTab.value === 'reviewed') results = history.value.filter(h => h.status === 'REVIEWED')
    else if (inboxTab.value === 'returned') results = history.value.filter(h => h.status === 'RETURNED')
    return results
})

const viewReportLocal = async (id) => {
    try {
        const myRole = props.userRole || localStorage.getItem('userRole')
        const myName = localStorage.getItem('userName')
        const reports = await api.getReports({ role: myRole, submittedBy: myName })
        const selected = reports.find(r => r.id === id)
        if (selected) {
            selectedViewReport.value = {
                ...selected,
                type: selected.type || 'daily',
                date: (() => {
                    const d = new Date(selected.date);
                    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                })(),
                status: (selected.status || 'pending').toUpperCase(),
                submittedByRole: selected.submittedByRole,
                content: selected.title,
                description: selected.description || selected.content
            }
        }
    } catch (e) { console.error(e) }
}

const isTaskSubmission = computed(() => !!report.value.missionId)
const isReviewMode = computed(() => {
    const role = props.userRole || localStorage.getItem('userRole')
    const me = localStorage.getItem('userName')
    
    // Hierarchical Review Logic
    const isPending = (report.value.status === 'pending' || report.value.status === 'completed' || report.value.status === 'PENDING')
    
    if (role === 'lead') {
        return isPending && report.value.submittedByRole === 'pm' && report.value.submittedBy !== me
    }
    if (role === 'manager') {
        return isPending && (report.value.submittedByRole === 'lead' || report.value.submittedByRole === 'pm') && report.value.submittedBy !== me
    }
    return false
})

const resubmitLabel = computed(() => {
    if (report.value.status === 'returned') return 'ส่งรายงานครั้งที่ 2'
    return isTaskSubmission.value ? 'ส่งมอบงานที่เสร็จสมบูรณ์' : 'ยืนยันส่งรายงานเข้าสู่ระบบ'
})

const approveReport = async () => {
    if (!report.value.id) return
    try {
        if (isTaskSubmission.value) {
            await api.updateTask(report.value.missionId, { status: 'verified', editRequested: false })
            // Add comment if feedback exists
            if (feedback.value) await api.addComment(report.value.missionId, `[APPROVED] ${feedback.value}`, 'Manager')
        } else {
            await api.updateReport(report.value.id, { status: 'reviewed', feedback: feedback.value })
        }
        emit('notify', 'อนุมัติเรียบร้อยแล้ว')
        window.location.reload() // Simple refresh
    } catch (e) {
        console.error(e)
        alert('Failed to approve')
    }
}

const returnReport = async () => {
    if (!report.value.id) return
    if (!feedback.value) return alert('กรุณาระบุเหตุผลการส่งคืนแก้ไข')
    
    try {
        if (isTaskSubmission.value) {
            await api.updateTask(report.value.missionId, { editRequested: true })
            await api.addComment(report.value.missionId, `[RETURNED] ${feedback.value}`, 'Manager')
        } else {
            await api.updateReport(report.value.id, { status: 'returned', feedback: feedback.value })
        }
        emit('notify', 'ส่งคืนแก้ไขเรียบร้อยแล้ว')
        window.location.reload()
    } catch (e) {
        console.error(e)
        alert('Failed to return')
    }
}

// Watch for editing report changes
watch(() => props.editingReport, (newVal) => {
    feedback.value = '' 
    if (newVal) {
        report.value = {
            type: newVal.type || 'daily',
            priority: newVal.priority || 'normal', 
            content: newVal.content || newVal.title || '',
            footer: newVal.description || newVal.footer || '',
            id: newVal.id,
            missionId: newVal.missionId || (newVal.isTask ? newVal.id : null),
            feedback: newVal.feedback,
            attachments: newVal.attachments || [],
            submittedBy: newVal.submittedBy,
            submittedByRole: newVal.submittedByRole,
            status: newVal.status
        }
        currentView.value = 'form'
    } else {
        report.value = { type: 'daily', priority: 'normal', content: '', footer: '', attachments: [] }
    }
}, { immediate: true })

const handleWriteReport = () => {
    report.value = { type: 'daily', priority: 'normal', content: '', footer: '', attachments: [] }
    currentView.value = 'form'
}

const loadReportById = async (id) => {
    try {
        const reports = await api.getReports()
        const selected = reports.find(r => r.id === id)
        if (selected) {
            report.value = {
                type: selected.type || 'daily',
                priority: selected.priority || 'normal',
                content: selected.title,
                footer: selected.description || '',
                id: selected.id,
                feedback: selected.feedback,
                submittedByRole: selected.submittedByRole,
                attachments: selected.attachments || []
            }
            emit('notify', 'โหลดข้อมูลรายงานเพื่อแก้ไขแล้ว')
        }
    } catch (e) { console.error(e) }
}

const handleEditFromInbox = (reportData) => {
    report.value = {
        type: reportData.type || 'daily',
        priority: reportData.priority || 'normal',
        content: reportData.content,
        footer: reportData.footer === '-' ? '' : reportData.footer,
        id: reportData.id,
        feedback: reportData.feedback,
        submittedByRole: reportData.submittedByRole,
        attachments: reportData.attachments || []
    }
    currentView.value = 'form'
    emit('notify', 'เข้าสู่โหมดแก้ไขรายงานที่ถูกส่งกลับ')
}

const triggerFileUpload = () => {
    fileInput.value.click()
}

const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    files.forEach(file => {
        // In a real app, you would upload this file to a server here or Convert to Base64
        // For this demo, we store metadata
        report.value.attachments.push({
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file) // Create local preview URL
        })
    })
    // Reset input to allow selecting same file again
    event.target.value = ''
}

const removeFile = (index) => {
    report.value.attachments.splice(index, 1)
}

// ข้อมูลจำลองสำหรับประวัติรายงาน
// history moved to top

const fetchHistory = async () => {
    try {
        const myName = localStorage.getItem('userName')
        const myRole = props.userRole || localStorage.getItem('userRole')
        const reports = await api.getReports({ submittedBy: myName, role: myRole })
        if (reports) {
            // Filter only reports submitted by current user (real implementation would filter on backend or here)
            // For now, let's just show all or maybe filter by local name if we want strictness, 
            // but api usually returns all. Let's filter client side for better UX if needed.
            // Actually, let's show all for now to ensure we see the submission.
            history.value = reports.map(r => ({
                id: r.id,
                type: r.type,
                date: (() => {
                    const d = new Date(r.date);
                    const day = String(d.getDate()).padStart(2, '0');
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const year = d.getFullYear();
                    return `${day}/${month}/${year}`;
                })(),
                status: r.status ? r.status.toUpperCase() : 'PENDING',
                title: r.title ? (r.title.startsWith('Submission:') ? r.title.replace('Submission:', 'ส่งมอบงาน:') : r.title) : 'ไม่มีหัวข้อรายงาน'
            }))
        }
    } catch (e) {
        console.error("Failed to fetch history", e)
    }
}

onMounted(() => {
    fetchHistory()
})

const priorities = [
  { id: 'normal', label: 'ระดับปกติ' },
  { id: 'high', label: 'ด่วนพิเศษ 🔥' }
]

const checkPriority = () => {
  if (report.value.type === 'emergency') report.value.priority = 'high'
}

const setPriority = (id) => {
  if (report.value.type !== 'emergency') report.value.priority = id
}

const submitReport = async () => {
  try {
      // 1. Prepare Payload
      const payload = {
          type: report.value.type,
          title: report.value.content,
          description: report.value.footer,
          status: 'pending', // Reset status to pending
          date: new Date().toISOString(),
          submittedBy: localStorage.getItem('userName') || 'Unknown',
          submittedByRole: props.userRole || localStorage.getItem('userRole') || 'lead',
          dept: props.deptName || localStorage.getItem('deptName'),
          attachments: report.value.attachments,
          priority: report.value.priority ? report.value.priority.toLowerCase() : 'normal'
      }

      // 2. If editing, update existing report (Resubmission) to preserve feedback history
      if (report.value.id) {
          if (!payload.title.includes('(Resubmitted)')) {
             payload.title = `(Resubmitted) ${payload.title}`;
          }
          await api.updateReport(report.value.id, payload);
          emit('notify', 'แก้ไขและส่งรายงานกลับไปใหม่เรียบร้อยแล้ว!');
          
          // Update local history if needed
          const index = history.value.findIndex(h => h.id === report.value.id);
          if (index !== -1) {
              history.value[index] = { ...history.value[index], ...payload, status: 'PENDING' };
          }
      } else {
          // Create New
          const savedReport = await api.createReport(payload);
          if (savedReport) {
              history.value.unshift(savedReport.report || savedReport);
              emit('notify', 'รายงานถูกส่งไปให้ Manager แล้ว!');
          }
      }
      
      // Reset & Return to Inbox
      report.value = { type: 'daily', priority: 'normal', content: '', footer: '', attachments: [] };
      currentView.value = 'inbox'; // Go back to inbox after submit
  } catch (e) {
      console.error("Submit error", e)
      alert("Error submitting report")
  }
}

const getTypeClass = (type) => {
  const styles = {
    daily: 'bg-emerald-100 text-emerald-600',
    weekly: 'bg-blue-100 text-blue-600',
    emergency: 'bg-rose-100 text-rose-600'
  }
  return styles[type] || 'bg-slate-100 text-slate-600'
}

const accentColor = computed(() => {
  const colors = { daily: 'bg-emerald-500', weekly: 'bg-blue-500', emergency: 'bg-rose-500' }
  return colors[report.value.type]
})

const dynamicLabels = computed(() => {
  const configs = {
    daily: { main: 'สรุปผลการดำเนินงานรายวัน', placeholderMain: 'ระบุภารกิจที่สำเร็จวันนี้...', footer: 'ปัญหาและอุปสรรค', placeholderFooter: 'ระบุสิ่งที่ต้องการให้ช่วยแก้ไข...' },
    weekly: { main: 'สรุปผลงานรายสัปดาห์', placeholderMain: 'วิเคราะห์สถิติภาพรวมสัปดาห์นี้...', footer: 'แผนงานสัปดาห์หน้า', placeholderFooter: 'ระบุ Roadmap สัปดาห์ถัดไป...' },
    emergency: { main: 'รายละเอียดเหตุการณ์วิกฤติ', placeholderMain: 'ระบุสิ่งที่เกิดขึ้นและสาเหตุ...', footer: 'การดำเนินงานแก้ไขเบื้องต้น', placeholderFooter: 'ระบุสิ่งที่ดำเนินการไปแล้วด่วน...' }
  }
  return configs[report.value.type]
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
.animate-fade-up {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
