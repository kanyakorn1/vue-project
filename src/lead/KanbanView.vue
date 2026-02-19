<template>
  <div class="space-y-10 animate-fade-up text-left">
    <!-- Header -->
    <div class="flex justify-between items-end">
      <div class="flex items-end gap-4 text-left">
        <div class="bg-indigo-500 w-2 h-12 rounded-full"></div>
        <div>
          <h2 class="text-[16px] font-black text-slate-900 uppercase tracking-tighter leading-none italic">กระดานภารกิจแทรก</h2>
          <p class="text-slate-400 text-[12px] font-bold uppercase mt-1 tracking-[0.2em] italic">การจัดการงานด่วนและพอร์ตโฟลิโอส่วนตัว</p>
        </div>
      </div>
      <button v-if="userRole === 'manager' || userRole === 'lead'" @click="showModal = true" 
              class="bg-indigo-600 text-white px-8 py-4 rounded-[2rem] text-[12px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all">
        <i class="fas fa-plus mr-2"></i> สร้างงานแทรกใหม่
      </button>
    </div>

    <!-- Modal for Adding New Task -->
    <Teleport to="#modal-target">
      <transition name="modal-fade">
        <div v-if="showModal" class="absolute inset-0 z-[1000] flex justify-center items-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div class="bg-white w-full max-w-lg rounded-[3rem] p-8 sm:p-10 shadow-2xl animate-pop relative flex flex-col max-h-[90vh] overflow-hidden text-left">
            <h3 class="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-6 shrink-0 text-left uppercase text-left">สร้างงานแทรกใหม่</h3>
            
            <div class="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2 py-2 text-left">
              <div class="space-y-1 text-left">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left">หัวข้อภารกิจ</label>
                <input v-model="newTask.title" type="text" placeholder="ระบุภารกิจ..." class="w-full px-7 py-3.5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none font-bold text-[14px] focus:border-indigo-500/30 transition-all text-left">
              </div>

              <div class="space-y-1 text-left">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">รายละเอียดความช่วยเหลือ</label>
                <textarea v-model="newTask.description" rows="3" placeholder="ระบุสิ่งที่ต้องการ..." class="w-full px-7 py-3.5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none font-bold text-[14px] resize-none focus:border-indigo-500/30 transition-all text-left"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4 text-left">
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">ผู้รับผิดชอบ</label>
                  <select v-model="newTask.assignee" class="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none font-bold appearance-none cursor-pointer focus:border-indigo-500/30 transition-all">
                    <option value="" disabled>เลือกพนักงาน</option>
                    <option v-for="emp in filteredStaff" :key="emp.id" :value="emp.name">
                      {{ emp.name }}
                    </option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">กำหนดส่งด่วน</label>
                  <input v-model="newTask.deadline" type="date" class="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none font-bold cursor-pointer focus:border-indigo-500/30 transition-all">
                </div>
              </div>

              <div class="space-y-1 text-left">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">ระดับความเร่งด่วน</label>
                <div class="flex gap-2 p-1 bg-slate-50 rounded-[1.5rem]">
                  <button v-for="p in ['NORMAL', 'HIGH']" :key="p" @click="newTask.priority = p"
                          :class="['flex-1 py-1.5 rounded-[1.2rem] text-[9px] font-black uppercase transition-all', 
                          newTask.priority === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400']">
                    {{ p === 'HIGH' ? 'ด่วนพิเศษ' : 'ปกติ' }}
                  </button>
                </div>
              </div>

              <div class="space-y-1 text-left">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">ระดับความยาก (KPI Difficulty)</label>
                <select v-model="newTask.difficulty" class="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none font-bold appearance-none cursor-pointer focus:border-indigo-500/30 transition-all">
                  <option :value="1">Level 1 - ง่ายมาก (Routine)</option>
                  <option :value="2">Level 2 - ง่าย (Basic)</option>
                  <option :value="3">Level 3 - ปานกลาง (Standard)</option>
                  <option :value="4">Level 4 - ยาก (Complex)</option>
                  <option :value="5">Level 5 - ยากมาก (Advanced)</option>
                </select>
              </div>
            </div>

            <button @click="addTask" class="w-full mt-6 py-4 bg-[#121926] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] italic text-[14px] shadow-lg hover:bg-slate-800 transition-all active:scale-95 shrink-0 text-center">
              เพิ่มงานแทรกด่วน
            </button>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Task Detail Modal -->
    <Teleport to="#modal-target">
      <transition name="modal-fade">
        <div v-if="selectedTask" class="absolute inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm" @click.self="selectedTask = null">
          <div class="bg-white w-full max-w-md max-h-[85vh] rounded-[2rem] shadow-2xl animate-pop relative overflow-hidden flex flex-col text-left">
             <!-- Top Decoration -->
             <div class="absolute top-0 left-0 w-full h-2" :class="selectedTask.priority === 'HIGH' ? 'bg-rose-500' : 'bg-[#5c56f0]'"></div>
             <div class="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20" :class="selectedTask.priority === 'HIGH' ? 'bg-rose-500' : 'bg-[#5c56f0]'"></div>

             <div class="overflow-y-auto overflow-x-hidden custom-scrollbar p-6 pb-10 h-full relative z-10 my-4 mr-3">
             <div class="flex justify-between items-start mb-6 relative z-10">
                <span class="text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest"
                      :class="selectedTask.priority === 'HIGH' ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-[#5c56f0]'">
                    {{ selectedTask.priority === 'HIGH' ? 'เร่งด่วน' : 'ปกติ' }}
                </span>
                
                <button @click="selectedTask = null" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                    <i class="fas fa-times text-slate-400"></i>
                </button>
             </div>

             <h3 class="text-2xl font-black text-slate-900 leading-tight mb-4 relative z-10">
                {{ selectedTask.title }}
             </h3>

             <div class="bg-slate-50 rounded-[1.5rem] p-5 mb-6">
                <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">วัตถุประสงค์การปฏิบัติงาน</h5>
                <p class="text-sm font-bold text-slate-600 leading-relaxed">
                    {{ selectedTask.desc || 'ไม่มีรายละเอียดเพิ่มเติม' }}
                </p>
             </div>

             <div class="flex items-center justify-between border-t border-slate-100 pt-6">
                 <div class="flex items-center gap-3">
                     <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedTask.assignee}`" class="w-10 h-10 rounded-[1rem] bg-indigo-50">
                     <div class="flex flex-col">
                         <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">ผู้รับผิดชอบ</span>
                         <span class="text-xs font-bold text-slate-700 uppercase">{{ selectedTask.assignee }}</span>
                     </div>
                 </div>
                  <div class="flex flex-col items-end">
                         <span class="text-[12px] font-black text-slate-300 uppercase tracking-widest">กำหนดส่ง</span>
                         <span class="text-[12px] font-bold text-slate-700 uppercase">{{ formatDate(selectedTask.deadline || selectedTask.dueDate) }}</span>
                 </div>
             </div>

             <!-- Staff Action: Submit Work -->
             <div v-if="userRole === 'staff'" 
                  class="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                 <button @click="submitWork" class="w-full bg-emerald-500 text-white px-6 py-3 rounded-2xl text-[12px] font-black uppercase shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                    <i class="fas fa-paper-plane"></i> ส่งงานภารกิจนี้
                 </button>
             </div>
 

              <!-- Lead Actions: Approve / Return -->
              <div v-if="userRole !== 'staff' && selectedTask.status === 'review'" 
                   class="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                  <button @click="returnTask" class="bg-rose-50 text-rose-500 px-6 py-3 rounded-2xl text-[12px] font-black uppercase hover:bg-rose-100 transition-all flex items-center justify-center gap-2">
                     <i class="fas fa-undo"></i> ส่งงานกลับ
                  </button>
                  <button @click="approveTask" class="bg-[#5c56f0] text-white px-6 py-3 rounded-2xl text-[12px] font-black uppercase shadow-lg shadow-indigo-200 hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
                     <i class="fas fa-check-double"></i> ตรวจแล้ว
                  </button>
              </div>

             <!-- Submission History (New) -->
             <div v-if="submissions && submissions.length > 0" class="mt-8 pt-6 border-t border-slate-100">
                 <h5 class="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <i class="fas fa-history text-emerald-500"></i>
                     ประวัติการส่งงาน ({{ submissions.length }})
                 </h5>
                 <div class="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                     <div v-for="(sub, idx) in submissions" :key="sub.id" class="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-white px-2 py-0.5 rounded-full shadow-sm border border-emerald-100">
                                รอบที่ {{ submissions.length - idx }}
                            </span>
                            <span class="text-[9px] font-bold text-slate-400">{{ formatDate(sub.date || sub.createdAt) }}</span>
                        </div>
                        <p class="text-[11px] font-bold text-slate-600 mb-2 line-clamp-2 leading-relaxed">{{ sub.content || sub.description }}</p>
                        
                        <div class="flex items-center justify-between mt-2 pt-2 border-t border-emerald-100/30">
                            <div class="flex items-center gap-2">
                                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">ความสำเร็จ</span>
                                <span class="text-[10px] font-black text-emerald-500">{{ sub.progress }}%</span>
                            </div>
                            <div v-if="sub.attachments && sub.attachments.length > 0" class="mt-3 pt-2 border-t border-emerald-100/30">
                                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">ไฟล์แนบ ({{ sub.attachments.length }})</span>
                                <div class="grid grid-cols-1 gap-2">
                                    <div v-for="(file, fIdx) in sub.attachments" :key="fIdx" 
                                         @click="openAttachment(file)"
                                         class="flex items-center justify-between p-2 rounded-lg bg-white/60 border border-emerald-100/50 hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                                         <div class="flex items-center gap-2 overflow-hidden">
                                             <div class="w-6 h-6 rounded bg-emerald-100 text-emerald-500 flex items-center justify-center text-[10px] shrink-0">
                                                 <i :class="getFileIcon(file.type || file.name)"></i>
                                             </div>
                                             <span class="text-[10px] font-bold text-slate-600 truncate max-w-[150px]">{{ file.name }}</span>
                                         </div>
                                         <i class="fas fa-external-link-alt text-[8px] text-slate-300 group-hover:text-emerald-500 transition-colors"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>
                 </div>
             </div>

             <!-- Comment Section -->
             <div class="mt-8 pt-6 border-t border-slate-100">
                 <h5 class="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <i class="fas fa-comments text-indigo-500"></i>
                     ความเห็นและบันทึก
                 </h5>
                 
                 <!-- Comment List -->
                 <div class="space-y-4 mb-4 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                     <div v-for="(comment, index) in selectedTask.comments" :key="index" class="bg-slate-50 p-4 rounded-2xl">
                         <div class="flex justify-between items-start mb-1">
                             <span class="text-[12px] font-black text-indigo-600 uppercase">{{ comment.author }}</span>
                             <span class="text-[12px] font-bold text-slate-300">{{ formatDate(comment.date) }}</span>
                         </div>
                         <p class="text-[12px] font-bold text-slate-600 leading-relaxed text-left">{{ comment.text }}</p>
                     </div>
                     <div v-if="!selectedTask.comments || selectedTask.comments.length === 0" class="py-6 text-center opacity-20">
                         <p class="text-[12px] font-black uppercase">ยังไม่มีความเห็น</p>
                     </div>
                 </div>

                 <!-- Add Comment Input -->
                 <div class="flex gap-2">
                     <input v-model="commentText" 
                            @keyup.enter="addComment"
                            placeholder="พิมพ์ความเห็น..." 
                            class="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-[12px] font-bold text-slate-700 focus:bg-white border border-transparent focus:border-indigo-100 outline-none transition-all">
                     <button @click="addComment" 
                             :disabled="!commentText.trim()"
                             class="bg-[#5c56f0] text-white px-4 py-3 rounded-xl text-[12px] font-black uppercase shadow-lg shadow-indigo-100 disabled:opacity-50">
                         ส่งข้อมูล
                     </button>
                 </div>
             </div>
             </div>
        </div>
      </div>
    </transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="#modal-target">
      <transition name="modal-fade">
        <div v-if="showDeleteModal" class="absolute inset-0 z-[1100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div class="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-pop relative text-center">
              <div class="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i class="fas fa-exclamation-triangle text-2xl text-rose-500"></i>
              </div>
              
              <h3 class="text-xl font-black text-slate-900 mb-2">ยืนยันการลบงานแทรก</h3>
              <p class="text-slate-500 font-bold text-sm mb-8">คุณต้องการลบงานแทรก "{{ taskToDelete?.title }}" ใช่หรือไม่?</p>
              
              <div class="grid grid-cols-2 gap-4">
                  <button @click="showDeleteModal = false" class="py-3 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase text-xs hover:bg-slate-100 transition-all">
                      ยกเลิก
                  </button>
                  <button @click="executeDelete" class="py-3 bg-rose-500 text-white rounded-2xl font-black uppercase text-xs hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all">
                      ยืนยันการลบ
                  </button>
              </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Kanban Columns -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pb-8 min-h-[600px]">
      <div v-for="stage in visibleStages" :key="stage.id" 
           class="flex flex-col gap-4 animate-fade-up">
        
        <!-- Stage Header -->
        <div :class="['flex items-center justify-between px-4 py-3 rounded-2xl border shadow-sm transition-all', stage.headerClass]">
          <div class="flex items-center gap-2">
            <div :class="[stage.dotColor, 'w-2.5 h-2.5 rounded-full shadow-lg animate-pulse']"></div>
            <span :class="['text-[10px] font-black uppercase tracking-widest italic', stage.textClass]">{{ stage.title }}</span>
          </div>
          <span :class="['text-[10px] font-black px-2 py-0.5 rounded-lg border', stage.badgeClass]">
            {{ getTasksByStage(stage.id).length }}
          </span>
        </div>

        <!-- Task Container -->
        <div :class="['flex-1 rounded-[2.5rem] p-4 border-2 border-dashed space-y-4 overflow-y-auto custom-scrollbar-slim transition-all', stage.containerClass]">
          
          <!-- Task Card -->
          <div v-for="task in getTasksByStage(stage.id)" :key="task.id" 
            @click="openTaskDetails(task)"
            :class="['bg-white p-5 rounded-[2.2rem] border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer relative overflow-hidden active:scale-95', stage.cardBorderClass]"
          >
            <!-- Priority Indicator -->
            <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
              <i :class="['fas fa-bolt text-3xl', stage.accentText]"></i>
            </div>

            <div class="flex justify-between items-start mb-3">
              <span :class="['text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border', 
                task.priority === 'HIGH' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100']">
                {{ task.priority === 'HIGH' ? 'เร่งด่วน' : 'ปกติ' }}
              </span>
              <span v-if="task.status === 'returned'" class="text-[7px] font-black uppercase bg-rose-500 text-white px-2 py-0.5 rounded-full animate-bounce shadow-lg shadow-rose-200">
                RETURNED
              </span>
            </div>

            <h4 class="text-[14px] font-black text-slate-800 leading-tight mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2 italic">
              {{ task.title }}
            </h4>

            <!-- Progress & Deadline -->
            <div class="space-y-3 pt-3 border-t border-slate-50">
              <div class="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
                <span class="flex items-center gap-1">
                  <i :class="['far fa-calendar-alt', stage.accentText]"></i>
                  {{ formatDate(task.deadline) }}
                </span>
                <span :class="stage.accentText">{{ task.progress || 0 }}%</span>
              </div>
              <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div :class="['h-full rounded-full transition-all duration-700', stage.progressClass]" 
                       :style="{ width: (task.progress || 0) + '%' }"></div>
              </div>
            </div>

            <!-- Footer -->
            <div class="mt-4 flex justify-between items-center group/footer">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-xl bg-slate-900 p-0.5 shadow-sm">
                    <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee}`" class="w-full h-full rounded-lg">
                </div>
                <span class="text-[9px] font-black text-slate-500 uppercase tracking-tighter truncate max-w-[80px]">{{ task.assignee }}</span>
              </div>
              
              <button v-if="userRole === 'lead' || userRole === 'manager'" 
                      @click.stop="confirmDelete(task)" 
                      class="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-rose-50 text-slate-200 hover:text-rose-500 transition-all">
                <i class="fas fa-trash-alt text-[10px]"></i>
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="getTasksByStage(stage.id).length === 0" class="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-100/50 rounded-[2rem] opacity-30 mt-4">
            <i class="fas fa-layer-group text-2xl text-slate-300 mb-2"></i>
            <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">ไม่มีข้อมูล</p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '@/api'
