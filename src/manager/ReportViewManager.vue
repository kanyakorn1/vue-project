<template>
  <div class="space-y-10 animate-fade-up text-left">
    <div class="flex items-end gap-4">
      <div :class="[accentColor, 'w-2 h-12 rounded-full transition-colors duration-500']"></div>
      <div>
         <!-- Title for Manager View -->
        <h2 class="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">กล่องรับรายงาน</h2>
        <p class="text-slate-400 text-xs font-bold uppercase mt-2 tracking-[0.2em]">ตรวจสอบรายงานการปฏิบัติงานจากทีมงาน</p>
      </div>
    </div>

    <div class="grid gap-10 transition-all duration-500" :class="viewAll ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'">
      <!-- Left Column: Inbox List (Now Left) -->
      <div class="space-y-6">

        <div class="bg-white rounded-[2rem] px-6 py-6 border border-slate-100 shadow-xl shadow-slate-200/50 text-left h-fit transition-all duration-500">
          <div class="flex items-center gap-4 mb-6 border-b border-slate-50 pb-4 overflow-x-auto scrollbar-hide flex-nowrap">
               <button @click="currentTab = 'new'" :class="['text-[10px] font-black uppercase tracking-normal transition-colors flex items-center gap-2 whitespace-nowrap', currentTab === 'new' ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-500']">
                 งานใหม่
                 <span v-if="history.filter(h => h.status === 'PENDING').length" class="bg-emerald-500 text-white px-1.5 py-0.5 rounded-md text-[8px]">{{ history.filter(h => h.status === 'PENDING').length }}</span>
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
          
          <div :class="['space-y-4 overflow-y-auto scrollbar-hide transition-all duration-500', viewAll ? '' : 'max-h-[400px]']">
            <div v-for="item in filteredHistory" :key="item.id" @click="selectedReport = item"
              class="group p-5 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden"
              :class="selectedReport?.id === item.id ? 'bg-[#0f172a] border-[#0f172a] shadow-xl' : 'bg-slate-50 border-transparent hover:border-slate-200 hover:bg-white'">
              
              <div v-if="selectedReport?.id === item.id" class="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-bl-full -mr-10 -mt-10"></div>

              <div class="flex justify-between items-start mb-2 relative">
                <span :class="['text-[9px] font-black px-3 py-1 rounded-full uppercase', getTypeClass(item.type)]">
                  {{ item.type === 'daily' ? 'รายวัน' : item.type === 'weekly' ? 'รายสัปดาห์' : 'ฉุกเฉิน' }}
                </span>
                <span :class="['text-[9px] font-bold uppercase italic', selectedReport?.id === item.id ? 'text-slate-400' : 'text-slate-300']">{{ item.date }}</span>
              </div>
              <p :class="['text-xs font-bold line-clamp-2 mb-2 leading-relaxed', selectedReport?.id === item.id ? 'text-white' : 'text-slate-800']">
                 {{ item.title }}
              </p>
              <div class="flex items-center justify-between mt-3">
                 <div class="flex items-center gap-2">
                    <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.author}`" class="w-5 h-5 rounded-full bg-slate-200">
                    <span :class="['text-[9px] font-black uppercase tracking-tighter', selectedReport?.id === item.id ? 'text-slate-400' : 'text-slate-400']">{{ item.author }}</span>
                 </div>
                 <div v-if="item.status === 'PENDING'" class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
              </div>
            </div>

            <div v-if="filteredHistory.length === 0" class="py-10 text-center opacity-30">
              <i class="fas fa-folder-open text-2xl mb-2"></i>
              <p class="text-[10px] font-black uppercase">ไม่พบรายงานในหมวดหมู่นี้</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Report Details (Read Only) -->
      <div v-if="!viewAll" class="lg:col-span-2 space-y-6">
        <div class="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8 min-h-[600px] relative">
          
          <div v-if="selectedReport">
            <div class="flex justify-between items-start mb-8 border-b border-slate-50 pb-6">
               <div>
                  <span :class="['text-[10px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest', getTypeClass(selectedReport.type)]">
                    {{ selectedReport.type === 'daily' ? 'รายวัน' : selectedReport.type === 'weekly' ? 'รายสัปดาห์' : 'ฉุกเฉิน' }}
                  </span>
                  <h3 class="text-2xl font-black text-slate-800 mt-4 leading-tight">{{ selectedReport.title }}</h3>
                  <div class="flex items-center gap-3 mt-2">
                    <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedReport.author}`" class="w-6 h-6 rounded-full bg-slate-100">
                    <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Submitted by <span class="text-indigo-500">{{ selectedReport.author }}</span> • {{ selectedReport.date }}</p>
                  </div>
               </div>
               <div :class="['px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border', selectedReport.priority === 'high' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100']">
                 PRIORITY: {{ selectedReport.priority }}
               </div>
            </div>

            <div class="space-y-8">
              <div class="space-y-3">
                <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-widest">{{ dynamicLabels.main }}</label>
                <div class="w-full px-8 py-7 bg-slate-50/50 border-2 border-slate-50 rounded-[2.5rem] text-sm font-bold text-slate-700 leading-relaxed shadow-inner">
                  {{ selectedReport.content || 'ไม่ระบุรายละเอียด' }}
                </div>
              </div>

              <div class="space-y-3">
                <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-widest">{{ dynamicLabels.footer }}</label>
                <div class="w-full px-8 py-6 bg-slate-50/50 border-2 border-slate-50 rounded-[2.5rem] text-sm font-bold text-slate-700 leading-relaxed shadow-inner">
                   {{ selectedReport.footer || '-' }}
                </div>
              </div>

              <div class="space-y-3">
                <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-widest">หลักฐานประกอบการดำเนินงาน</label>
                <div v-if="selectedReport.attachments && selectedReport.attachments.length > 0" class="grid grid-cols-1 gap-3">
                   <div v-for="(file, idx) in selectedReport.attachments" :key="idx" class="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                      <div class="w-12 h-12 bg-white text-indigo-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <i class="fas fa-file-image text-lg" v-if="file.type?.includes('image')"></i>
                          <i class="fas fa-file-pdf text-lg" v-else-if="file.type?.includes('pdf')"></i>
                          <i class="fas fa-file-alt text-lg" v-else></i>
                      </div>
                      <div class="min-w-0 flex-1">
                          <p class="text-xs font-black text-slate-700 truncate">{{ file.name }}</p>
                          <p class="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{{ (file.size / 1024).toFixed(1) }} KB</p>
                      </div>
                      <a :href="file.url || '#'" target="_blank" class="w-10 h-10 rounded-full bg-white text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors shadow-sm">
                          <i class="fas fa-download"></i>
                      </a>
                   </div>
                </div>
                <div v-else class="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center opacity-50">
                   <i class="fas fa-paperclip text-2xl mb-2 text-slate-300"></i>
                   <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">ไม่มีหลักฐานแนบ</p>
                </div>
              </div>


              <!-- 🕒 Report History (Previous Versions) -->
              <div v-if="selectedReport?.reportHistory && selectedReport.reportHistory.length > 0" class="space-y-4 pt-10 border-t border-slate-50">
                  <label class="text-[11px] font-black text-indigo-500 uppercase tracking-widest ml-5">ประวัติการแก้ไขงาน (Previous Versions)</label>
                  <div class="space-y-4">
                      <div v-for="(version, vIdx) in selectedReport.reportHistory" :key="vIdx" class="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-md group">
                         <div class="flex flex-col gap-2 mb-4 border-b border-indigo-50 pb-3">
                             <div class="flex justify-between items-center">
                                  <span class="text-[10px] font-black uppercase tracking-wider text-indigo-400/70 flex items-center gap-1">
                                      <i class="fas fa-history"></i> {{ new Date(version.editedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }}
                                  </span>
                                  <span class="bg-white px-2.5 py-1 rounded-lg text-[9px] font-black text-slate-300 uppercase border border-slate-50 shadow-sm">Round {{ vIdx + 1 }}</span>
                             </div>
                         </div>
                         
                         <div class="space-y-4">
                             <div class="space-y-1">
                                 <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest">ข้อมูลการส่งงาน</label>
                                 <p class="text-xs font-bold text-slate-700 leading-relaxed">{{ version.title || version.content }}</p>
                             </div>
                             
                             <div v-if="version.description && version.description !== '-'" class="space-y-1 pt-2 border-t border-slate-100/50">
                                 <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest">ข้อมูลเพิ่มเติม</label>
                                 <p class="text-[10px] text-slate-500 font-bold leading-relaxed">{{ version.description }}</p>
                             </div>

                             <div v-if="version.attachments && version.attachments.length > 0" class="flex flex-wrap gap-2 pt-2 border-t border-slate-100/50">
                                  <div v-for="(file, fIdx) in version.attachments" :key="fIdx" class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl">
                                      <i class="fas fa-paperclip text-[8px] text-indigo-300"></i>
                                      <span class="text-[9px] font-bold text-slate-500 truncate max-w-[120px]">{{ file.name }}</span>
                                  </div>
                             </div>
                         </div>

                         <div v-if="version.feedback" class="mt-4 bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50 flex items-start gap-3">
                              <i class="fas fa-comment-dots text-rose-300 text-xs mt-1"></i>
                              <div class="min-w-0">
                                   <p class="text-[8px] font-black text-rose-400 uppercase tracking-wider mb-1">MANAGER FEEDBACK</p>
                                   <p class="text-[10px] text-rose-800 font-bold leading-relaxed">{{ version.feedback }}</p>
                              </div>
                         </div>
                      </div>
                  </div>
              </div>

              <!-- Current Feedback (If exists) -->
              <div v-if="selectedReport.feedback && selectedReport.status === 'RETURNED'" class="space-y-4 pt-6 border-t border-slate-50">
                <label class="text-[11px] font-black text-rose-500 uppercase ml-5 tracking-widest animate-pulse">สิ่งที่ต้องแก้ไขปัจจุบัน</label>
                <div class="w-full px-8 py-6 bg-rose-50 border-2 border-rose-100 rounded-[2.5rem] text-sm font-bold text-rose-700 leading-relaxed shadow-sm">
                   {{ selectedReport.feedback }}
                </div>
              </div>
            </div>
            
            <div class="mt-10 pt-8 border-t border-slate-50 flex justify-end gap-4">
                <button @click="showRequestModal = true" class="px-8 py-4 bg-slate-100 text-slate-400 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">
                  Request Info
                </button>
                <button @click="markAsReviewed" class="px-8 py-4 bg-[#0f172a] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-slate-200">
                  <i class="fas fa-check-circle mr-2"></i> Mark as Reviewed
                </button>
            </div>
          </div>

          <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-center opacity-30">
            <i class="fas fa-inbox text-6xl mb-4 text-slate-300"></i>
            <p class="text-lg font-black text-slate-400 uppercase tracking-widest">Select a report to view details</p>
          </div>

        </div>
      </div>
    </div>
    <Transition name="modal">
      <div v-if="showRequestModal" class="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
        <div class="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative text-left animate-pop">
          <h3 class="text-2xl font-black text-slate-900 uppercase mb-2 italic tracking-tighter">Request Information</h3>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Send a message to {{ selectedReport?.author }}</p>
          
          <textarea v-model="requestMessage" rows="4" placeholder="ระบุสิ่งที่ต้องการเพิ่มเติม..." class="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none font-bold text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:border-indigo-500/30 transition-all"></textarea>
          
          <div class="flex gap-4 mt-8">
            <button @click="sendRequest" class="flex-1 py-4 bg-[#5c56f0] text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">
              Send Request
            </button>
             <button @click="showRequestModal = false" class="flex-1 py-4 bg-slate-100 text-slate-400 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import api from '@/api'
import { ref, computed, onMounted } from 'vue'

const props = defineProps(['userEmail', 'allStaff'])
const emit = defineEmits(['notify'])

const selectedReport = ref(null)
const showRequestModal = ref(false)
const requestMessage = ref('')
const viewAll = ref(false)
// Updated default to 'new' to show new works/pending items first
const currentTab = ref('new')
const isLoading = ref(true)

const sendRequest = async () => {
  if (requestMessage.value) {
    try {
        await api.updateReport(selectedReport.value.id, {
            status: 'returned',
            feedback: requestMessage.value
        })
        
        // Update local status
        selectedReport.value.status = 'RETURNED'
        selectedReport.value.footer = requestMessage.value // Update view immediately
        
        emit('notify', `ส่งคำขอข้อมูลเพิ่มเติมถึง ${selectedReport.value.author} เรียบร้อยแล้ว`)
        showRequestModal.value = false
        requestMessage.value = ''
        
        // Refresh list
        await fetchReports()
    } catch (e) {
        console.error("Failed to return report", e)
        emit('notify', { message: 'ระบบมีปัญหาในการส่งคืนรายงานครับ', type: 'error' })
    }
  } else {
    emit('notify', 'กรุณาระบุข้อความก่อนส่ง')
  }
}

const markAsReviewed = async () => {
  if (!selectedReport.value) return
  try {
    await api.updateReport(selectedReport.value.id, {
      status: 'reviewed'
    })
    
    // Update local state
    selectedReport.value.status = 'REVIEWED'
    emit('notify', `รายงานเรื่อง "${selectedReport.value.title}" ได้รับการตรวจสอบแล้ว`)
    
    // Refresh list
    await fetchReports()
    selectedReport.value = null // Close detail view after action
  } catch (e) {
    console.error("Failed to review report", e)
    emit('notify', { message: 'ระบบมีปัญหาในการยืนยันรายการครับ', type: 'error' })
  }
}

const history = ref([])

onMounted(async () => {
  await fetchReports()
})

const fetchReports = async () => {
    isLoading.value = true
    try {
        // Fetch All reports (Bypass strict backend role check)
        const reports = await api.getReports({}) || []
        
        // Helper to check if reporter is a Lead (Robust check)
        const isLead = (r) => {
            // 1. Direct Role Tag Check
            if (r.submittedByRole && ['lead', 'head'].includes(r.submittedByRole.toLowerCase())) return true;
            
            // 2. Dynamic Lookup in Staff List (Fallback)
            if (props.allStaff && props.allStaff.length > 0) {
                 const staff = props.allStaff.find(s => s.name === r.submittedBy || s.username === r.submittedBy);
                 if (staff && (staff.role?.toLowerCase() === 'lead' || staff.position?.toLowerCase().includes('lead'))) return true;
            }
            return false;
        }

        // Apply Robust Lead Filter
        history.value = reports.filter(r => isLead(r)).map(r => ({
            id: r.id,
            type: r.type || 'daily',
            title: r.title ? (r.title.startsWith('Submission:') ? r.title.replace('Submission:', 'ส่งมอบงาน:') : r.title) : 'ไม่มีหัวข้อรายงาน',
            date: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
            status: (r.status || 'pending').toUpperCase(),
            author: r.submittedBy || 'UNKNOWN',
            submittedByRole: r.submittedByRole,
            image: r.attachments && r.attachments.length > 0 ? r.attachments[0].url : null,
            content: r.content || r.title || 'ไม่มีเนื้อหา',
            footer: r.description || '-',
            feedback: r.feedback || '',
            attachments: r.attachments || [],
            reportHistory: r.reportHistory || []
        }))

        
        // Select the first item if available
        if (history.value.length > 0) {
            // selectedReport.value = history.value[0]
        }
    } catch (e) {
        console.error("Failed to fetch reports", e)
    } finally {
        isLoading.value = false
    }
}

const filteredHistory = computed(() => {
  if (currentTab.value === 'returned') {
    return history.value.filter(h => h.status === 'RETURNED')
  }
  if (currentTab.value === 'reviewed') {
    return history.value.filter(h => h.status === 'REVIEWED')
  }
  if (currentTab.value === 'new') {
    return history.value.filter(h => h.status === 'PENDING')
  }
  return history.value
})

const getTypeClass = (type) => {
  const styles = {
    daily: 'bg-emerald-100 text-emerald-600',
    weekly: 'bg-blue-100 text-blue-600',
    emergency: 'bg-rose-100 text-rose-600'
  }
  return styles[type] || 'bg-slate-100 text-slate-600'
}

const accentColor = computed(() => {
  if (!selectedReport.value) return 'bg-slate-300'
  const colors = { daily: 'bg-emerald-500', weekly: 'bg-blue-500', emergency: 'bg-rose-500' }
  return colors[selectedReport.value.type]
})

const dynamicLabels = computed(() => {
  if (!selectedReport.value) return {}
  const configs = {
    daily: { main: 'สรุปผลการดำเนินงานรายวัน', footer: 'ปัญหาและอุปสรรค' },
    weekly: { main: 'สรุปผลงานรายสัปดาห์', footer: 'แผนงานสัปดาห์หน้า' },
    emergency: { main: 'รายละเอียดเหตุการณ์วิกฤติ', footer: 'การดำเนินงานแก้ไขเบื้องต้น' }
  }
  return configs[selectedReport.value.type]
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
@keyframes pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-pop { animation: pop 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67); }
</style>
