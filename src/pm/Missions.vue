<template>
  <div class="space-y-10 text-left">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-sm font-black text-slate-900 tracking-tighter uppercase italic leading-none text-left">ภารกิจปฏิบัติการ</h2>
        <p class="text-slate-400 text-[12px] font-bold uppercase mt-2 tracking-widest italic text-left">ศูนย์ควบคุมปฏิบัติการ | Project Manager</p>
      </div>
      
      <button v-if="userRole === 'lead'" @click="showModal = true" class="bg-[#5c56f0] text-white px-6 py-3 rounded-[2rem] text-[12px] font-black uppercase shadow-xl shadow-indigo-200 hover:-translate-y-1 active:scale-95 transition-all">
        + สร้างโครงการใหม่
      </button>
    </div>

    <div v-if="sortedProjects && sortedProjects.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto custom-scrollbar pb-4 pr-2">
      <div v-for="project in sortedProjects" :key="project.id" 
           @click="$emit('card-click', project)"
           :class="['p-4 rounded-3xl shadow-sm border relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 text-left cursor-pointer flex flex-col',
             project.status === 'completed' ? 'bg-[#ecfdf5] border-emerald-500' : 'bg-white border-slate-50']">
        
        <!-- Top Colored Bar -->
        <div :style="{ backgroundColor: getProgressColor(project.progress, null, project.status) }" class="w-full h-2.5 absolute top-0 left-0"></div>
        
        <div class="flex flex-col h-full">
            <div class="flex justify-between items-start mb-2">
              <span :class="['text-[12px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shrink-0', 
                project.status === 'completed' ? 'bg-emerald-100 text-[#10b981]' : 'bg-indigo-50 text-[#5c56f0]']">
                {{ translateStatus(project.status) }}
              </span>
            </div>
            
            <h4 class="mt-3 text-sm font-black text-slate-800 uppercase italic tracking-tighter text-left line-clamp-2 leading-tight">
                {{ project.title }}
            </h4>
            
            <!-- Quick Delete Button -->
            <button @click.stop="selectedProject = project; showDeleteModal = true" 
                    v-if="userRole === 'lead'"
                    class="absolute top-6 right-6 w-8 h-8 rounded-xl bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white z-20 flex items-center justify-center border border-rose-100 shadow-sm">
                <i class="fas fa-trash-alt text-[10px]"></i>
            </button>
            <p class="text-[12px] text-slate-400 font-bold mt-1 leading-relaxed text-left line-clamp-2 min-h-[2.5rem]">
                {{ project.desc || project.description || 'ไม่มีรายละเอียดระบุไว้' }}
            </p>
            
            <div class="mt-auto pt-4">
              <span class="text-[12px] font-black uppercase tracking-widest italic" :class="isOverdue(project.deadline || project.dueDate, project.progress) ? 'text-rose-600' : 'text-slate-900'">
                กำหนดส่ง: {{ formatDate(project.deadline || project.dueDate) }}
              </span>
            </div>
            
            <div class="mt-4 text-left">
              <div class="flex justify-between items-baseline mb-1">
                <span class="text-[11px] font-black text-slate-300 uppercase tracking-widest">ความยากง่าย</span>
                <span class="text-[11px] font-black text-slate-400 italic">{{ project.difficulty || 3 }}/5</span>
              </div>
              <div class="flex justify-between items-end mb-3">
                <span class="text-[12px] font-black text-slate-300 uppercase tracking-widest">ความคืบหน้า</span>
                <span class="text-[14px] font-black transition-colors duration-300" :style="{ color: getProgressColor(project.progress, null, project.status) }">
                    {{ project.progress || 0 }}%
                </span>
              </div>
              <div class="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden mt-2 border border-slate-50">
                <div class="h-full rounded-full transition-all duration-700 ease-out" 
                     :style="{ 
                        width: `${project.progress || 0}%`, 
                        backgroundColor: getProgressColor(project.progress, null, project.status), 
                        boxShadow: `0 0 10px ${getProgressColor(project.progress, null, project.status)}` 
                     }"></div>
              </div>
            </div>

            <div class="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                <div class="flex -space-x-1.5">
                    <img v-for="m in 3" :key="m" :src="`https://api.dicebear.com/9.x/avataaars/svg?seed=${project.id}-${m}`" class="w-5 h-5 rounded-full border-2 border-white" />
                </div>
                <span class="text-[9px] font-bold text-slate-400">+4 Agents</span>
            </div>
        </div>
      </div>
    </div>
    <div v-else class="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <i class="fas fa-folder-open text-2xl"></i>
        </div>
        <p class="text-slate-400 font-bold">ไม่พบภารกิจในขณะนี้</p>
    </div>

    <!-- Create Mission Modal -->
    <Teleport to="#modal-target">
      <Transition name="page-fade">
        <div v-if="showModal" class="absolute inset-0 z-[1000] flex justify-center items-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div class="bg-white w-full max-w-xl rounded-[3rem] p-8 sm:p-12 shadow-2xl relative text-left flex flex-col max-h-[90vh] overflow-hidden">
            <button @click="showModal = false" class="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors z-20">
              <i class="fas fa-times text-xl"></i>
            </button>
            
            <h3 class="text-xl font-black text-slate-900 uppercase mb-8 italic tracking-tighter text-left shrink-0">เริ่มสร้างแผนงานยุทธศาสตร์</h3>
            
            <div class="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2 py-2">
              <div class="space-y-2 text-left">
                <label class="text-[12px] font-black text-slate-400 uppercase ml-5 tracking-widest">ชื่อแผนงาน</label>
                <input v-model="newProjectData.title" type="text" placeholder="ชื่อโครงการ..." class="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] outline-none font-bold text-[16px] placeholder:text-slate-300 text-left">
              </div>

              <div class="space-y-2 text-left">
                <label class="text-[12px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left">กำหนดส่ง</label>
                <input v-model="newProjectData.deadline" type="date" placeholder="ระบุ วัน/เดือน/ปี" class="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] outline-none font-bold text-[16px] text-slate-800 cursor-pointer text-left">
              </div>

              <div class="space-y-2 text-left">
                <label class="text-[12px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left">ระดับความยากง่าย (1-5)</label>
                <div class="flex gap-2 px-2">
                  <button 
                    v-for="lv in [1, 2, 3, 4, 5]" 
                    :key="lv"
                    type="button"
                    @click="newProjectData.difficulty = lv"
                    :class="['flex-1 py-4 rounded-2xl text-[14px] font-black transition-all border-2',
                      newProjectData.difficulty === lv ? 'bg-[#5c56f0] text-white border-[#5c56f0] shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-100']"
                  >
                    {{ lv }}
                  </button>
                </div>
                <div class="flex justify-between px-5 text-[10px] font-bold text-slate-300 uppercase tracking-widest pt-1">
                  <span>ง่ายมาก</span>
                  <span>ปานกลาง</span>
                  <span>ยากมาก</span>
                </div>
              </div>

              <div class="space-y-2 text-left">
                <label class="text-[12px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left">วัตถุประสงค์โครงการ</label>
                <textarea v-model="newProjectData.desc" rows="3" placeholder="ระบุเป้าหมาย..." class="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] outline-none font-bold text-[16px] placeholder:text-slate-300 resize-none text-left"></textarea>
              </div>
            </div>

            <button @click="createProject" class="w-full mt-8 py-5 bg-[#5c56f0] text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all text-center shrink-0">
              อนุมัติแผนงาน
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="#modal-target">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="absolute inset-0 z-[1010] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div class="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center">
            <div class="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-exclamation-triangle text-3xl"></i>
            </div>
            <h3 class="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-2">ยืนยันการลบ?</h3>
            <p class="text-sm text-slate-400 font-bold mb-8 italic">โครงการนี้จะถูกลบออกจากระบบอย่างถาวร</p>
            <div class="flex gap-3">
               <button @click="executeDelete" class="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-200">
                  ลบทันที
               </button>
               <button @click="showDeleteModal = false" class="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">
                  ยกเลิก
               </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { formatDate, formatDateFull, isOverdue } from '@/utils/date';