import { ref, reactive, computed, onMounted } from 'vue'
import { formatDate } from '@/utils/date'

const props = defineProps(['userRole', 'projects', 'allStaff', 'userName', 'userEmail'])
const emit = defineEmits(['add-project', 'delete-project', 'update-project', 'change-tab'])

const showModal = ref(false)
const showDeleteModal = ref(false)
const taskToDelete = ref(null)
const commentText = ref('')

const submitWork = () => {
  if (selectedTask.value) {
    emit('change-tab', 'submit-work', selectedTask.value)
    selectedTask.value = null
  }
}
const newTask = reactive({
  title: '',
  description: '',
  assignee: '',
  priority: 'NORMAL',
  deadline: '',
  difficulty: 3
})

// 🎯 ฟังก์ชันเพิ่มความคิดเห็น
const addComment = () => {
  if (commentText.value.trim() && selectedTask.value) {
    if (!selectedTask.value.comments) {
      selectedTask.value.comments = []
    }
    
    selectedTask.value.comments.unshift({
      author: localStorage.getItem('userEmail') || 'Commander Shepard',
      text: commentText.value,
      date: new Date().toISOString()
    })
    
    // ส่งข้อมูลไปอัปเดตที่ App.vue หรือ Server
    emit('update-project', selectedTask.value.id, { comments: selectedTask.value.comments })
    
    commentText.value = ''
  }
}

