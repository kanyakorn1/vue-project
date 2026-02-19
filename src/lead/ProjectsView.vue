<template>
  <div class="space-y-10 text-left">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-[16px] font-black text-slate-900 tracking-tighter uppercase italic leading-none text-left">แผนงานยุทธศาสตร์</h2>
        <p class="text-slate-400 text-[12px] font-bold uppercase mt-2 tracking-widest italic text-left">แผนงานระดับยุทธศาสตร์บริษัท</p>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- Status Filter (New) -->
        <div class="relative">
             <i class="fas fa-tasks absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
             <select v-model="selectedStatus" class="pl-10 pr-10 py-3 bg-white border border-slate-100 rounded-[1.5rem] text-xs font-black uppercase text-slate-700 outline-none shadow-sm cursor-pointer hover:border-indigo-100 focus:border-indigo-300 transition-all appearance-none h-full">
                <option value="all">ทั้งหมด</option>
                <option value="active">งานที่กำลังดำเนินการ</option>
                <option value="completed">งานที่เสร็จสมบูรณ์</option>
             </select>
             <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-[10px] pointer-events-none"></i>
        </div>

        <!-- Dept Filter (Existing) -->
        <div v-if="userRole === 'manager'" class="relative">
             <i class="fas fa-filter absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
             <select v-model="selectedDept" class="pl-10 pr-10 py-3 bg-white border border-slate-100 rounded-[1.5rem] text-xs font-black uppercase text-slate-700 outline-none shadow-sm cursor-pointer hover:border-indigo-100 focus:border-indigo-300 transition-all appearance-none h-full">
                <option value="All">ทุกแผนก</option>
                <option value="IT">แผนกไอที (IT)</option>
                <option value="Marketing">การตลาด (Marketing)</option>
                <option value="HR">ทรัพยากรบุคคล (HR)</option>
                <option value="Design">ทีมออกแบบ (Design)</option>
                <option value="Sales">ฝ่ายขาย (Sales)</option>
             </select>
             <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-[10px] pointer-events-none"></i>
        </div>
        
        <button v-if="userRole === 'lead' || userRole === 'pm'" @click="showModal = true" class="bg-[#5c56f0] text-white px-6 py-3 rounded-[2rem] text-[12px] font-black uppercase shadow-xl shadow-indigo-200 hover:-translate-y-1 active:scale-95 transition-all whitespace-nowrap">
          + สร้างโครงการใหม่
        </button>
      </div>
    </div>

    <div v-if="filteredProjects && filteredProjects.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
      <div v-for="project in filteredProjects" :key="project.id" 
           @click="$emit('card-click', project)"
           :class="['p-6 rounded-[2.5rem] shadow-sm border relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 text-left cursor-pointer flex flex-col',
             project.status === 'completed' ? 'bg-[#ecfdf5] border-emerald-500' : 'bg-white border-slate-50']">
        
        <!-- 🎯 UNIFIED CARD STRUCTURE -->
        <!-- Top Colored Bar -->
        <div :style="{ backgroundColor: getProgressColor(project.progress, null, project.status) }" class="w-full h-2.5 absolute top-0 left-0"></div>
        
        <div class="flex flex-col h-full">
            <div class="flex justify-between items-start mb-2">
              <span :class="['text-[12px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shrink-0', 
                project.status === 'completed' ? 'bg-emerald-100 text-[#10b981]' : 'bg-indigo-50 text-[#5c56f0]']">
                {{ translateStatus(project.status) }}
              </span>
            </div>
            
            <h4 class="mt-3 text-[16px] font-black text-slate-800 uppercase italic tracking-tighter text-left line-clamp-2 leading-tight">
                {{ project.title }}
            </h4>
            
            <!-- 🛠️ Quick Actions -->
            <div class="absolute top-6 right-6 flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button v-if="userRole === 'manager' || userRole === 'lead'" @click.stop="openEditOnCard(project)" 
                        class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center border border-indigo-100 shadow-sm">
                    <i class="fas fa-edit text-[10px]"></i>
                </button>
                <button v-if="userRole === 'manager' || userRole === 'lead'" @click.stop="selectedProject = project; showDeleteModal = true" 
                        class="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-rose-100 shadow-sm">
                    <i class="fas fa-trash-alt text-[10px]"></i>
                </button>
            </div>
            <p class="text-[12px] text-slate-400 font-bold mt-1 leading-relaxed text-left line-clamp-2">
                {{ project.desc || project.description || 'ไม่มีรายละเอียดระบุไว้' }}
            </p>
            
            <div class="mt-auto pt-4">
              <span class="text-[12px] font-black uppercase tracking-widest italic" :class="isOverdue(project.deadline || project.dueDate, project.progress) ? 'text-rose-600' : 'text-slate-900'">
                กำหนดส่ง: {{ formatDate(project.deadline || project.dueDate) }}
              </span>
            </div>
            
            <div class="mt-8 text-left">
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
        </div>
      </div>
    </div>
    <div v-else class="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <i class="fas fa-folder-open text-2xl"></i>
        </div>
        <p class="text-slate-400 font-bold">ไม่พบโครงการในแผนกของคุณในขณะนี้</p>
    </div>

    <!-- Create Project Modal -->
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
                <input v-model="newProject.title" type="text" placeholder="ชื่อโครงการ..." class="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] outline-none font-bold text-[16px] placeholder:text-slate-300 text-left">
              </div>

              <div class="space-y-2 text-left">
                <label class="text-[12px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left">กำหนดส่ง</label>
                <input v-model="newProject.deadline" type="date" placeholder="ระบุ วัน/เดือน/ปี" class="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] outline-none font-bold text-[16px] text-slate-800 cursor-pointer text-left">
              </div>

              <div class="space-y-2 text-left">
                <label class="text-[12px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left">ระดับความยากง่าย (1-5)</label>
                <div class="flex gap-2 px-2">
                  <button 
                    v-for="lv in [1, 2, 3, 4, 5]" 
                    :key="lv"
                    type="button"
                    @click="newProject.difficulty = lv"
                    :class="['flex-1 py-4 rounded-2xl text-[14px] font-black transition-all border-2',
                      newProject.difficulty === lv ? 'bg-[#5c56f0] text-white border-[#5c56f0] shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-100']"
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
                <textarea v-model="newProject.desc" rows="3" placeholder="ระบุเป้าหมาย..." class="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] outline-none font-bold text-[16px] placeholder:text-slate-300 resize-none text-left"></textarea>
              </div>
            </div>

            <button @click="createProject" class="w-full mt-8 py-5 bg-[#5c56f0] text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all text-center shrink-0">
              อนุมัติแผนงาน
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Project Detail Modal -->
    <Teleport to="#modal-target">
      <Transition name="modal">
        <div v-if="selectedProject" class="absolute inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm" @click.self="selectedProject = null">
          <div class="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative text-left overflow-hidden max-h-[90vh] flex flex-col">
               <div class="absolute top-0 right-0 w-48 h-48 bg-[#5c56f0]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 py-2">
                  <div class="flex justify-between items-start mb-4 relative z-10">
                    <span :class="['text-[12px] font-black px-3 py-1 rounded-lg uppercase tracking-widest', 
                        selectedProject.status === 'completed' ? 'bg-emerald-50 text-[#10b981]' : 'bg-indigo-50 text-[#5c56f0]']">
                        {{ translateStatus(selectedProject.status) }}
                    </span>
                    <div class="flex items-center gap-2">
                        <!-- ✏️ Edit Button -->
                        <button v-if="(userRole === 'manager' || userRole === 'lead') && !isEditing" @click="startEditing" class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all shadow-sm flex items-center justify-center">
                            <i class="fas fa-edit text-xs"></i>
                        </button>
                        <button v-if="userRole === 'manager' || userRole === 'lead'" @click="deleteProject" class="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors">
                            <i class="fas fa-trash-alt text-xs"></i>
                        </button>
                        <button @click="selectedProject = null; isEditing = false" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors">
                            <i class="fas fa-times text-xs"></i>
                        </button>
                    </div>
                 </div>

                  <div class="relative z-10">
                    <!-- Title: Edit vs View -->
                    <div v-if="isEditing" class="space-y-2 mb-4">
                        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">ชื่อแผนงาน</label>
                        <input v-model="editProjectData.title" type="text" class="w-full px-6 py-4 bg-slate-50 border-2 border-indigo-100/30 rounded-2xl outline-none font-black text-lg text-slate-800 focus:border-indigo-500 transition-all">
                    </div>
                    <h2 v-else class="text-2xl font-black text-slate-800 uppercase italic tracking-tighter leading-tight mb-2">{{ selectedProject.title }}</h2>
                    
                    <div class="flex items-center gap-2 mb-6 text-slate-400">
                        <i class="far fa-calendar-alt text-xs"></i>
                        <div v-if="isEditing" class="flex-1">
                             <input v-model="editProjectData.deadline" type="date" class="bg-transparent border-none outline-none text-[11px] font-bold uppercase tracking-widest text-slate-600 cursor-pointer">
                        </div>
                        <span v-else class="text-[11px] font-bold uppercase tracking-widest">กำหนดส่ง: {{ formatDate(selectedProject.deadline || selectedProject.dueDate) }}</span>
                    </div>
                    
                    <div class="space-y-6">
                        <div>
                            <h4 class="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">รายละเอียดของงาน</h4>
                            <textarea v-if="isEditing" v-model="editProjectData.desc" rows="4" class="w-full px-6 py-4 bg-slate-50 border-2 border-indigo-100/30 rounded-[2rem] outline-none font-bold text-sm text-slate-700 resize-none focus:border-indigo-500 transition-all"></textarea>
                            <p v-else class="text-sm text-slate-600 font-bold leading-relaxed bg-slate-50/50 p-5 rounded-2xl border border-slate-50">
                                {{ selectedProject.desc || selectedProject.description || 'ไม่มีรายละเอียดระบุไว้' }}
                            </p>
                        </div>

                        <div class="grid grid-cols-3 gap-2 pt-4 border-t border-slate-50">
                            <div class="bg-slate-50/50 p-4 rounded-2xl col-span-1">
                                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">ความคืบหน้า</span>
                                <div v-if="isEditing" class="flex items-center gap-2">
                                    <input v-model.number="editProjectData.progress" type="number" min="0" max="100" class="w-16 bg-white border-none rounded-lg px-2 py-1 font-black text-indigo-500 shadow-sm outline-none">
                                    <span class="text-indigo-300 font-black">%</span>
                                </div>
                                <span v-else :class="['text-xl font-black', selectedProject.status === 'completed' ? 'text-[#10b981]' : 'text-[#5c56f0]']">
                                    {{ selectedProject.progress || 0 }}%
                                </span>
                            </div>
                            <div class="bg-slate-50/50 p-4 rounded-2xl col-span-1">
                                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">ความยากง่าย</span>
                                <select v-if="isEditing" v-model.number="editProjectData.difficulty" class="w-full bg-white border-none rounded-lg px-2 py-1 font-black text-slate-700 shadow-sm outline-none text-xs">
                                    <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                                </select>
                                <span v-else class="text-xl font-black text-slate-700 italic">{{ selectedProject.difficulty || 3 }} / 5</span>
                            </div>
                            <div class="bg-slate-50/50 p-4 rounded-2xl col-span-1">
                                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">ประเภทงาน</span>
                                <select v-if="isEditing" v-model="editProjectData.type" class="w-full bg-white border-none rounded-lg px-2 py-1 font-black text-slate-700 shadow-sm outline-none text-xs italic">
                                    <option value="project">Project</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="routine">Routine</option>
                                </select>
                                <span v-else class="text-xl font-black text-slate-700 capitalize italic">{{ selectedProject.type || 'Project' }}</span>
                            </div>
                        </div>
                    </div>
                 </div>
               </div>

               <div class="mt-8 flex gap-3 shrink-0">
                  <template v-if="isEditing">
                    <button @click="saveEdit" class="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                        บันทึกการแก้ไข
                    </button>
                    <button @click="cancelEditing" class="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">
                        ยกเลิก
                    </button>
                  </template>
                  <button v-else @click="$emit('card-click', selectedProject); selectedProject = null" class="flex-1 py-4 bg-[#121926] text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                      รายละเอียดของงาน
                  </button>
               </div>
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
import { ref, reactive, computed } from 'vue'
import { formatDate, formatDateFull, isOverdue } from '@/utils/date'

