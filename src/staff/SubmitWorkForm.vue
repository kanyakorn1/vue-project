<template>
  <div class="space-y-10 animate-fade-up text-left">
    <div class="flex items-end gap-4">
      <div class="bg-indigo-500 w-2 h-12 rounded-full"></div>
      <div>
        <h2 class="text-[16px] font-black text-slate-900 uppercase tracking-tighter leading-none italic">
          แบบฟอร์มส่งมอบงาน
        </h2>
        <p class="text-slate-400 text-[12px] font-bold uppercase mt-1 tracking-[0.2em] italic">การรายงานความคืบหน้าและส่งงานรายภารกิจ</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
      <!-- Left Column: Submission Form -->
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-white p-8 lg:p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
          
          <!-- Task Info (Read Only) -->
          <div class="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50 relative overflow-hidden">
            <div class="flex justify-between items-start mb-4 relative z-10">
              <span class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">รายละเอียดภารกิจเป้าหมาย</span>
              <span class="text-[10px] font-black px-3 py-1 bg-white text-indigo-500 rounded-full border border-indigo-100 shadow-sm uppercase tracking-tighter">โหนดปฏิบัติการหลัก</span>
            </div>
            
            <div class="relative z-10 flex flex-col gap-1">
               <h3 class="text-xl font-black text-slate-800 uppercase italic tracking-tighter leading-tight mt-1">
                  {{ workData.title || 'กำลังโหลดข้อมูลภารกิจ...' }}
               </h3>
               <p v-if="workData.projectTitle" class="text-[11px] font-black text-[#5c56f0] uppercase tracking-widest mt-1">
                  <i class="fas fa-folder-open mr-1"></i> โครงการหลัก: {{ workData.projectTitle }}
               </p>
               <div v-if="workData.projectDesc" class="mt-4 pl-4 border-l-4 border-indigo-200 bg-white/40 p-3 rounded-r-2xl">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">บริบทของโครงการ</span>
                  <p class="text-[12px] font-bold text-slate-500 italic leading-relaxed">
                    {{ workData.projectDesc }}
                  </p>
               </div>
            </div>

            <div class="flex items-center gap-6 mt-6 relative z-10 pt-4 border-t border-indigo-100/30">
                <div class="flex flex-col">
                   <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">ความสำคัญ</span>
                   <span v-if="workData.priority" :class="['text-[11px] font-black px-4 py-1 rounded-xl uppercase tracking-widest border text-center shadow-sm', 
                      workData.priority === 'urgent' || workData.priority === 'high' ? 'bg-rose-50 text-rose-500 border-rose-100' : 
                      workData.priority === 'medium' ? 'bg-amber-50 text-amber-500 border-amber-100' : 
                      'bg-indigo-50 text-indigo-500 border-indigo-100']">
                      {{ (workData.priority === 'urgent' || workData.priority === 'high') ? 'เร่งด่วนพิเศษ' : workData.priority === 'medium' ? 'ปานกลาง' : 'ปกติ' }}
                   </span>
                </div>
                <div class="flex flex-col border-l border-indigo-100/50 pl-6">
                   <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">กำหนดส่ง</span>
                   <span class="text-[11px] font-black text-indigo-600 uppercase italic tracking-tighter bg-white px-4 py-1 rounded-xl border border-indigo-100 shadow-sm">
                      {{ formatDate(workData.deadline) }}
                   </span>
                </div>
            </div>

            <p class="text-[12px] font-bold text-slate-400 mt-6 leading-relaxed italic relative z-10 bg-white/30 p-4 rounded-2xl border border-indigo-50/50">{{ workData.description || 'ไม่มีรายละเอียดเพิ่มเติม' }}</p>
            
            <i class="fas fa-rocket absolute -right-6 -bottom-6 text-indigo-500/5 text-8xl rotate-12"></i>
          </div>

          <div class="space-y-6">
            <div class="space-y-3">
              <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-[0.2em]">รายละเอียดการปฏิบัติงาน</label>
              <textarea v-model="workData.content" placeholder="ระบุความคืบหน้า หรือรายละเอียดผลงานที่ดำเนินการเสร็จสิ้น..." class="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] font-bold text-[14px] text-slate-800 outline-none focus:border-indigo-400/50 focus:bg-white transition-all resize-none h-40 shadow-inner"></textarea>
            </div>

            <div class="space-y-3">
               <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-[0.2em]">หลักฐานและไฟล์แนบ</label>
               <div class="border-3 border-dashed border-slate-100 rounded-[3rem] p-10 text-center hover:bg-indigo-50/30 hover:border-indigo-200 transition-all cursor-pointer relative group" @click="triggerFileUpload">
                  <input type="file" ref="fileInput" multiple class="hidden" @change="handleFileUpload">
                  <div v-if="workData.attachments.length === 0" class="flex flex-col items-center gap-4 py-6">
                      <div class="w-20 h-20 bg-white text-indigo-500 rounded-[2rem] shadow-xl shadow-indigo-100 flex items-center justify-center text-3xl mb-2 group-hover:scale-110 group-hover:rotate-12 transition-all">
                          <i class="fas fa-cloud-upload-alt"></i>
                      </div>
                      <p class="text-[13px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">คลิกเพื่ออัปโหลดผลงานประกอบ</p>
                      <p class="text-[10px] text-slate-300 font-bold italic tracking-widest">JPG, PNG, PDF OR ZIP (MAX 50MB)</p>
                  </div>
                  <div v-else class="text-left grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div v-for="(file, index) in workData.attachments" :key="index" class="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-sm group/file hover:border-indigo-200 transition-all">
                          <div class="flex items-center gap-4 min-w-0">
                              <div class="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center text-xl shrink-0">
                                  <i class="fas fa-file-pdf" v-if="file.type.includes('pdf')"></i>
                                  <i class="fas fa-image" v-else-if="file.type.includes('image')"></i>
                                  <i class="fas fa-file" v-else></i>
                              </div>
                              <div class="flex flex-col min-w-0">
                                  <span class="text-[12px] font-black text-slate-700 truncate max-w-[140px]">{{ file.name }}</span>
                                  <span class="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</span>
                              </div>
                          </div>
                          <button @click.stop="removeFile(index)" class="w-10 h-10 rounded-full bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-all opacity-0 group-hover/file:opacity-100">
                              <i class="fas fa-trash-alt text-[14px]"></i>
                          </button>
                      </div>
                      <div class="border-3 border-dashed border-indigo-100 rounded-3xl flex items-center justify-center p-6 hover:bg-white hover:border-indigo-300 transition-all text-indigo-300 hover:text-indigo-500">
                         <i class="fas fa-plus text-xl"></i>
                      </div>
                  </div>
               </div>
            </div>

            <div class="space-y-4 pt-4">
               <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-[0.2em]">ความคืบหน้าปัจจุบัน</label>
               <div class="bg-white p-10 lg:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden active:scale-[0.98] transition-all">
                  <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent pointer-events-none"></div>
                  
                  <div class="relative w-24 h-24 shrink-0 flex items-center justify-center group">
                     <svg class="w-full h-full -rotate-90 relative z-10" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" class="text-slate-100" fill="none" stroke="currentColor" stroke-width="3" />
                        <circle cx="18" cy="18" r="16" class="text-indigo-500 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)" 
                                fill="none" stroke="currentColor" stroke-width="3" 
                                stroke-linecap="round"
                                :stroke-dasharray="`${(workData.progress / 100) * 100.5}, 100`" />
                     </svg>
                     <div class="absolute inset-0 flex flex-col items-center justify-center z-20">
                        <span class="text-[20px] font-black text-indigo-600 leading-none tracking-tighter">{{ workData.progress }}%</span>
                     </div>
                  </div>
                  
                  <div class="flex-1 w-full space-y-5 relative z-10">
                     <div class="flex justify-between items-center px-1">
                        <span class="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">START</span>
                        <div class="flex items-center gap-3">
                           <span class="text-[14px] font-black text-indigo-500 uppercase italic tracking-tighter">{{ workData.progress }}% PROGRESS REPORTED</span>
                        </div>
                        <span class="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">GOAL</span>
                     </div>
                     
                     <div class="relative h-6 flex items-center">
                       <input 
                         v-model="workData.progress" 
                         type="range" 
                         min="0" max="100" step="1" 
                         class="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer outline-none transition-all progress-slider-light"
                         :style="{ 
                           background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${workData.progress}%, #f1f5f9 ${workData.progress}%, #f1f5f9 100%)` 
                         }">
                     </div>

                     <div class="flex items-center justify-center gap-2">
                        <div :class="['w-2 h-2 rounded-full animate-pulse', workData.progress == 100 ? 'bg-emerald-500' : 'bg-indigo-400']"></div>
                        <p :class="['text-[11px] font-black uppercase tracking-[0.2em] italic transition-colors', workData.progress == 100 ? 'text-emerald-500' : 'text-slate-400']">
                           {{ workData.progress == 100 ? 'ภารกิจพร้อมรับการตรวจสอบ (FINISH)' : 'อัปเดตสถานะการปฏิบัติงานของคุณ' }}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div class="flex gap-5 pt-4">
            <button @click="emit('go-back')" class="flex-1 py-6 bg-slate-50 text-slate-400 rounded-3xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-100 transition-all border border-slate-100">
              ยกเลิก
            </button>
            <button @click="submitWork" class="flex-[2.5] py-6 bg-[#5c56f0] text-white rounded-3xl font-black uppercase text-[12px] tracking-[0.3em] shadow-2xl shadow-indigo-200 hover:bg-indigo-600 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 italic">
               CONFIRM SUBMISSION <i class="fas fa-chevron-right text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: History & Comments -->
      <div class="space-y-8 animate-fade-left">
          <!-- Submission History -->
          <div class="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
             <div class="flex items-center justify-between mb-8">
                 <h4 class="text-[13px] font-black text-slate-800 uppercase italic tracking-tighter flex items-center gap-3">
                     <i class="fas fa-history text-indigo-500"></i> ประวัติงานล่าสุด
                 </h4>
                 <span class="text-[10px] font-black text-slate-300 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">{{ history.length }} รอบ</span>
             </div>

             <div class="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-3">
                 <div v-for="(h, idx) in history" :key="h.id" class="relative pl-6 border-l-2 border-indigo-50 group">
                    <div class="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-indigo-200 group-hover:bg-indigo-500 transition-colors"></div>
                    
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-[10px] font-black text-indigo-500 uppercase italic">รอบที่ {{ history.length - idx }}</span>
                        <span class="text-[9px] font-bold text-slate-300">{{ formatDate(h.date || h.createdAt) }}</span>
                    </div>
                    
                    <div class="bg-slate-50/50 group-hover:bg-indigo-50/30 p-4 rounded-2xl border border-transparent group-hover:border-indigo-100 transition-all">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">ความสำเร็จ</span>
                            <span class="text-[10px] font-black text-indigo-500">{{ h.progress || 0 }}%</span>
                        </div>
                        <p class="text-[12px] font-bold text-slate-600 leading-relaxed italic line-clamp-3">"{{ h.content || h.description || h.text }}"</p>
                        
                        <!-- Attachments in history if any -->
                        <div v-if="h.attachments?.length" class="mt-3 flex flex-wrap gap-2">
                            <div v-for="file in h.attachments" :key="file.name" class="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-slate-300 border border-slate-100 hover:text-indigo-500 hover:border-indigo-200 transition-all cursor-pointer" :title="file.name">
                                <i :class="getFileIcon(file.type || file.name)" class="text-[10px]"></i>
                            </div>
                        </div>
                    </div>
                 </div>

                 <div v-if="history.length === 0" class="py-12 text-center opacity-20">
                     <i class="fas fa-inbox text-3xl mb-3 block"></i>
                     <p class="text-[11px] font-black uppercase tracking-widest">ยังไม่มีประวัติการส่ง</p>
                 </div>
             </div>
          </div>

          <!-- Comments & Revisions -->
          <div class="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
             <div class="absolute top-0 right-0 p-6 opacity-5">
                 <i class="fas fa-comment-dots text-5xl text-indigo-500 rotate-12"></i>
             </div>

             <div class="flex items-center justify-between mb-8 relative z-10">
                 <h4 class="text-[13px] font-black text-slate-800 uppercase italic tracking-tighter flex items-center gap-3">
                     <i class="fas fa-bullhorn text-indigo-500"></i> ความเห็น/เหตุผลขอแก้
                 </h4>
             </div>

             <div class="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-3 relative z-10">
                 <div v-for="(c, idx) in comments" :key="idx" 
                      :class="['p-5 rounded-[2rem] border-l-4 transition-all', 
                               c.text?.includes('[ส่งงานกลับ]') ? 'bg-rose-50 border-rose-200 border-l-rose-500' : 'bg-slate-50 border-slate-100 border-l-indigo-500']">
                     <div class="flex justify-between items-center mb-2">
                        <span :class="['text-[10px] font-black uppercase italic', 
                                     c.text?.includes('[ส่งงานกลับ]') ? 'text-rose-500' : 'text-indigo-500']">
                            {{ c.author || c.sender || 'หัวหน้างาน' }}
                        </span>
                        <span class="text-[9px] font-bold text-slate-400">{{ formatDate(c.date || c.createdAt) }}</span>
                     </div>
                     <p class="text-[12px] font-bold text-slate-600 leading-relaxed">{{ c.text }}</p>
                 </div>

                 <div v-if="comments.length === 0" class="py-10 text-center opacity-30">
                     <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">ไม่มีข้อเสนอแนะเพิ่มเติม</p>
                 </div>
             </div>
          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom Scrollbars */
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.custom-scrollbar-dark::-webkit-scrollbar { width: 5px; }
.custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar-dark::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }

/* Custom Slider Handle Styling */
.progress-slider-dark::-webkit-slider-thumb,
.progress-slider-light::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 28px;
  height: 28px;
  background: #ffffff;
  border: 6px solid #6366f1;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.progress-slider-dark::-webkit-slider-thumb:hover,
.progress-slider-light::-webkit-slider-thumb:hover {
  transform: scale(1.2) rotate(180deg);
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.6);
}

.progress-slider-dark::-moz-range-thumb,
.progress-slider-light::-moz-range-thumb {
  width: 28px;
  height: 28px;
  background: #ffffff;
  border: 6px solid #6366f1;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
}
</style>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/api'
import { formatDate } from '@/utils/date'

const props = defineProps(['editingReport'])
const emit = defineEmits(['notify', 'go-back', 'refresh'])

const fileInput = ref(null)
const history = ref([])
const comments = ref([])
const workData = ref({
  id: null,
  title: '',
  description: '',
  deadline: null,
  priority: 'normal',
  projectTitle: '',
  projectDesc: '',
  progress: 0,
  content: '',
  attachments: [],
  comments: []
})

const fetchDetails = async (missionId) => {
    if (!missionId) return
    try {
        const [hRes, mRes] = await Promise.all([
            api.getReports({ missionId: missionId, type: 'task' }),
            api.getMissionById(missionId)
        ])
        if (hRes) {
            history.value = hRes.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
        }
        if (mRes) {
            comments.value = (mRes.comments || []).sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
            // Sync current mission data if needed (like progress or description)
            workData.value.comments = mRes.comments || []
        }
    } catch (e) {
        console.error("Failed to fetch history/comments", e)
    }
}