// 🎯 กรองรายชื่อพนักงานสำหรับงานแทรก
const filteredStaff = computed(() => {
  if (!props.allStaff) return []
  
  // กรองออกเฉพาะระดับปฏิบัติการ (ไม่ใช่ Lead/PM)
  const available = props.allStaff.filter(s => {
    const role = (s.role || '').toLowerCase()
    return role !== 'lead' && role !== 'pm' && role !== 'manager'
  })

  // ลบชื่อซ้ำ
  const nameMap = new Map()
  available.forEach(s => {
    if (!s.name || !s.name.trim()) return
    if (!nameMap.has(s.name) || (s.position && !nameMap.get(s.name).position)) {
      nameMap.set(s.name, s)
    }
  })
  
  return Array.from(nameMap.values()).sort((a, b) => a.name.localeCompare(b.name))
})

const kanbanStages = [
  { 
    id: 'planning', 
    title: 'เตรียมการ', 
    dotColor: 'bg-slate-400',
    headerClass: 'bg-white border-slate-200',
    textClass: 'text-slate-600',
    badgeClass: 'text-slate-500 bg-slate-50 border-slate-200',
    containerClass: 'bg-slate-50/50 border-slate-200/50',
    cardBorderClass: 'border-slate-100 hover:border-slate-300',
    progressClass: 'bg-slate-400',
    accentText: 'text-slate-400'
  },
  { 
    id: 'processing', 
    title: 'กำลังดำเนินการ', 
    dotColor: 'bg-blue-500',
    headerClass: 'bg-blue-50 border-blue-100',
    textClass: 'text-blue-700',
    badgeClass: 'text-blue-600 bg-white border-blue-200',
    containerClass: 'bg-blue-50/20 border-blue-100/50',
    cardBorderClass: 'border-blue-50 hover:border-blue-200',
    progressClass: 'bg-gradient-to-r from-blue-400 to-blue-600',
    accentText: 'text-blue-500'
  },
  { 
    id: 'review', 
    title: 'รอตรวจสอบ', 
    dotColor: 'bg-amber-500', 
    headerClass: 'bg-amber-50 border-amber-100',
    textClass: 'text-amber-700',
    badgeClass: 'text-amber-600 bg-white border-amber-200',
    containerClass: 'bg-amber-50/20 border-amber-100/50',
    cardBorderClass: 'border-amber-50 hover:border-amber-200',
    progressClass: 'bg-gradient-to-r from-amber-400 to-amber-600',
    accentText: 'text-amber-500'
  },
  { 
    id: 'returned', 
    title: 'ตีกลับ', 
    dotColor: 'bg-rose-500',
    headerClass: 'bg-rose-50 border-rose-100',
    textClass: 'text-rose-700',
    badgeClass: 'text-rose-600 bg-white border-rose-200',
    containerClass: 'bg-rose-50/20 border-rose-100/50',
    cardBorderClass: 'border-rose-50 hover:border-rose-200',
    progressClass: 'bg-gradient-to-r from-rose-400 to-rose-600',
    accentText: 'text-rose-500'
  },
  { 
    id: 'completed', 
    title: 'เสร็จสิ้น', 
    dotColor: 'bg-emerald-500',
    headerClass: 'bg-emerald-50 border-emerald-100',
    textClass: 'text-emerald-700',
    badgeClass: 'text-emerald-600 bg-white border-emerald-200',
    containerClass: 'bg-emerald-50/20 border-emerald-100/50',
    cardBorderClass: 'border-emerald-50 hover:border-emerald-200',
    progressClass: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
    accentText: 'text-emerald-500'
  }
]