const props = defineProps(['projects', 'userRole', 'deptName'])
const emit = defineEmits(['add-project', 'delete-project', 'update-project', 'card-click', 'notify'])

const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false) // State สำหรับโหมดแก้ไข
const selectedProject = ref(null)
const selectedDept = ref('All')
const selectedStatus = ref('all') // 'all', 'active', 'completed'
const commentText = ref('')

// 🎯 สร้าง Object สำหรับเก็บข้อมูลแก้ไข
const editProjectData = reactive({
    title: '',
    desc: '',
    deadline: '',
    progress: 0,
    difficulty: 3,
    type: 'project'
})

const filteredProjects = computed(() => {
    if (!props.projects) return []
    let list = props.projects
    
    // 1. Filter by Department (for Manager)
    if (props.userRole === 'manager' && selectedDept.value !== 'All') {
        list = list.filter(p => p.dept === selectedDept.value)
    }

    // 2. Filter by Status (Requested: All, In Progress/Active, Completed)
    if (selectedStatus.value !== 'all') {
        if (selectedStatus.value === 'completed') {
            list = list.filter(p => p.status === 'completed')
        } else if (selectedStatus.value === 'active') {
            // Active means not completed (planning, in progress, etc.)
            list = list.filter(p => p.status !== 'completed')
        }
    }

    // 🔥 Sorting Logic: Newest first
    return [...list].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.id || 0)
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.id || 0)
        return timeB - timeA
    })
})