const props = defineProps(['projects', 'userRole', 'deptName']);
const emit = defineEmits(['card-click', 'notify', 'delete-project', 'add-project']);

const sortedProjects = computed(() => {
    if (!props.projects) return []
    return [...props.projects].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.id || 0)
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.id || 0)
        return timeB - timeA
    })
})

const showModal = ref(false);
const showDeleteModal = ref(false);
const selectedProject = ref(null);

const newProjectData = reactive({
  title: '',
  desc: '',
  deadline: '',
  difficulty: 3 // Default is Level 3
});

const createProject = () => {
    console.log('[PM] Attempting to create project:', newProjectData)
    if (newProjectData.title && newProjectData.deadline) {
        const projectData = {
            title: newProjectData.title,
            desc: newProjectData.desc,
            deadline: newProjectData.deadline,
            difficulty: newProjectData.difficulty,
            status: 'planning',
            progress: 0,
            type: 'project',
            dept: props.deptName || localStorage.getItem('deptName') || 'IT'
        }
        console.log('[PM] Emitting add-project with:', projectData)
        emit('add-project', projectData);
        
        // Clear Form
        newProjectData.title = '';
        newProjectData.desc = '';
        newProjectData.deadline = '';
        newProjectData.difficulty = 3;
        showModal.value = false;
    } else {
        console.warn('[PM] Validation failed: title or deadline missing')
        alert('กรุณากรอกข้อมูลให้ครบถ้วนด้วยครับน้อง!');
    }
}

const executeDelete = () => {
    if (selectedProject.value) {
        emit('delete-project', selectedProject.value.id);
        selectedProject.value = null;
        showDeleteModal.value = false;
    }
}

const getProgressColor = (progress, deadline, status) => {
    if (status === 'completed') return '#10b981';
    return '#5c56f0';
}

const translateStatus = (status) => {
    if (!status) return 'กำลังดำเนินการ';
    const s = status.toLowerCase();
    switch (s) {
        case 'planning': return 'วางแผน';
        case 'active': return 'กำลังดำเนินการ';
        case 'completed': return 'เสร็จสิ้นสมบูรณ์';
        default: return status;
    }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.4s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
