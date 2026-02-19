<template>
  <div class="min-h-full flex flex-col space-y-8 animate-fade-up text-left">
    
    <!-- Header with Toggle Back Button -->
    <div class="flex items-center justify-between shrink-0">
       <div class="flex items-center gap-6">
          <div class="flex items-end gap-4">
            <div class="w-2 h-12 rounded-full bg-slate-900 transition-colors duration-500"></div>
            <div>
              <h2 class="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-relaxed">
                  {{ currentTab === 'all' ? 'รายงาน' : 'กล่องรับรายงาน' }}
              </h2>
              <p class="text-slate-400 text-xs font-bold uppercase mt-2 tracking-[0.2em]">
                  {{ currentTab === 'all' ? 'ตรวจสอบประวัติการส่งรายงานทั้งหมดที่บันทึกไว้ในระบบ' : 'ตรวจสอบรายงานการปฏิบัติงานจากทีมงาน' }}
              </p>
            </div>
          </div>
       </div>

       <!-- 🔥 Action Buttons (Outer Header - Top Right) -->
       <div class="flex items-center gap-3">
           <button @click="emit('show-history')" class="group flex items-center gap-4 bg-white hover:bg-slate-50 px-6 py-3 rounded-full shadow-lg transition-all active:scale-95 border border-slate-100">
               <div class="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                   <i class="fas fa-history text-lg"></i>
               </div>
               <div class="text-left pr-2">
                   <p class="text-[12px] font-black text-slate-700 uppercase tracking-tight">ประวัติรายงาน</p>
               </div>
           </button>

           <button @click="emit('write-report')" class="group flex items-center gap-4 bg-[#121926] hover:bg-[#1a2333] px-6 py-3 rounded-full shadow-2xl transition-all active:scale-95 border border-slate-800">
               <div class="w-10 h-10 bg-[#1e2738] rounded-2xl flex items-center justify-center text-[#5c56f0] group-hover:bg-indigo-500/20 transition-colors">
                   <i class="fas fa-file-signature text-lg"></i>
               </div>
               <div class="text-left pr-2">
                   <p class="text-[12px] font-black text-white uppercase tracking-tight">เขียนรายงานสรุปผล</p>
               </div>
           </button>
       </div>
    </div>

    <div class="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Inbox List -->
      <div class="flex flex-col min-h-0">
        <div class="bg-white rounded-3xl px-6 py-6 border border-slate-100 shadow-xl shadow-slate-200/50 text-left flex flex-col flex-1 min-h-0">
          <div class="flex items-center gap-4 mb-6 shrink-0 border-b border-slate-50 pb-4 overflow-x-auto scrollbar-hide flex-nowrap">
                <button @click="currentTab = 'all'" :class="['text-[10px] font-black uppercase tracking-normal transition-colors flex items-center gap-2 whitespace-nowrap', currentTab === 'all' ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-500']">
                  ทั้งหมด
                </button>
                <div class="h-3 w-[1px] bg-slate-200 shrink-0"></div>
                <button @click="currentTab = 'new'" :class="['text-[10px] font-black uppercase tracking-normal transition-colors flex items-center gap-2 whitespace-nowrap', currentTab === 'new' ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-500']">
                  งานใหม่
                  <span v-if="history.filter(h => h.status === 'PENDING').length" class="bg-indigo-500 text-white px-1.5 py-0.5 rounded-md text-[8px]">{{ history.filter(h => h.status === 'PENDING').length }}</span>
                </button>
               <div class="h-3 w-[1px] bg-slate-200 shrink-0"></div>
               <button @click="currentTab = 'reviewed'" :class="['text-[10px] font-black uppercase tracking-normal transition-colors flex items-center gap-2 whitespace-nowrap', currentTab === 'reviewed' ? 'text-slate-800' : 'text-slate-300 hover:text-slate-500']">
                 ตรวจสอบแล้ว
               </button>
               <div class="h-3 w-[1px] bg-slate-200 shrink-0"></div>
               <button @click="currentTab = 'returned'" :class="['text-[10px] font-black uppercase tracking-normal transition-colors flex items-center gap-2 whitespace-nowrap', currentTab === 'returned' ? 'text-rose-500' : 'text-slate-300 hover:text-slate-500']">
                 ส่งกลับแก้ไข
                 <span v-if="history.filter(h => h.status === 'RETURNED').length" class="bg-rose-500 text-white px-1.5 py-0.5 rounded-md text-[8px]">{{ history.filter(h => h.status === 'RETURNED').length }}</span>
               </button>
          </div>
          
          <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            <div v-for="item in filteredHistory" :key="item.id" @click="selectedReport = item"
              class="group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden"
              :class="selectedReport?.id === item.id ? 'bg-[#0f172a] border-[#0f172a] shadow-xl shadow-slate-200' : 'bg-slate-50 border-transparent hover:border-indigo-100 hover:bg-white'">
              
              <div class="flex justify-between items-start mb-3 relative text-left">
                <span :class="['text-[9px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest', getTypeClass(item.type)]">
                  {{ translateType(item.type) }}
                </span>
                <span :class="['text-[9px] font-bold uppercase italic', selectedReport?.id === item.id ? 'text-slate-400' : 'text-slate-300']">
                  {{ item.date }}
                </span>
              </div>
              <p :class="['text-xs font-black line-clamp-2 mb-4 leading-relaxed uppercase tracking-tight text-left', selectedReport?.id === item.id ? 'text-white' : 'text-slate-800']">
                 {{ item.title }}
              </p>
              <div class="flex items-center justify-between">
                 <div class="flex items-center gap-3">
                    <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.author}`" class="w-6 h-6 rounded-xl bg-slate-200 shadow-sm">
                    <span :class="['text-[9px] font-black uppercase tracking-widest', selectedReport?.id === item.id ? 'text-slate-400' : 'text-slate-400']">{{ item.author }}</span>
                 </div>
                 <div v-if="item.status === 'PENDING'" class="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-lg shadow-rose-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Detail View -->
      <div class="lg:col-span-2 flex flex-col min-h-0">
        <div class="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col flex-1 overflow-hidden relative">
          
          <div v-if="selectedReport" class="flex flex-col flex-1 overflow-hidden">
            <!-- Detail Header -->
            <div class="px-10 py-6 border-b border-slate-50 shrink-0 text-left">
                <div class="flex items-center gap-3">
                   <span :class="['text-[9px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest', getTypeClass(selectedReport.type)]">
                     {{ translateType(selectedReport.type) }}
                   </span>
                   <div :class="['px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm', selectedReport.priority === 'high' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100']">
                    ความสำคัญ: {{ translatePriority(selectedReport.priority) }}
                  </div>
                </div>
            </div>

            <!-- Detail Content -->
            <div class="flex-1 overflow-y-auto custom-scrollbar px-10 py-8 space-y-10 text-left">
              <!-- Feedback Reason for RETURNED status -->
              <div v-if="selectedReport.status === 'RETURNED' && selectedReport.feedback" class="space-y-4 text-left">
                <label class="text-[10px] font-black text-rose-400 uppercase ml-2 tracking-widest leading-none">เหตุผลที่ถูกส่งกลับ</label>
                <div class="w-full px-8 py-6 bg-rose-50 border border-rose-100 rounded-[2.5rem] text-xs font-bold text-rose-800 leading-relaxed shadow-sm flex items-start gap-4">
                  <div class="w-10 h-10 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center shrink-0">
                    <i class="fas fa-exclamation-circle text-lg"></i>
                  </div>
                  <div class="pt-1">
                    <p class="text-rose-900 font-black mb-1 uppercase text-[10px] tracking-tight">ความคิดเห็นจากผู้จัดการ</p>
                    <p class="text-rose-700 leading-relaxed opacity-80">{{ selectedReport.feedback }}</p>
                  </div>
                </div>
              </div>

              <!-- 🌟 Report Rounds Display (History & Current) -->
              <div class="space-y-8">
                  <!-- Latest Round (Current) -->
                  <div class="relative">
                      <div class="absolute -top-3 left-4 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 z-10 flex items-center gap-2">
                          <span>รอบการส่งที่ {{ (selectedReport.reportHistory?.length || 0) + 1 }}</span>
                          <span class="opacity-75 font-normal">({{ selectedReport.date }})</span>
                      </div>
                      <div class="bg-emerald-50/50 border border-emerald-100/50 rounded-[2.5rem] p-8 pt-10 space-y-6 relative overflow-hidden">
                          <!-- Progress indicator mock -->
                          <div class="absolute top-6 right-6 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-emerald-100">
                               <div class="w-16 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                                   <div class="h-full bg-emerald-500 w-full rounded-full"></div>
                               </div>
                               <span class="text-[9px] font-black text-emerald-600">100%</span>
                          </div>

                          <div class="space-y-2">
                              <label class="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                  <i class="fas fa-file-alt"></i> ข้อมูลการส่งงานจากพนักงาน
                              </label>
                              <p class="text-sm font-bold text-slate-700 leading-relaxed">{{ selectedReport.content || 'ไม่มีข้อมูลรายละเอียด' }}</p>
                          </div>
                          
                          <div v-if="selectedReport.footer && selectedReport.footer !== '-'" class="space-y-2 pt-4 border-t border-emerald-100/50">
                              <label class="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                  <i class="fas fa-info-circle"></i> ข้อมูลเพิ่มเติม
                              </label>
                              <p class="text-xs font-bold text-slate-600 leading-relaxed">{{ selectedReport.footer }}</p>
                          </div>

                           <div v-if="selectedReport.attachments && selectedReport.attachments.length > 0" class="flex flex-wrap gap-3 pt-2">
                                <div v-for="(file, idx) in selectedReport.attachments" :key="idx" class="flex items-center gap-3 px-4 py-2.5 bg-white border border-emerald-100/50 rounded-xl shadow-sm">
                                    <div class="w-6 h-6 bg-emerald-100 text-emerald-500 rounded-lg flex items-center justify-center text-[10px]">
                                        <i class="fas fa-file"></i>
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-[10px] font-bold text-slate-700 max-w-[150px] truncate">{{ file.name }}</span>
                                        <span class="text-[8px] font-bold text-slate-400 uppercase">{{ (file.size/1024).toFixed(1) }} KB</span>
                                    </div>
                                    <a :href="file.url" target="_blank" class="text-emerald-400 hover:text-emerald-600 ml-1"><i class="fas fa-download"></i></a>
                                </div>
                           </div>
                      </div>
                  </div>

                  <!-- Previous Rounds (History) -->
                  <div v-for="(version, idx) in [...(selectedReport.reportHistory || [])].reverse()" :key="idx" class="relative opacity-80 hover:opacity-100 transition-opacity">
                      <div class="absolute -top-3 left-4 bg-slate-200 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest z-10">
                          รอบการส่งที่ {{ (selectedReport.reportHistory.length) - idx }} <span class="font-normal opacity-75">({{ new Date(version.editedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'}) }})</span>
                      </div>
                      <div class="bg-slate-50/50 border border-slate-200/50 rounded-[2.5rem] p-8 pt-10 space-y-5 grayscale-[0.5] hover:grayscale-0 transition-all">
                          <!-- Main Content -->
                          <div class="space-y-2">
                              <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                  <i class="fas fa-file-alt"></i> ข้อมูลการส่งงาน
                              </label>
                              <p class="text-xs font-bold text-slate-600 leading-relaxed">{{ version.title || version.content }}</p>
                          </div>

                          <!-- Description/Footer -->
                          <div v-if="version.description && version.description !== '-'" class="space-y-2 pt-3 border-t border-slate-200/50">
                              <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                  <i class="fas fa-info-circle"></i> ข้อมูลเพิ่มเติม
                              </label>
                              <p class="text-[10px] font-bold text-slate-500 leading-relaxed">{{ version.description }}</p>
                          </div>

                          <!-- Attachments -->
                          <div v-if="version.attachments && version.attachments.length > 0" class="flex flex-wrap gap-2 pt-3 border-t border-slate-200/50">
                                <div v-for="(file, fIdx) in version.attachments" :key="fIdx" class="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm opacity-75">
                                    <div class="w-6 h-6 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center text-[10px]">
                                        <i class="fas fa-file"></i>
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-[9px] font-bold text-slate-700 max-w-[120px] truncate">{{ file.name }}</span>
                                        <span class="text-[8px] font-bold text-slate-400 uppercase">{{ (file.size/1024).toFixed(1) }} KB</span>
                                    </div>
                                    <a :href="file.url" target="_blank" class="text-slate-300 hover:text-slate-500 ml-1"><i class="fas fa-download text-[10px]"></i></a>
                                </div>
                          </div>
                          
                           <!-- Previous Feedback -->
                           <div v-if="version.feedback" class="mt-2 bg-rose-50 p-3 rounded-2xl border border-rose-100 flex items-start gap-3">
                                <i class="fas fa-comment-dots text-rose-300 text-xs mt-1"></i>
                                <div class="min-w-0">
                                     <p class="text-[8px] font-black text-rose-300 uppercase tracking-wider mb-0.5">FEEDBACK รอบนี้</p>
                                     <p class="text-[10px] text-rose-700 font-bold leading-relaxed">{{ version.feedback }}</p>
                                </div>
                           </div>
                      </div>
                  </div>
              </div>



               <!-- Feedback Section (Only for Lead reviewing others) -->
               <div v-if="!isMyReport && selectedReport.status === 'PENDING'" class="space-y-4 px-2 pt-6 border-t border-slate-50">
                <label class="text-[10px] font-black text-indigo-500 uppercase ml-2 tracking-widest">ความคิดเห็นสำหรับการตรวจสอบ</label>
                <textarea v-model="reviewFeedback" placeholder="ระบุเหตุผลหากต้องการให้ส่งกลับแก้ไข หรือข้อความชื่นชม..." class="w-full px-8 py-5 bg-slate-50 border border-slate-100/50 rounded-[2rem] text-xs font-bold text-slate-700 leading-relaxed shadow-inner outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none h-24"></textarea>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="px-10 py-8 border-t border-slate-50 flex justify-end gap-4 shrink-0 bg-white/50 backdrop-blur-sm">
                <!-- If it's the user's own report that was returned -->
                 <button v-if="isMyReport && selectedReport.status === 'RETURNED'" @click="$emit('edit', selectedReport)" class="px-12 py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase text-[11px] tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 border border-indigo-500 active:scale-95">
                   <i class="fas fa-edit mr-3"></i> แก้ไขและส่งรายงานใหม่
                 </button>
 
                 <button v-if="!isMyReport && (selectedReport.status === 'PENDING' || selectedReport.status === 'REVIEWED')" @click="updateStatus('returned')" class="px-8 py-4 bg-white text-rose-500 border border-rose-100 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-50 transition-all flex items-center gap-2">
                   <i class="fas fa-undo-alt"></i> ส่งกลับแก้ไข
                 </button>
                 <button v-if="!isMyReport && (selectedReport.status === 'PENDING' || selectedReport.status === 'RETURNED')" @click="updateStatus('reviewed')" class="px-10 py-4 bg-[#0f172a] text-white rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-slate-200 border border-slate-800 flex items-center gap-2">
                   <i class="fas fa-check-circle text-emerald-400"></i> ตรวจสอบแล้ว
                 </button>
            </div>
          </div>

          <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-center p-10 bg-slate-50/20">
              <div class="relative opacity-20 group">
                <div class="w-40 h-40 bg-white rounded-full flex items-center justify-center text-slate-200 text-6xl border border-slate-100 shadow-inner group-hover:scale-110 transition-transform">
                   <i class="fas fa-inbox"></i>
                </div>
              </div>
              <p class="text-xl font-black text-slate-300 uppercase tracking-[0.2em] italic mt-8 opacity-40">เลือกรายงานเพื่อดูรายละเอียด</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import api from '@/api'

const props = defineProps(['userRole', 'defaultTab'])
const emit = defineEmits(['go-back', 'notify', 'write-report', 'edit', 'show-history'])

const history = ref([])
const selectedReport = ref(null)
const currentTab = ref(props.defaultTab || 'all')
const reviewFeedback = ref('')
    
// Watch for prop changes from parent
watch(() => props.defaultTab, (newTab) => {
    if (newTab) currentTab.value = newTab
})

const fetchReports = async () => {
  try {
    const role = props.userRole || localStorage.getItem('userRole')
    const myName = localStorage.getItem('userName')
    const data = await api.getReports({ role, submittedBy: myName }) || []
    let processedData = data.map(r => ({
      ...r,
      id: r.id,
      type: r.type || 'daily',
      priority: r.priority || 'normal',
      title: r.title ? (r.title.startsWith('Submission:') ? r.title.replace('Submission:', 'ส่งมอบงาน:') : r.title) : 'ไม่มีหัวข้อรายงาน',
      date: new Date(r.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }),
      status: (r.status || 'pending').toUpperCase(),
      author: r.submittedBy || 'UNKNOWN',
      content: r.title || r.content || 'ไม่มีเนื้อหา', // Fix: Use title (main content) instead of description
      footer: r.description || '-',
      feedback: r.feedback || '',
      submittedByRole: r.submittedByRole,
      reportHistory: r.reportHistory || []
    }))

    // Filter: If Lead, show only reports from PMs (and their own reports if any)
    if (role === 'lead') {
      // Allow PM reports OR My reports OR Reports with role 'lead' (assuming they are mine)
      processedData = processedData.filter(r => 
          r.submittedByRole === 'pm' || 
          r.submittedBy === myName || 
          (r.submittedByRole && ['lead', 'head'].includes(r.submittedByRole.toLowerCase()))
      )
    }
    history.value = processedData
  } catch (e) { console.error(e) }
}

const isMyReport = computed(() => {
  if (!selectedReport.value) return false
  return selectedReport.value.author === localStorage.getItem('userName')
})

onMounted(fetchReports)

const filteredHistory = computed(() => {
  if (currentTab.value === 'all') return history.value
  if (currentTab.value === 'new') return history.value.filter(h => h.status === 'PENDING')
  if (currentTab.value === 'reviewed') return history.value.filter(h => h.status === 'REVIEWED')
  if (currentTab.value === 'returned') return history.value.filter(h => h.status === 'RETURNED')
  return history.value
})

const translateType = (type) => {
  const mapping = {
    daily: 'รายงานรายวัน',
    weekly: 'รายงานสัปดาห์',
    emergency: 'รายงานฉุกเฉิน',
    task: 'งานปฏิบัติการ'
  }
  return mapping[type] || type
}

const translatePriority = (priority) => {
  const mapping = {
    high: 'สูงมาก',
    normal: 'ปกติ',
    low: 'ต่ำ'
  }
  return mapping[priority] || priority
}

const getTypeClass = (type) => {
  const styles = { daily: 'bg-emerald-100 text-emerald-600', weekly: 'bg-indigo-100 text-indigo-600', emergency: 'bg-rose-100 text-rose-600' }
  return styles[type] || 'bg-slate-100 text-slate-600'
}

const updateStatus = async (status) => {
  if (!selectedReport.value) return
  try {
    await api.updateReport(selectedReport.value.id, { status, feedback: reviewFeedback.value })
    emit('notify', `Report updated to ${status.toUpperCase()}`)
    await fetchReports()
    selectedReport.value = null
    reviewFeedback.value = ''
  } catch (e) { alert("Action failed") }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>