// 🎯 สร้าง Object สำหรับเก็บข้อมูลโครงการใหม่
const newProject = reactive({
  title: '',
  desc: '',
  deadline: '',
  difficulty: 3
})

const openProject = (project) => {
  selectedProject.value = project
}

const createProject = () => {
  if (newProject.title && newProject.deadline) {
    const projectData = {
      title: newProject.title,
      desc: newProject.desc,
      deadline: newProject.deadline,
      difficulty: newProject.difficulty,
      status: 'planning',
      progress: 0,
      type: 'project',
      dept: props.deptName || 'IT'
    }
    
    emit('add-project', projectData)
    
    // Clear Form
    newProject.title = ''
    newProject.desc = ''
    newProject.deadline = ''
    newProject.difficulty = 3
    showModal.value = false
  } else {
    emit('notify', 'กรุณากรอกชื่อโครงการและกำหนดส่งให้ครบครับน้อง!')
  }
}

// 🎯 ฟังก์ชันเริ่มการแก้ไข
const startEditing = () => {
    if (!selectedProject.value) return
    
    // เตรียมข้อมูลลงใน Object แก้ไข
    editProjectData.title = selectedProject.value.title
    editProjectData.desc = selectedProject.value.desc || selectedProject.value.description || ''
    
    // แปลงวันที่สำหรับ input[type="date"]
    if (selectedProject.value.deadline || selectedProject.value.dueDate) {
        const d = new Date(selectedProject.value.deadline || selectedProject.value.dueDate)
        editProjectData.deadline = d.toISOString().split('T')[0]
    } else {
        editProjectData.deadline = ''
    }
    
    editProjectData.progress = selectedProject.value.progress || 0
    editProjectData.difficulty = selectedProject.value.difficulty || 3
    editProjectData.type = selectedProject.value.type || 'project'
    
    isEditing.value = true
}