watch(() => props.editingReport, (newVal) => {
  if (newVal) {
    workData.value = {
      id: newVal.id || newVal._id,
      title: newVal.title,
      projectTitle: newVal.projectTitle,
      projectDesc: newVal.projectDesc || newVal.projectDescription || newVal.projectContent || '', 
      description: newVal.description || newVal.desc || newVal.content || '',
      deadline: newVal.deadline || newVal.dueDate || newVal.date,
      priority: newVal.priority || 'normal',
      progress: (typeof newVal.progress !== 'undefined') ? newVal.progress : 0, 
      content: '', // Reset content
      attachments: []
    }
    fetchDetails(workData.value.id)
  }
}, { immediate: true })

const getFileIcon = (type) => {
  if (!type) return 'fas fa-file'
  const t = type.toLowerCase()
  if (t.includes('image') || t.match(/\.(jpg|jpeg|png|gif)$/i)) return 'fas fa-image'
  if (t.includes('pdf') || t.match(/\.pdf$/i)) return 'fas fa-file-pdf'
  if (t.includes('word') || t.match(/\.doc/i)) return 'fas fa-file-word'
  if (t.includes('excel') || t.match(/\.xls/i)) return 'fas fa-file-excel'
  if (t.includes('zip') || t.includes('rar')) return 'fas fa-file-archive'
  return 'fas fa-file'
}

