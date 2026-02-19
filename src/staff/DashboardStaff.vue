<template>
  <div>
    <div class="space-y-10 text-left animate-fade-in">
      <header class="flex justify-between items-center mb-6">
        <div class="text-left">
          <h2 class="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">ภารกิจพนักงาน</h2>
          <p class="text-slate-400 text-[9px] font-bold uppercase mt-2 tracking-widest italic">ศูนย์รวมภารกิจและการปฏิบัติงานส่วนบุคคล</p>
        </div>
        <div class="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
          <span class="text-[9px] font-black text-indigo-500 uppercase tracking-widest">สถานะ: พร้อมปฏิบัติงาน</span>
        </div>
      </header>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-4 text-left">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <i class="fas fa-clipboard-list text-[#5c56f0]"></i> ภารกิจที่ได้รับมอบหมาย
            </h3>
            <div class="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button @click="showHistory = false" 
                      :class="['px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all', 
                      !showHistory ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600']">
                ภารกิจปัจจุบัน
              </button>
              <button @click="showHistory = true" 
                      :class="['px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all', 
                      showHistory ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600']">
                ประวัติงานย่อย
              </button>
            </div>
          </div>
  
          <div v-if="filteredTasks.length > 0" class="space-y-3">
            <div v-for="(task, index) in filteredTasks" :key="index" 
                 class="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all animate-pop text-left">
              <div class="flex justify-between items-center gap-4">
                <div class="flex items-center gap-3 flex-1 overflow-hidden">
                  <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                    <i class="fas fa-rocket text-sm"></i>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 mb-0.5">
                      <h4 class="font-black text-slate-800 uppercase italic tracking-tighter text-lg truncate leading-tight">{{ task.title }}</h4>
                      <span v-if="task.priority" :class="['text-[8px] font-black px-2 py-0.5 rounded-md uppercase border', 
                        task.priority === 'urgent' ? 'bg-rose-50 text-rose-500 border-rose-100' : 
                        task.priority === 'medium' ? 'bg-amber-50 text-amber-500 border-amber-100' : 
                        'bg-indigo-50 text-indigo-500 border-indigo-100']">
                        {{ task.priority === 'urgent' ? 'เร่งด่วน' : task.priority === 'medium' ? 'ปานกลาง' : 'ปกติ' }}
                      </span>
                    </div>
                    <div class="flex flex-col">
                      <p class="text-slate-500 font-bold text-[11px] truncate">{{ task.description }}</p>
                      <p v-if="task.projectTitle" class="text-[8px] font-black text-indigo-400 uppercase tracking-widest mt-1">
                        <i class="fas fa-folder-open mr-1"></i> จากโครงการ: {{ task.projectTitle }}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-4 shrink-0">
                  <div class="flex flex-col items-end">
                     <span class="text-[7px] font-black text-slate-300 uppercase tracking-widest">กำหนดส่ง</span>
                     <span :class="['text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-tight', 
                        isOverdue(task.deadline || task.dueDate) ? 'text-rose-600 bg-rose-50' : 'text-slate-400 bg-slate-50']">
                       {{ formatDate(task.deadline || task.dueDate || task.date) }}
                     </span>
                  </div>
                    <button v-if="!showHistory" @click="submitWork(task)" class="bg-[#5c56f0] text-white px-5 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                      ส่งงาน
                    </button>
                    <div v-else class="flex flex-col items-end gap-2">
                      <div class="bg-emerald-50 text-emerald-500 px-5 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest border border-emerald-100">
                        เสร็จสมบูรณ์
                      </div>
                      <button @click="openCommentModal(task)" class="text-[9px] font-black text-slate-300 hover:text-indigo-500 underline transition-colors flex items-center gap-1">
                        <i class="fas fa-comment-dots"></i> แจ้งหัวหน้า
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
          <div v-else class="w-full py-16 rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center bg-slate-50/30">
            <p class="text-slate-300 font-black italic uppercase tracking-widest text-sm">
              {{ showHistory ? 'ไม่มีประวัติภารกิจที่เสร็จสมบูรณ์' : 'ไม่มีภารกิจค้างในขณะนี้' }}
            </p>
          </div>

          <!-- Moved: Incoming Reports (My Recent Reports) -->
          <div class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden animate-fade-up mt-8" style="animation-delay: 100ms;">
              <div class="flex justify-between items-end mb-6"> 
                  <div>
                      <h3 class="text-xl font-black text-slate-800 tracking-tighter leading-none">รายงานที่ถูกตีกลับ</h3>
                      <p class="text-[9px] font-black text-rose-400 uppercase tracking-[0.2em] mt-1">RETURNED REPORTS</p>
                  </div>
              </div>

              <div class="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  <div v-if="recentReports.length === 0" class="py-10 text-center opacity-40">
                      <p class="text-[10px] uppercase font-bold text-slate-300">ไม่พบรายงานที่ถูกตีกลับ</p>
                  </div>
                  <div v-for="report in recentReports" :key="report.id" 
                      class="flex items-center gap-4 p-4 bg-rose-50/50 hover:bg-white border-2 border-rose-100/50 hover:border-rose-200 rounded-[2rem] transition-all group cursor-pointer relative overflow-hidden">
                      <div class="relative w-12 h-12 shrink-0">
                           <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${report.submittedBy || 'KM'}`" class="w-full h-full rounded-2xl bg-white group-hover:scale-110 transition-transform shadow-sm">
                           <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[7px] bg-rose-500 text-white">
                                <i class="fas fa-exclamation-triangle"></i>
                           </div>
                      </div>
                      <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-2">
                              <h4 class="text-sm font-black text-slate-800 uppercase italic tracking-tighter truncate group-hover:text-rose-600 transition-colors">{{ report.title }}</h4>
                              <span class="text-[7px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded uppercase tracking-widest">ตีกลับ</span>
                          </div>
                          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                              เหตุผล: {{ report.feedback || 'ต้องการการแก้ไขเพิ่มเติม' }}
                          </p>
                      </div>
                      <div class="text-right shrink-0">
                          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">{{ formatDate(report.date) }}</span>
                          <p class="text-[8px] font-black text-rose-400 mt-1 uppercase tracking-tighter">โปรดส่งงานใหม่</p>
                      </div>
                  </div>
              </div>
          </div>
        </div>
  
        <div class="space-y-6 text-left">
          <!-- 🔥 New: Project Briefing Section -->
          <div v-if="activeProjects.length > 0" class="space-y-4">
             <h3 class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
               <i class="fas fa-folder-open text-[#5c56f0]"></i> สรุปข้อมูลโครงการที่ดำเนินการอยู่
             </h3>
             <div v-for="proj in activeProjects" :key="proj.id" 
                  @click="$emit('card-click', proj)"
                  class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 hover:border-indigo-100 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
               <div class="flex justify-between items-start">
                 <span class="text-[8px] font-black text-indigo-400 uppercase tracking-widest">โครงการหลัก</span>
                 <span class="text-[9px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                   กำหนดส่ง: {{ formatDate(proj.deadline) }}
                 </span>
               </div>
                <h4 class="text-sm font-black text-slate-800 uppercase italic tracking-tighter leading-tight">{{ proj.title || proj.projectTitle }}</h4>
                <p class="text-[10px] font-bold text-slate-400 leading-relaxed italic line-clamp-3">{{ proj.desc || proj.description || proj.projectDesc || proj.content || 'ไม่มีข้อมูลรายละเอียดโครงการ' }}</p>
               <div class="pt-2 border-t border-slate-50 flex items-center justify-between">
                  <span class="text-[8px] font-black text-slate-300 uppercase">จุดเน้นเชิงกลยุทธ์</span>
                  <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
               </div>
             </div>
          </div>
  
          <div class="bg-[#121926] p-8 rounded-[2.5rem] shadow-xl text-left space-y-6 text-white">
            <h3 class="text-[9px] font-black text-indigo-300 uppercase tracking-[0.2em]">ดัชนีชี้วัดผลการปฏิบัติงานรายบุคคล (KPI)</h3>
            <div>
              <p class="text-4xl font-black italic tracking-tighter leading-none">88%</p>
              <p class="text-indigo-300/50 font-black uppercase text-[8px] tracking-widest mt-1">ประสิทธิภาพโดยรวม</p>
            </div>
            <div class="space-y-3 text-left">
              <div class="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500">
                <span>เสร็จสิ้น</span>
                <span>12 ภารกิจ</span>
              </div>
              <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-[#5c56f0] rounded-full" style="width: 88%"></div>
              </div>
            </div>
          </div>
  
          <div class="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 transition-all hover:border-indigo-100">
            <div class="relative shrink-0">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=PM" class="w-12 h-12 rounded-xl bg-slate-900 p-1">
               <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div class="min-w-0">
              <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">ผู้จัดการโครงการ</p>
              <h4 class="text-slate-800 font-black uppercase text-sm italic tracking-tighter truncate">สมชาย (Manager)</h4>
              <p class="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">ออนไลน์</p>
            </div>
          </div>
      </div>
    </div>
    </div>
  
      <!-- Comment Modal -->
      <div v-if="showCommentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-pop space-y-6 border border-white/20">
          <div class="space-y-2">
              <h3 class="text-xl font-black text-slate-800 uppercase italic tracking-tighter">แจ้งปัญหา / ขอแก้ไขงาน</h3>
              <p class="text-[10px] uppercase font-bold text-slate-400 tracking-widest">ส่งข้อความถึงหัวหน้าโครงการเพื่อให้ทราบเหตุผลของการแจ้งเตือนนี้</p>
          </div>
          
          <textarea v-model="commentText" rows="4" 
            class="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-300 resize-none"
            placeholder="ระบุรายละเอียดเพิ่มเติม..."></textarea>
            
          <div class="flex justify-end gap-3 pt-2">
            <button @click="showCommentModal = false" class="px-5 py-2.5 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors">ยกเลิก</button>
            <button @click="submitComment" :disabled="!commentText.trim() || isSubmitting"
              class="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95">
              {{ isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อความ' }}
            </button>
          </div>
        </div>
      </div>
  </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
  import api from '@/api'
  import { formatDate, isOverdue } from '@/utils/date'
  
  const emit = defineEmits(['change-tab', 'notify', 'refresh', 'card-click'])
  const props = defineProps(['userEmail', 'userName', 'deptName', 'refreshTrigger'])

  watch(() => props.refreshTrigger, () => {
    fetchTasks()
  })
  const myTasks = ref([])
  const showHistory = ref(false)
  
  const filteredTasks = computed(() => {
      if (!myTasks.value) return []
      
      return myTasks.value.filter(t => {
          const isProjectTask = !!(t.projectId || t.projectTitle)
          const pStatus = (t.projectStatus || '').toLowerCase().trim()
          const isTaskFinished = (t.status === 'completed')
          
          // กฎการตัดสินใจว่างานควรอยู่ใน "ประวัติ" (History) หรือไม่?
          let isHistory = false
          if (isProjectTask) {
              // งานโครงการ: ย้ายไปประวัติเมื่อ "โครงการหลัก" ปิดสถานะเป็น 'completed' เท่านั้น
              isHistory = (pStatus === 'completed')
          } else {
              // งานเดี่ยว: ย้ายไปประวัติเมื่อ "ตัวงานเอง" เสร็จสิ้น (status='completed' เท่านั้น ไม่รวม review)
              isHistory = isTaskFinished
          }
          
          // ถ้ากดดูหน้าประวัติ ให้คืนค่าที่เป็น History
          // ถ้ากดดูหน้าปัจจุบัน ให้คืนค่าที่ไม่ใช่ History (!History)
          return showHistory.value ? isHistory : !isHistory
      })
  })
  
  const activeProjects = computed(() => {
      if (!myTasks.value) return []
      const projectsMap = new Map()
      myTasks.value.forEach(t => {
          // Collect UNIQUE Active Projects from tasks
          if (t.projectId && t.projectTitle && t.projectStatus !== 'completed') {
               const pid = String(t.projectId)
               if (!projectsMap.has(pid)) {
                  projectsMap.set(pid, {
                      id: t.projectId,
                      title: t.projectTitle,
                      desc: t.projectDesc || t.projectDescription || t.projectContent || '',
                      description: t.description || t.desc || t.content || '',
                      deadline: t.projectDeadline || t.deadline || t.dueDate || t.date,
                      priority: t.priority || 'normal',
                      progress: (typeof t.progress !== 'undefined') ? t.progress : 0,
                      status: t.projectStatus
                  })
               }
          }
      })
      return Array.from(projectsMap.values())
  })
  
  const fetchTasks = async () => {
      try {
          const params = { 
              dept: props.deptName,
              staffId: props.userEmail,
              assignee: props.userName // Send both for robust matching
          }
          
          // 1. Fetch ALL data (Task + Urgent) AND Projects to ensure we have the latest status
          const [allData, allProjects] = await Promise.all([
              api.getTasks(null, params),
              api.getTasks('project')
          ])
  
          // 2. Build a Client-side Project Map (Title -> Status)
          const projectStatusMap = new Map()
          if (allProjects) {
              allProjects.forEach(p => {
                  if (p.title) {
                      const cleanTitle = p.title.toLowerCase().trim()
                      // If any entry with this title is completed, the project title is considered completed
                      if (p.status === 'completed') {
                          projectStatusMap.set(cleanTitle, 'completed')
                      } else if (!projectStatusMap.has(cleanTitle)) {
                          projectStatusMap.set(cleanTitle, p.status)
                      }
                  }
                  if (p.id) {
                       projectStatusMap.set(String(p.id), p.status)
                  }
              })
          }
  
          if (allData) {
            // 3. Process Tasks & Deduplicate
            const uniqueTasks = new Map()
            
            allData.forEach(t => {
              if (t.type !== 'project') {
                // FORCE UPDATE: Mix active project status into the task
                const pTitle = (t.projectTitle || '').toLowerCase().trim()
                const pId = String(t.projectId || '')
                
                const realStatus = projectStatusMap.get(pId) || projectStatusMap.get(pTitle)
                if (realStatus) {
                    t.projectStatus = realStatus
                }
  
                // Deduplication Logic
                uniqueTasks.set(t.id, t)
              }
            })
            myTasks.value = Array.from(uniqueTasks.values())
          }
      } catch (e) {
          console.error('Failed to fetch tasks', e)
      }
  }
  
  let intervalId = null

  // Fetch Reports for "Incoming Reports" section (My Recent Reports)
  const recentReports = ref([])

  const fetchReports = async () => {
      try {
          // Fetch reports submitted by this user
          const myName = props.userName || localStorage.getItem('userName')
          if (myName) {
             const data = await api.getReports({ 
                 submittedBy: myName,
                 status: 'RETURNED' 
             })
             if (data) {
                 recentReports.value = data.slice(0, 5) 
             }
          }
      } catch (e) {
          console.error('Failed to fetch reports', e)
      }
  }

  onMounted(() => {
    fetchTasks()
    fetchReports()
    intervalId = setInterval(() => {
        fetchTasks()
        fetchReports()
    }, 5000)
  })

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })
  
  // Re-fetch if props change (e.g. login)
  watch(() => props.userName, () => {
      fetchTasks()
      fetchReports()
  })
  
  const submitWork = (task) => {
    emit('change-tab', 'submit-work', task)
  }
  
  // --- Comment System ---
  const showCommentModal = ref(false)
  const selectedTask = ref(null)
  const commentText = ref('')
  const isSubmitting = ref(false)
  
  const openCommentModal = (task) => {
    selectedTask.value = task
    commentText.value = ''
    showCommentModal.value = true
  }
  
  const submitComment = async () => {
    if (!commentText.value.trim() || !selectedTask.value) return
    isSubmitting.value = true
    try {
      await api.addComment(selectedTask.value.id, commentText.value, props.userName, { requestEdit: true })
      emit('notify', { message: 'ส่งข้อความถึงหัวหน้าเรียบร้อยแล้ว', type: 'success' })
      showCommentModal.value = false
    } catch (error) {
      console.error(error)
      emit('notify', { message: error.message || 'เกิดข้อผิดพลาดในการส่งข้อความ', type: 'error' })
    } finally {
      isSubmitting.value = false
    }
  }
  </script>