const visibleStages = computed(() => {
  return kanbanStages
})

const selectedTask = ref(null)

// Use props.projects as the source. App.vue now passes only "tasks" here.
const tasks = computed(() => {
    let list = props.projects.filter(p => p.type === 'urgent' || p.type === 'task')

    if (props.userRole === 'staff') {
        list = list.filter(p => p.assignee === props.userName || p.staffName === props.userName)
    }

    return list.map(p => {
        let stage = 'planning';
        const prog = p.progress || 0;
        
        if (p.status === 'completed') stage = 'completed';
        else if (p.status === 'returned') stage = 'returned';
        else if (p.status === 'review' || prog === 100) stage = 'review';
        else if (prog > 0) stage = 'processing';
        else stage = 'planning';

        return { ...p, stage }
    })
})

const submissions = ref([])

const openTaskDetails = async (task) => {
  selectedTask.value = task
  submissions.value = [] // Reset
  try {
      if (task.id) {
          const res = await api.getReports({ missionId: task.id, type: 'task' })
          if (res) {
              // Sort by date desc
              submissions.value = res.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
          }
      }
  } catch (e) {
      console.error("Failed to fetch submissions", e)
  }
}

const getTasksByStage = (stageId) => {
  return tasks.value.filter(task => task.stage === stageId)
}