const triggerFileUpload = () => fileInput.value.click()

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    workData.value.attachments.push({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file)
    })
  })
  event.target.value = ''
}

const removeFile = (index) => workData.value.attachments.splice(index, 1)

const submitWork = async () => {
  if (!workData.value.content) {
    emit('notify', 'กรุณาระบุรายละเอียดการปฏิบัติงาน')
    return
  }

  try {
      const payload = {
        missionId: workData.value.id,
        title: `Submission: ${workData.value.title}`,
        projectTitle: workData.value.projectTitle,
        content: workData.value.content,
        description: workData.value.content, 
        progress: workData.value.progress, 
        attachments: workData.value.attachments,
        date: new Date().toISOString(),
        submittedBy: localStorage.getItem('userName') || 'Operator',
        submittedByRole: 'staff',
        dept: localStorage.getItem('deptName') || '',
        type: 'task',
        status: 'review' // 🔥 เปลี่ยนให้เป็น review ทันทีเมื่อพนักงานกดส่ง
      }

    const res = await api.createReport(payload)
    if (res) {
      // Update task status and progress
      // If progress is 100, status must be review. Actually even if < 100, 
      // when staff "submits", it should probably go to review if it's a milestone.
      // But based on user request in Kanban, 'review' stage is when mission status is 'review'.
      const newStatus = 'review' 
      await api.updateTask(workData.value.id, { status: newStatus, progress: workData.value.progress })
      
      emit('notify', 'ส่งมอบงานเรียบร้อยแล้ว! ข้อมูลถูกส่งถึงหัวหน้าชุดปฏิบัติการเรียบร้อย')
      emit('refresh') 
      emit('go-back')
    }
  } catch (e) {
    console.error(e)
    emit('notify', 'การส่งงานขัดข้อง กรุณาลองใหม่')
  }
}
</script>
