<template>
  <div class="space-y-10 text-left animate-fade-in relative">
    
    <div v-if="selectedTaskView" class="animate-fade-in text-left">
      <div class="flex items-center gap-6 mb-12">
        <button @click="selectedTaskView = null" class="w-14 h-14 rounded-full bg-[#121926] text-white flex items-center justify-center hover:bg-indigo-600 transition-all shadow-xl">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="text-left text-left">
          <span class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Operational Detail</span>
          <h3 class="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-1 text-left text-left">{{ selectedTaskView.title }}</h3>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
        <div class="lg:col-span-2 space-y-8 text-left">
          <div class="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl space-y-10 text-left">
            <div class="space-y-4 text-left">
              <h5 class="text-[11px] font-black text-slate-400 uppercase tracking-widest text-left">📋 รายละเอียดการปฏิบัติงาน</h5>
              <p class="text-xl font-bold text-slate-600 leading-relaxed italic text-left">{{ selectedTaskView.description || 'ไม่มีข้อมูลรายละเอียดเพิ่มเติม' }}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div class="bg-slate-50 p-8 rounded-[2.5rem] text-left">
                <p class="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest text-left">Operator (ผู้รับผิดชอบ)</p>
                <p class="text-2xl font-black text-slate-800 italic uppercase text-left">{{ selectedTaskView.staffName }}</p>
              </div>
            <!-- Styled Dates Section (Ultra Tight & Even Smaller Version) -->
            <div class="space-y-3 pt-6 border-t border-slate-50">
              <div class="flex items-center gap-2">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest min-w-[65px]">กำหนดส่ง</p>
                <p class="text-lg font-black text-rose-600 tracking-tighter whitespace-nowrap">{{ formatThaiDateShort(selectedTaskView.deadline) }}</p>
              </div>
              <div v-if="selectedTaskView.createdAt" class="flex items-start gap-2">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest min-w-[65px] pt-1">วันที่สร้าง</p>
                <div class="flex flex-col">
                    <p class="text-[11px] font-bold text-slate-500 tracking-tight whitespace-nowrap">{{ formatThaiDateLong(selectedTaskView.createdAt) }}</p>
                    <p class="text-[11px] font-bold text-slate-500 tracking-tight mt-0.5">เวลา {{ formatThaiTime(selectedTaskView.createdAt) }}</p>
                </div>
              </div>
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
      <div class="flex justify-between items-center text-left">
        <div class="flex items-center gap-6 text-left">
          <button @click="emit('go-back')" class="w-14 h-14 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-all cursor-pointer z-10">
            <i class="fas fa-arrow-left text-xl"></i>
          </button>
          <div class="text-left">
            <h2 class="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none text-left">STRATEGIC ERP V3</h2>
            <p class="text-slate-400 text-[11px] font-bold uppercase mt-3 tracking-widest italic text-left">Operation Control Center</p>
          </div>
        </div>
        <button @click="showAssignModal = true" class="bg-[#5c56f0] text-white px-10 py-5 rounded-[2rem] text-xs font-black uppercase shadow-xl hover:-translate-y-1 active:scale-95 transition-all">
          + เพิ่มภารกิจย่อยใหม่
        </button>
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
                    <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-[#5c56f0] group-hover:bg-[#5c56f0] group-hover:text-white transition-colors">
                      <i class="fas fa-bolt text-lg text-left"></i>
                    </div>
                    <h4 class="font-black text-slate-800 uppercase italic tracking-tighter text-2xl leading-none text-left text-left text-left text-left text-left">{{ task.title }}</h4>
                  </div>
                  <p class="text-slate-500 font-bold text-sm leading-relaxed line-clamp-2 ml-16 text-left text-left text-left text-left">{{ task.description }}</p>
                  <div class="flex items-center gap-4 ml-16 pt-2 text-left text-left text-left text-left">
                    <span class="text-[10px] font-black text-slate-600 bg-slate-50 px-4 py-2 rounded-xl uppercase tracking-widest italic text-left text-left text-left text-left">👤 {{ task.staffName }}</span>
                    <span v-if="task.deadline" class="text-[10px] font-black text-rose-600 bg-rose-50 px-4 py-2 rounded-xl uppercase tracking-widest italic text-left text-left text-left text-left text-left">📅 {{ formatDate(task.deadline) }}</span>
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
            <p class="text-indigo-500 text-[10px] font-black uppercase mt-3 tracking-widest italic text-left text-left">Mission Allocation Hub</p>
          </header>

          <div class="space-y-6 text-left text-left text-left">
            <div class="space-y-2 text-left text-left">
              <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left text-left">หัวข้อภารกิจ</label>
              <input v-model="newTask.title" type="text" placeholder="ระบุภารกิจ..." 
                     class="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none font-bold text-lg focus:border-indigo-500/30 transition-all text-left">
            </div>

            <div class="space-y-2 text-left text-left">
              <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left text-left">รายละเอียดปฏิบัติงาน</label>
              <textarea v-model="newTask.description" rows="3" placeholder="รายละเอียด..." 
                        class="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none font-bold text-lg resize-none focus:border-indigo-500/30 transition-all text-left"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-left">
              <div class="space-y-2 text-left text-left">
                <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left text-left">เลือกกำลังพล</label>
                <select v-model="newTask.staffId" class="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none font-bold appearance-none cursor-pointer focus:border-indigo-500/30 transition-all text-left text-left">
                  <option value="">เลือกพนักงาน</option>
                  <option v-for="staff in allStaff" :key="staff.id" :value="staff.id">
                    {{ staff.name }} ({{ staff.position || staff.role }})
                  </option>
                </select>
              </div>
              <div class="space-y-2 text-left text-left">
                <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left text-left">กำหนดส่ง (Deadline)</label>
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

const props = defineProps({ allStaff: Array })
const emit = defineEmits(['go-back', 'notify']) 

// State Management
const showAssignModal = ref(false)
const selectedTaskView = ref(null) 
const subTasks = ref([]) 

// ฟอร์มงานใหม่
const newTask = reactive({ title: '', description: '', staffId: '', deadline: '' })

// โหลดข้อมูลเก่าจาก LocalStorage (จดจำงานเก่า)
onMounted(() => {
  const saved = localStorage.getItem('CORPX_PROJECT_SUBTASKS')
  if (saved) subTasks.value = JSON.parse(saved)
})

// บันทึกงานอัตโนมัติเมื่อมีการเปลี่ยนแปลง
watch(subTasks, (newVal) => {
  localStorage.setItem('CORPX_PROJECT_SUBTASKS', JSON.stringify(newVal))
}, { deep: true })

const assignTask = () => {
  if (newTask.title && newTask.staffId) {
    const staff = props.allStaff.find(s => String(s.staffId || s.id) === String(newTask.staffId))
    subTasks.value.push({
      ...JSON.parse(JSON.stringify(newTask)),
      staffName: staff ? staff.name : 'ไม่พบรายชื่อพนักงาน'
    })

    // ส่งสัญญาณแจ้งเตือนหาหน้าแม่ (App.vue)
    emit('notify', `Deploy ภารกิจ "${newTask.title}" สำเร็จ!`)

    Object.keys(newTask).forEach(key => newTask[key] = '')
    showAssignModal.value = false
  } else {
    alert('กรุณากรอกข้อมูลภารกิจให้ครบถ้วนด้วยครับน้อง!')
  }
}

const deleteTask = (task) => {
  if(confirm('ยืนยันการยกเลิกภารกิจนี้ใช่หรือไม่?')) {
    subTasks.value = subTasks.value.filter(t => t !== task)
    emit('notify', `ยกเลิกภารกิจ "${task.title}" เรียบร้อยแล้ว`)
    selectedTaskView.value = null
  }
}

const completeTask = (task) => {
  emit('notify', `ภารกิจ "${task.title}" เสร็จสิ้นแล้ว!`)
  subTasks.value = subTasks.value.filter(t => t !== task)
  selectedTaskView.value = null
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

// Formatting functions matching the screenshot
const formatThaiDateShort = (dateStr) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    }).replace('พ.ศ. ', '');
}

const formatThaiDateLong = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    }).replace('พ.ศ. ', '');
}

const formatThaiTime = (dateStr) => {
    if (!dateStr) return '00:00';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
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
  font-family: 'LINE Seed Sans TH', sans-serif;
}
</style>