const getFileIcon = (type) => {
  if (!type) return 'fas fa-file'
  if (type.includes('image') || type.match(/\.(jpg|jpeg|png|gif)$/i)) return 'fas fa-image'
  if (type.includes('pdf') || type.match(/\.pdf$/i)) return 'fas fa-file-pdf'
  if (type.includes('word') || type.match(/\.doc/i)) return 'fas fa-file-word'
  if (type.includes('excel') || type.match(/\.xls/i)) return 'fas fa-file-excel'
  return 'fas fa-file'
}

const openAttachment = (file) => {
  if (file.url) {
    window.open(file.url, '_blank')
  } else {
    alert('ไม่สามารถเปิดไฟล์ได้: ลิงก์ไม่ถูกต้อง')
  }
}

const addTask = () => {
  if (newTask.title && newTask.assignee) {
      const payload = {
        title: newTask.title,
        desc: newTask.description,
        assignee: newTask.assignee,
        deadline: newTask.deadline,
        status: 'planning', 
        priority: newTask.priority,
        type: 'urgent', // งานแทรกที่ไม่เกี่ยวกับงานย่อยประจำโครงการ
        difficulty: Number(newTask.difficulty)
      }
      
      emit('add-project', payload)
      showModal.value = false
      
      // Reset form
      newTask.title = ''
      newTask.description = ''
      newTask.assignee = ''
      newTask.priority = 'NORMAL'
      newTask.deadline = ''
  } else {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
  }
}
 