// 🎯 ยกเลิกการแก้ไข
const cancelEditing = () => {
    isEditing.value = false
}

// 🎯 บันทึกการแก้ไข
const saveEdit = () => {
    if (!selectedProject.value) return
    
    if (!editProjectData.title || !editProjectData.deadline) {
        emit('notify', 'กรุณากรอกข้อมูลส่วนหัวข้อและกำหนดส่งให้ครบถ้วนด้วยครับ!')
        return
    }

    const updatedData = {
        title: editProjectData.title,
        description: editProjectData.desc,
        desc: editProjectData.desc,
        deadline: editProjectData.deadline,
        progress: editProjectData.progress,
        difficulty: editProjectData.difficulty,
        type: editProjectData.type
    }
    
    // 🔥 Auto-update status based on progress (Premium Logic)
    if (updatedData.progress === 100) {
        updatedData.status = 'completed'
    } else if (updatedData.progress > 0) {
        updatedData.status = 'in progress'
    }

    emit('update-project', selectedProject.value.id, updatedData)
    
    // Update local state temporarily for UX
    Object.assign(selectedProject.value, updatedData)
    
    isEditing.value = false
}

// 🎯 เปิดโหมดแก้ไขจากหน้าการ์ดโดยตรง
const openEditOnCard = (project) => {
    selectedProject.value = project
    startEditing()
}

// 🎯 ฟังก์ชันลบโครงการ (Show Modal)
const deleteProject = () => {
  showDeleteModal.value = true
}

// 🎯 ยืนยันการลบ
const executeDelete = () => {
  if (selectedProject.value) {
    emit('delete-project', selectedProject.value.id)
    selectedProject.value = null
    showDeleteModal.value = false
  }
}

// Utility formatDate, formatDateFull, and isOverdue are now imported from @/utils/date

const getProgressColor = (progress, deadline, status) => {
    if (status === 'completed') return '#10b981'; // Green if completed
    return '#5c56f0'; // Purple for everything else (Active/In Progress)
}

const translateStatus = (status) => {
    if (!status) return 'กำลังดำเนินการ';
    const s = status.toLowerCase();
    switch (s) {
        case 'planning': return 'วางแผน';
        case 'in progress': return 'กำลังดำเนินการ';
        case 'completed': return 'เสร็จสิ้นสมบูรณ์';
        case 'active': return 'กำลังดำเนินการ';
        case 'on hold': return 'ระงับชั่วคราว';
        case 'cancelled': return 'ยกเลิก';
        default: return status;
    }
}
</script>

<style scoped>
/* Modal Transition Styles */
.modal-enter-active, .modal-leave-active { transition: opacity 0.4s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
