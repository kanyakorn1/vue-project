<template>
  <div class="min-h-full flex flex-col relative">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0 relative z-10 animate-fade-down">
      <div>
        <h2 class="text-3xl font-black text-slate-800 tracking-tighter uppercase flex items-center gap-2">
            <i class="fas fa-layer-group text-indigo-600 text-2xl"></i> MISSION COMMAND BOARD
        </h2>
        <p class="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase pl-9">7-STAGE PROGRESSIVE WORKFLOW MANAGEMENT</p>
      </div>

       <button @click="showAddModal = true" class="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
           <i class="fas fa-plus"></i> สร้างงานใหม่
       </button>
    </div>

    <!-- Kanban Board (7 Stages) -->
    <div class="flex-1 pb-4 relative z-10 overflow-x-auto custom-scrollbar flex flex-col min-h-0">
        <div class="flex gap-4 min-h-[700px] h-full min-w-[1100px] px-2 flex-nowrap">
            
            <div v-for="(col, index) in columnData" :key="col.id" 
                 class="flex-1 min-w-0 flex flex-col gap-2 animate-fade-up"
                 :style="{ animationDelay: `${index * 100}ms` }">
                
                <!-- Column Header -->
                <div class="flex items-center gap-1.5 px-2 mb-1">
                    <div :class="['w-2 h-2 rounded-full shrink-0 shadow-sm', col.dotColor]"></div>
                    <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest truncate">{{ col.title }}</span>
                    <span class="text-[8px] font-bold text-slate-300 ml-auto shrink-0 bg-white px-1.5 rounded-md shadow-sm">{{ col.tasks.length }}</span>
                </div>

                <!-- Column Container -->
                <div :class="['flex-1 rounded-2xl p-2 flex flex-col gap-2 overflow-y-auto border backdrop-blur-sm transition-colors duration-300', col.bgColor, col.borderColor]">
                    <div v-for="task in col.tasks" :key="task.id" 
                        @click="openTaskDetails(task)"
                        class="bg-white p-3 rounded-xl shadow-sm border-t-[3px] cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                        :class="[getTaskBorder(task.priority)]"
                    >
                        <!-- Badge -->
                        <span :class="['px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase mb-3 inline-block border', getTaskBadge(task.priority)]">
                            {{ task.priority }}
                        </span>

                        <!-- Title -->
                        <h4 class="text-xs font-black text-slate-800 leading-relaxed mb-4 line-clamp-2">{{ task.title }}</h4>

                        <!-- Progress -->
                        <div class="w-full h-1 bg-slate-100 rounded-full mb-3 overflow-hidden">
                            <div :class="['h-full rounded-full', col.barColor]" :style="{ width: (task.progress || 0) + '%' }"></div>
                        </div>

                        <!-- Footer -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="w-5 h-5 rounded-full bg-slate-200 border border-white">
                                    <img :src="`https://api.dicebear.com/9.x/avataaars/svg?seed=${task.assignee || task.staffName}`" class="w-full h-full rounded-full" />
                                </div>
                                <span class="text-[9px] font-bold text-slate-400">{{ task.assignee || task.staffName }}</span>
                            </div>
                            <i v-if="task.editRequested" class="fas fa-exclamation-circle text-amber-500 text-[10px] animate-pulse"></i>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- Modals -->
    <Teleport to="#modal-target">
        <!-- Add Task Modal -->
        <transition name="modal-fade">
            <div v-if="showAddModal" class="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                <div class="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-pop text-left">
                    <h3 class="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-6">สร้างงานแทรกใหม่</h3>
                    <div class="space-y-4">
                        <div class="space-y-1">
                            <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">หัวข้อภารกิจ</label>
                            <input v-model="newTask.title" placeholder="ระบุภารกิจ..." class="w-full px-7 py-3.5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none font-bold text-[14px]">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">ผู้รับผิดชอบ</label>
                            <select v-model="newTask.assignee" class="w-full px-7 py-3.5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none font-bold text-[14px] appearance-none cursor-pointer">
                                <option value="">เลือกพนักงาน</option>
                                <option v-for="staff in allStaff" :key="staff.id" :value="staff.name">{{ staff.name }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex gap-4 mt-8">
                        <button @click="addTask" class="flex-1 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-[12px] hover:bg-indigo-700 transition-all">ยืนยัน</button>
                        <button @click="showAddModal = false" class="flex-1 py-4 bg-slate-50 text-slate-400 rounded-[1.5rem] font-black uppercase text-[12px] hover:bg-slate-100 transition-all">ยกเลิก</button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Task Detail Modal (Simplified implementation of requested detail view) -->
        <transition name="modal-fade">
            <div v-if="selectedTask" class="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm" @click.self="selectedTask = null">
                <div class="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-pop relative text-left max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <div class="flex justify-between items-start mb-6">
                        <span :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest', getTaskBadge(selectedTask.priority)]">
                            {{ selectedTask.priority }}
                        </span>
                        <button @click="selectedTask = null" class="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100"><i class="fas fa-times"></i></button>
                    </div>
                    
                    <h3 class="text-2xl font-black text-slate-900 leading-tight mb-4 uppercase italic">{{ selectedTask.title }}</h3>
                    <p class="text-slate-500 font-bold text-sm leading-relaxed mb-8 italic">{{ selectedTask.description || selectedTask.desc || 'ไม่มีรายละเอียดเพิ่มเติม' }}</p>

                    <div class="grid grid-cols-2 gap-4 mb-8">
                        <div class="bg-slate-50 p-4 rounded-2xl">
                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">ผู้รับผิดชอบ</p>
                            <p class="text-sm font-black text-slate-700 capitalize italic">{{ selectedTask.assignee || selectedTask.staffName }}</p>
                        </div>
                        <div class="bg-indigo-50 p-4 rounded-2xl">
                            <p class="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">ความคืบหน้า</p>
                            <p class="text-sm font-black text-indigo-600 italic">{{ selectedTask.progress || 0 }}%</p>
                        </div>
                    </div>

                    <!-- Submission History -->
                    <div v-if="taskSubmissions && taskSubmissions.length > 0" class="mb-8 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                        <h5 class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <i class="fas fa-history"></i> ประวัติการส่งงาน
                        </h5>
                        <div class="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                            <div v-for="(sub, i) in taskSubmissions" :key="i" class="text-left bg-white p-3 rounded-xl border border-emerald-50 shadow-sm relative">
                                <span class="absolute top-2 right-3 text-[8px] font-bold text-slate-300">{{ formatDate(sub.date || sub.createdAt) }}</span>
                                <p class="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-tighter">รอบการส่งที่ {{ taskSubmissions.length - i }}</p>
                                <p class="text-[11px] font-bold text-slate-600 leading-relaxed italic line-clamp-2">"{{ sub.description || sub.content }}"</p>
                            </div>
                        </div>
                    </div>

                    <!-- Comments Section -->
                    <div class="mb-8 pt-4 border-t border-slate-50">
                        <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <i class="fas fa-comments"></i> บันทึกและความเห็น
                        </h5>
                        <div class="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2 mb-4">
                            <div v-for="(c, i) in selectedTask.comments" :key="i" class="bg-slate-50 p-3 rounded-xl">
                                <div class="flex justify-between items-start mb-1">
                                    <span class="text-[9px] font-black text-indigo-500 uppercase italic">{{ c.sender || c.author }}</span>
                                    <span class="text-[8px] font-bold text-slate-300">{{ formatDate(c.date || c.createdAt) }}</span>
                                </div>
                                <p class="text-[11px] font-bold text-slate-600 leading-relaxed">{{ c.text }}</p>
                            </div>
                            <div v-if="!selectedTask.comments?.length" class="text-center py-4 opacity-30 italic text-[10px] font-black uppercase">
                                ยังไม่มีข้อเสนอแนะ
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <input v-model="newTaskComment" @keyup.enter="postComment" placeholder="เพิ่มความเห็น..." class="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] font-bold outline-none focus:bg-white focus:border-indigo-400 transition-all">
                            <button @click="postComment" class="bg-indigo-600 text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
                                <i class="fas fa-paper-plane text-[10px]"></i>
                            </button>
                        </div>
                    </div>

                    <!-- PM Actions -->
                    <div class="space-y-3 pt-6 border-t border-slate-100">
                        <button v-if="selectedTask.status === 'review'" @click="updateTaskStatus('completed')" 
                                class="w-full py-4 bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase text-[12px] shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                           <i class="fas fa-check-double"></i> อนุมัติและจบงาน
                        </button>
                        <button v-if="selectedTask.status === 'review'" @click="updateTaskStatus('returned')"
                                class="w-full py-4 bg-slate-50 text-slate-500 rounded-[1.5rem] font-black uppercase text-[12px] hover:bg-slate-100 transition-all">
                           ส่งกลับไปแก้ไข
                        </button>
                        <button @click="showDeleteConfirm = true"
                                class="w-full py-4 text-rose-500 font-black uppercase text-[10px] hover:text-rose-700 transition-all flex items-center justify-center gap-2">
                           <i class="fas fa-trash-alt"></i> ลบภารกิจนี้
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Delete Confirmation Modal -->
        <transition name="modal-fade">
            <div v-if="showDeleteConfirm" class="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                <div class="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-pop text-center">
                    <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-exclamation-triangle text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">ยืนยันการลบงาน</h3>
                    <p class="text-slate-500 font-bold text-sm mb-8">คุณแน่ใจหรือไม่ที่จะลบภารกิจนี้? <br>ข้อมูลทั้งหมดจะหายไปถาวร</p>
                    <div class="flex gap-4">
                        <button @click="confirmDelete" class="flex-1 py-4 bg-rose-500 text-white rounded-[1.2rem] font-black uppercase text-[12px] shadow-lg hover:bg-rose-600 transition-all">ยืนยันลบ</button>
                        <button @click="showDeleteConfirm = false" class="flex-1 py-4 bg-slate-50 text-slate-400 rounded-[1.2rem] font-black uppercase text-[12px] hover:bg-slate-100 transition-all">ยกเลิก</button>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import api from '@/api';
import { formatDate } from '@/utils/date';

const props = defineProps(['projects', 'allStaff']);
const emit = defineEmits(['refresh', 'notify', 'add-project', 'update-project']);

const showAddModal = ref(false);
const showDeleteConfirm = ref(false);
const selectedTask = ref(null);
const taskSubmissions = ref([]);
const newTaskComment = ref('');
const newTask = reactive({ title: '', assignee: '', priority: 'normal' });

// Local tasks filtered from projects prop (which contains urgent tasks for Kanban)
const localTasks = computed(() => {
    return (props.projects || []).filter(p => p.type === 'urgent' || p.type === 'task');
});



const columnData = computed(() => [
    { 
        id: 'planning', title: 'เตรียมการ', dotColor: 'bg-slate-300', 
        bgColor: 'bg-slate-50/50', borderColor: 'border-slate-100', barColor: 'bg-slate-400',
        tasks: localTasks.value.filter(t => (t.progress || 0) === 0 && t.status !== 'completed' && t.status !== 'review' && t.status !== 'returned')
    },
    { 
        id: 'in-progress', title: 'ดำเนินการ', dotColor: 'bg-indigo-400', 
        bgColor: 'bg-indigo-50/30', borderColor: 'border-indigo-100', barColor: 'bg-indigo-400',
        tasks: localTasks.value.filter(t => (t.progress || 0) > 0 && (t.progress || 0) < 100 && t.status !== 'completed' && t.status !== 'review' && t.status !== 'returned')
    },
    { 
        id: 'review', title: 'รอตรวจสอบ', dotColor: 'bg-amber-400', 
        bgColor: 'bg-amber-50/30', borderColor: 'border-amber-100', barColor: 'bg-amber-400',
        tasks: localTasks.value.filter(t => t.status === 'review' || (t.progress === 100 && t.status !== 'completed' && t.status !== 'returned'))
    },
    { 
        id: 'returned', title: 'ถูกส่งกลับ', dotColor: 'bg-rose-400', 
        bgColor: 'bg-rose-50/30', borderColor: 'border-rose-100', barColor: 'bg-rose-500',
        tasks: localTasks.value.filter(t => t.status === 'returned' || (t.editRequested && t.status !== 'completed'))
    },
    { 
        id: 'completed', title: 'เสร็จสิ้น', dotColor: 'bg-teal-500', 
        bgColor: 'bg-teal-50/30', borderColor: 'border-teal-100', barColor: 'bg-teal-500',
        tasks: localTasks.value.filter(t => t.status === 'completed')
    }
]);

const getTaskBorder = (p) => {
    const pLow = (p || '').toLowerCase();
    if (pLow === 'urgent' || pLow === 'high') return 'border-t-rose-400';
    if (pLow === 'medium' || pLow === 'normal') return 'border-t-indigo-400';
    return 'border-t-slate-400';
}

const getTaskBadge = (p) => {
    const pLow = (p || '').toLowerCase();
    if (pLow === 'urgent' || pLow === 'high') return 'bg-rose-50 text-rose-500 border-rose-100';
    if (pLow === 'medium' || pLow === 'normal') return 'bg-indigo-50 text-indigo-500 border-indigo-100';
    return 'bg-slate-50 text-slate-500 border-slate-100';
}

const openTaskDetails = async (task) => {
    selectedTask.value = task;
    taskSubmissions.value = [];
    try {
        const [freshTask, reports] = await Promise.all([
            api.getMissionById(task.id),
            api.getReports({ missionId: task.id })
        ]);
        if (freshTask) selectedTask.value = freshTask;
        if (reports) taskSubmissions.value = reports.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (e) {
        console.error('Fetch task detail fail:', e);
    }
}

const postComment = async () => {
    if (!newTaskComment.value.trim() || !selectedTask.value) return;
    try {
        const sender = localStorage.getItem('userName') || 'PM';
        const res = await api.addComment(selectedTask.value.id, newTaskComment.value, sender);
        if (res && res.comments) {
            selectedTask.value.comments = res.comments;
        }
        newTaskComment.value = '';
        emit('notify', 'เพิ่มความเห็นเรียบร้อย');
    } catch (e) {
        console.error('Post comment fail:', e);
    }
}

const addTask = () => {
    if (!newTask.title || !newTask.assignee) {
        emit('notify', 'กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }
    const payload = {
        title: newTask.title,
        assignee: newTask.assignee,
        staffName: newTask.assignee,
        priority: newTask.priority,
        type: 'urgent',
        status: 'planning',
        progress: 0
    };
    emit('add-project', payload);
    showAddModal.value = false;
    newTask.title = '';
    newTask.assignee = '';
}

const updateTaskStatus = async (status) => {
    if (!selectedTask.value) return;
    try {
        const updates = { status };
        if (status === 'completed') updates.progress = 100;
        
        await api.updateTask(selectedTask.value.id, updates);
        emit('notify', updates.status === 'completed' ? 'ยืนยันงานเสร็จสิ้นแล้ว' : 'ส่งงานกลับไปแก้ไขเรียบร้อย');
        emit('refresh');
        selectedTask.value = null;
    } catch (e) {
        console.error('Update Task Fail:', e);
    }
}

const confirmDelete = async () => {
    if (!selectedTask.value) return;
    try {
        await api.deleteTask(selectedTask.value.id);
        emit('notify', 'ลบภารกิจเรียบร้อยแล้ว');
        emit('refresh');
        showDeleteConfirm.value = false;
        selectedTask.value = null;
    } catch (e) {
        console.error('Delete Task Fail:', e);
        emit('notify', 'เกิดข้อผิดพลาดในการลบ');
    }
}
</script>

<style scoped>
@keyframes fade-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
@keyframes fade-down {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
@keyframes pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

.animate-fade-up { animation: fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-fade-down { animation: fade-down 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-pop { animation: pop 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards; }

.custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.dashed-border {
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='%23CBD5E1FF' stroke-width='1' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
}
</style>