const approveTask = () => {
    if (selectedTask.value) {
        emit('update-project', selectedTask.value.id, { status: 'completed' })
        selectedTask.value = null
    }
}
 
const returnTask = () => {
    if (selectedTask.value) {
        const reason = prompt("ระบุสาเหตุที่ส่งงานกลับ (ถ้ามี):")
        const updates = { status: 'returned' }
        
        if (reason) {
            const newComments = [...(selectedTask.value.comments || [])]
            newComments.unshift({
                author: props.userName || 'หัวหน้างาน',
                text: `[ส่งงานกลับ] สาเหตุ: ${reason}`,
                date: new Date().toISOString()
            })
            updates.comments = newComments
        }
        
        emit('update-project', selectedTask.value.id, updates)
        selectedTask.value = null
    }
}

const confirmDelete = (task) => {
    taskToDelete.value = task
    showDeleteModal.value = true
}

const executeDelete = () => {
    if (taskToDelete.value) {
        emit('delete-project', taskToDelete.value.id)
        showDeleteModal.value = false
        taskToDelete.value = null
    }
}

// Utility formatDate is now imported from @/utils/date
</script>

<style scoped>
.custom-horizontal-scrollbar::-webkit-scrollbar { height: 10px; }
.custom-horizontal-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-horizontal-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; border: 3px solid #f8fafc; }
.custom-horizontal-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

.custom-scrollbar-slim::-webkit-scrollbar { width: 4px; }
.custom-scrollbar-slim::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar-slim::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.1); border-radius: 20px; }

/* Modal Animations */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
@keyframes pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-pop { animation: pop 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67); }
</style>
