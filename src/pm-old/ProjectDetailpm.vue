<template>
  <div class="space-y-10 text-left animate-fade-in relative">
    
    <div v-if="selectedTaskView" class="animate-fade-in text-left">
      <div class="flex items-center gap-4 mb-8">
        <button @click="selectedTaskView = null" class="w-12 h-12 rounded-full bg-[#121926] text-white flex items-center justify-center hover:bg-indigo-600 transition-all shadow-xl">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="text-left">
          <span class="text-[12px] font-black text-indigo-500 uppercase tracking-[0.3em]">Operational Detail</span>
          <h3 class="text-[16px] font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-1">{{ selectedTaskView.title }}</h3>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
            <div class="space-y-4">
              <h5 class="text-[12px] font-black text-slate-400 uppercase tracking-widest">📋 รายละเอียดการปฏิบัติงาน</h5>
              <p class="text-[14px] font-bold text-slate-600 leading-relaxed italic">{{ selectedTaskView.description || 'ไม่มีข้อมูลรายละเอียดเพิ่มเติม' }}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-slate-50 p-6 rounded-[2rem]">
                <p class="text-[12px] font-black text-slate-400 uppercase mb-2 tracking-widest">Operator (ผู้รับผิดชอบ)</p>
                <p class="text-[16px] font-black text-slate-800 italic uppercase">{{ selectedTaskView.staffName }}</p>
              </div>
              <div class="bg-rose-50 p-6 rounded-[2rem]">
                <p class="text-[12px] font-black text-rose-400 uppercase mb-2 tracking-widest">Deadline (กำหนดส่ง)</p>
                <p class="text-[16px] font-black text-rose-600 italic">{{ formatDate(selectedTaskView.deadline) }}</p>
                <p v-if="selectedTaskView.createdAt" class="text-[12px] font-bold text-rose-400 mt-2">Created: {{ formatDateFull(selectedTaskView.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6 text-left">
          <button @click="completeTask(selectedTaskView)" class="w-full py-8 bg-emerald-500 text-white rounded-[3rem] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all">
            <i class="fas fa-check-circle mr-3"></i> Mark as Completed
          </button>
          <button @click="deleteTask(selectedTaskView)" class="w-full py-8 bg-rose-50 text-rose-500 rounded-[3rem] font-black uppercase tracking-widest hover:bg-rose-100 transition-all">
            <i class="fas fa-trash-alt mr-3"></i> Terminate Mission
          </button>
        </div>
      </div>
    </div>

    <div v-else class="space-y-10">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button @click="$emit('go-back')" class="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-all">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div>
            <h2 class="text-[16px] font-black text-slate-900 tracking-tighter uppercase italic leading-none">{{ selectedProject || 'STRATEGIC MISSION' }}</h2>
            <p class="text-slate-400 text-[12px] font-bold uppercase mt-2 tracking-widest italic">Operations Control Center</p>
          </div>
        </div>
        <div class="flex gap-4">
          <!-- Button for distributing work to staff -->
          <button @click="showAssignModal = true" class="bg-[#5c56f0] text-white px-8 py-4 rounded-[2rem] text-[12px] font-black uppercase shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2">
            <i class="fas fa-user-plus"></i>
            แบ่งงานให้กำลังพล
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12 text-left text-left text-left">
        <div class="lg:col-span-2 space-y-6 text-left text-left text-left text-left">
          <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3 text-left">
            <i class="fas fa-tasks text-[#5c56f0]"></i> MISSION DEPLOYMENT LIST
          </h3>

          <div v-if="subTasks.length > 0" class="grid grid-cols-1 gap-5 text-left text-left text-left text-left">
            <div v-for="(task, index) in subTasks" :key="index" 
                 @click="selectedTaskView = task"
                 class="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all animate-pop cursor-pointer text-left text-left">
              
              <div class="flex flex-col md:flex-row md:items-start justify-between gap-8 text-left text-left text-left text-left text-left">
                <div class="space-y-4 flex-1 text-left text-left text-left text-left text-left">
                  <div class="flex items-center gap-4 text-left text-left text-left text-left text-left text-left">
                    <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-[#5c56f0] group-hover:bg-[#5c56f0] group-hover:text-white transition-colors">
                      <i class="fas fa-bolt text-sm"></i>
                    </div>
                    <h4 class="font-black text-slate-800 uppercase italic tracking-tighter text-[14px] leading-none">{{ task.title }}</h4>
                  </div>
                  <p class="text-slate-500 font-bold text-[12px] leading-relaxed line-clamp-2 ml-14">{{ task.description }}</p>
                  <div class="flex items-center gap-3 ml-14 pt-2">
                    <span class="text-[12px] font-black text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg uppercase tracking-widest italic">👤 {{ task.staffName }}</span>
                    <span v-if="task.deadline" class="text-[12px] font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg uppercase tracking-widest italic">📅 {{ formatDate(task.deadline) }}</span>
                  </div>
                </div>
                <i class="fas fa-chevron-right text-slate-100 group-hover:text-indigo-200 transition-colors text-2xl text-left"></i>
              </div>
            </div>
          </div>
          
          <div v-else class="w-full aspect-[16/6] rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-12 bg-slate-50/30 text-center text-center">
            <p class="text-slate-300 font-black italic uppercase tracking-widest text-lg text-center text-center text-center">READY FOR STRATEGIC DEPLOYMENT</p>
          </div>
        </div>

        <div class="space-y-6 text-left text-left text-left text-left">
          <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 text-left text-left">QUICK COMMAND STATS</h3>
          <div class="bg-[#121926] p-10 rounded-[3.5rem] shadow-2xl min-h-[300px] flex flex-col justify-between text-left text-left">
            <h5 class="text-indigo-300 font-black italic uppercase tracking-widest text-[10px] text-left text-left">Active Tasks Count</h5>
            <p class="text-7xl font-black text-white italic tracking-tighter text-left text-left">{{ subTasks.length }}</p>
            <div class="w-full h-1 bg-white/10 rounded-full mt-10 text-left"></div>
          </div>
        </div>
      </div>
    </div>

    <transition name="modal-fade">
      <div v-if="showAssignModal" 
           class="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-[#0b1121]/95 backdrop-blur-sm transition-all duration-300 text-left text-left text-left">
        <div class="bg-white w-full max-w-xl rounded-[4rem] p-14 shadow-[0_40px_120px_rgba(0,0,0,0.6)] animate-pop text-left relative mx-6">
          <header class="mb-10 text-left text-left text-left">
            <h3 class="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none text-left text-left">Deploy Task</h3>
            <p class="text-indigo-500 text-[12px] font-black uppercase mt-3 tracking-widest italic text-left text-left">Mission Allocation Hub</p>
          </header>

          <div class="space-y-6 text-left text-left text-left">
            <div class="space-y-2 text-left text-left">
              <label class="text-[12px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left text-left">หัวข้อภารกิจ</label>
              <input v-model="newTask.title" type="text" placeholder="ระบุภารกิจ..." 
                     class="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none font-bold text-[16px] focus:border-indigo-500/30 transition-all text-left">
            </div>

              <label class="text-[12px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left text-left">รายละเอียดปฏิบัติงาน</label>
              <textarea v-model="newTask.description" rows="3" placeholder="รายละเอียด..." 
                        class="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none font-bold text-[14px] resize-none focus:border-indigo-500/30 transition-all text-left"></textarea>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-left">
              <div class="space-y-2 text-left text-left">
                <label class="text-[12px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left text-left">เลือกกำลังพล</label>
                <select v-model="newTask.staffId" class="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none font-bold appearance-none cursor-pointer focus:border-indigo-500/30 transition-all text-left text-left">
                  <option value="">เลือกพนักงาน</option>
                  <option v-for="staff in allStaff" :key="staff.id" :value="staff.id">
                    {{ staff.name }} ({{ staff.role }})
                  </option>
                </select>
              </div>
              <div class="space-y-2 text-left text-left">
                <label class="text-[12px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left text-left">กำหนดส่ง (Deadline)</label>
                <input v-model="newTask.deadline" type="date" class="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none font-bold cursor-pointer focus:border-indigo-500/30 transition-all text-left text-left">
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-12 text-left text-left text-left">
            <button @click="assignTask" class="py-6 bg-[#5c56f0] text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 active:scale-95 transition-all text-center text-center">Deploy</button>
            <button @click="showAssignModal = false" class="py-6 bg-slate-50 text-slate-400 rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-100 transition-all text-center text-center">Cancel</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import api from '@/api'

const props = defineProps({ 
  allStaff: Array,
  selectedProject: Object
})
const emit = defineEmits(['go-back', 'notify']) 

// State Management
const showAssignModal = ref(false)
const selectedTaskView = ref(null) 
const subTasks = ref([]) 

// ฟอร์มงานใหม่
const newTask = reactive({ title: '', description: '', staffId: '', deadline: '' })

// โหลดข้อมูลจาก API
const fetchSubTasks = async () => {
  if (!props.selectedProject?.id) return
  try {
    const data = await api.getTasks('task', { projectId: props.selectedProject.id })
    if (data) subTasks.value = data
  } catch (e) {
    console.error("Failed to fetch subtasks", e)
  }
}

onMounted(() => {
  fetchSubTasks()
})

// บันทึกงานเมื่อมีการเปลี่ยนแปลงโครงการ
watch(() => props.selectedProject?.id, () => {
  fetchSubTasks()
})

const assignTask = async () => {
  if (newTask.title && newTask.staffId) {
    try {
        const staff = props.allStaff.find(s => s.id === parseInt(newTask.staffId))
        const taskData = {
          ...JSON.parse(JSON.stringify(newTask)),
          projectId: props.selectedProject.id,
          type: 'task',
          staffName: staff ? staff.name : 'Unknown Operator'
        }
        
        const response = await api.createTask(taskData)
        if (response) {
            emit('notify', `Deploy ภารกิจ "${newTask.title}" สำเร็จ!`)
            await fetchSubTasks()
            Object.keys(newTask).forEach(key => newTask[key] = '')
            showAssignModal.value = false
        }
    } catch (e) {
        console.error("Error assigning task", e)
        alert("เกิดข้อผิดพลาดในการมอบหมายงาน")
    }
  } else {
    alert('กรุณากรอกข้อมูลภารกิจให้ครบถ้วนด้วยครับน้อง!')
  }
}

const deleteTask = async (task) => {
  if(confirm('ยืนยันการยกเลิกภารกิจนี้ใช่หรือไม่?')) {
    try {
        await api.deleteTask(task.id)
        emit('notify', `ยกเลิกภารกิจ "${task.title}" เรียบร้อยแล้ว`)
        await fetchSubTasks()
        selectedTaskView.value = null
    } catch (e) {
        console.error("Error deleting task", e)
    }
  }
}

const completeTask = async (task) => {
  try {
      await api.updateTask(task.id, { status: 'completed', progress: 100 })
      emit('notify', `ภารกิจ "${task.title}" เสร็จสิ้นแล้ว!`)
      await fetchSubTasks()
      selectedTaskView.value = null
  } catch (e) {
      console.error("Error completing task", e)
  }
}

const formatDate = (dateString) => {
    if (!dateString) return '--/--/----';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '--/--/----';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

const formatDateFull = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}
</script>

<style scoped>
/* Animations */
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-pop { animation: pop 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67); }

/* Modal Transitions: ปรับให้นุ่มนวลตอน Overlay แผ่ออก */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.4s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

h1, h2, h3, h4, h5, p, span, label, input, select, textarea {
  font-family: 'Inter', 'Kanit', sans-serif;
}
</style>
