<template>
  <div class="min-h-full flex flex-col gap-6 animate-fade-up">
    <!-- Header -->
    <div class="flex items-center justify-between shrink-0">
      <div class="text-left">
        <h2 class="text-4xl font-black text-[#121926] tracking-tight uppercase leading-none">Project Roadmap</h2>
        <p class="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-2">Milestones & Targets: {{ monthYearLabel }}</p>
      </div>

       <div class="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           <button @click="prevMonth" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors">
               <i class="fas fa-chevron-left"></i>
           </button>
           <span class="text-sm font-black text-slate-700 px-4 uppercase tracking-widest min-w-[140px] text-center">{{ monthYearLabel }}</span>
           <button @click="nextMonth" class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors">
               <i class="fas fa-chevron-right"></i>
           </button>
       </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div class="lg:col-span-3 bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 flex flex-col overflow-hidden">
            <div class="grid grid-cols-7 mb-8 text-center">
                <div v-for="day in ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']" :key="day" 
                     class="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">
                    {{ day }}
                </div>
            </div>

            <div class="grid grid-cols-7 flex-1 gap-2 overflow-y-auto custom-scrollbar p-6">
                <div v-for="n in startOffset" :key="`empty-${n}`" class="p-4 opacity-0"></div>

                <div v-for="day in daysInMonth" :key="day" 
                     class="relative border border-slate-50 rounded-3xl p-4 hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer flex flex-col gap-2 min-h-[120px]"
                     :class="isToday(day) ? 'bg-indigo-50/30 border-indigo-100' : 'bg-white'"
                >
                    <span class="text-xs font-black w-8 h-8 flex items-center justify-center rounded-full"
                          :class="isToday(day) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-700'">
                        {{ day }}
                    </span>

                    <div class="flex flex-col gap-1.5">
                      <div v-for="event in getEventsForDay(day).slice(0, 2)" :key="event.id" 
                           class="text-[9px] font-bold px-3 py-1.5 rounded-xl truncate shadow-sm transition-transform hover:scale-105"
                           :class="getEventColorClass(event)">
                          {{ event.title }}
                      </div>
                      <div v-if="getEventsForDay(day).length > 2" class="text-[8px] font-black text-slate-300 px-2 mt-0.5 uppercase tracking-tighter">
                        + {{ getEventsForDay(day).length - 2 }} extra
                      </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sidebar -->
        <div class="flex flex-col gap-8 overflow-y-auto custom-scrollbar pr-1">
            <button @click="showAddModal = true" class="bg-indigo-600 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-between group text-left shrink-0">
                <div>
                    <p class="text-[10px] font-black opacity-40 uppercase tracking-[0.3em] mb-1">Project Manager</p>
                    <h3 class="text-xl font-black uppercase tracking-tight leading-none">Record Milestone</h3>
                </div>
                <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-90 transition-transform">
                    <i class="fas fa-rocket text-lg"></i>
                </div>
            </button>

            <div class="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-8 flex flex-col gap-6 flex-1 text-left min-h-0">
                <h3 class="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                    <i class="fas fa-bullseye text-indigo-500"></i> Next Deliverables
                </h3>

                <div class="space-y-6 overflow-y-auto custom-scrollbar flex-1 pr-1">
                    <div v-if="upcomingEvents.length === 0" class="text-center py-20 opacity-20">
                      <p class="text-[10px] font-black uppercase tracking-widest text-center">No projects scheduled</p>
                    </div>
                    <div v-for="event in upcomingEvents" :key="event.id" class="flex gap-4 items-center group">
                        <div class="flex flex-col items-center min-w-[3.5rem] bg-slate-50 rounded-2xl p-3 border border-slate-100 text-center shadow-sm">
                            <span class="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{{ event.monthLabel }}</span>
                            <span class="text-2xl font-black text-slate-800 leading-none">{{ event.day }}</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-xs font-black text-slate-700 truncate capitalize">{{ event.title }}</h4>
                            <p class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wide truncate">{{ event.time || '11:00 AM' }}</p>
                            <span class="inline-block mt-2 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-wider bg-indigo-50 text-indigo-500">
                                Milestone Target
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <transition name="fade">
      <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
        <div class="bg-white w-full max-w-[440px] rounded-[3.5rem] p-12 shadow-2xl animate-pop text-left">
          <h2 class="text-3xl font-black text-slate-800 tracking-tighter mb-2 uppercase italic leading-none">New Milestone</h2>
          <p class="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-10">Deploy a project deliverable</p>
          <div class="space-y-8">
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-[0.2em]">Target Title</label>
              <input v-model="newTask.title" type="text" class="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold text-slate-800 outline-none">
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-[0.2em]">Deadline</label>
              <input v-model="newTask.deadline" type="date" class="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold text-slate-800 outline-none">
            </div>
            <div class="flex gap-4 pt-4">
              <button @click="showAddModal = false" class="flex-1 py-5 bg-slate-100 text-slate-400 rounded-[2rem] font-black uppercase text-[11px] tracking-widest">Cancel</button>
              <button @click="saveNewTask" class="flex-1 py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-widest shadow-xl shadow-indigo-100">Set Target</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/api'

const props = defineProps(['userEmail', 'userRole'])
const viewDate = ref(new Date());
const tasks = ref([]);
const showAddModal = ref(false);
const newTask = ref({ title: '', deadline: new Date().toISOString().split('T')[0] });

const monthYearLabel = computed(() => viewDate.value.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase());
const daysInMonth = computed(() => new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 0).getDate());
const startOffset = computed(() => new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), 1).getDay());

const prevMonth = () => { viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1); };
const nextMonth = () => { viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1); };
const isToday = (day) => {
  const t = new Date();
  return t.getDate() === day && t.getMonth() === viewDate.value.getMonth() && t.getFullYear() === viewDate.value.getFullYear();
};

const fetchMissions = async () => {
  tasks.value = (await api.getTasks('project')) || [];
}
onMounted(fetchMissions)

const getEventsForDay = (day) => tasks.value.filter(t => t.deadline && new Date(t.deadline).getDate() === day && new Date(t.deadline).getMonth() === viewDate.value.getMonth());
const getEventColorClass = (t) => t.status === 'urgent' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-600 text-white';

const upcomingEvents = computed(() => {
  return tasks.value.filter(t => t.deadline && new Date(t.deadline) >= new Date()).sort((a,b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 8).map(t => {
    const d = new Date(t.deadline);
    return { ...t, day: String(d.getDate()).padStart(2, '0'), monthLabel: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() };
  });
});

const saveNewTask = async () => {
  if (!newTask.value.title || !newTask.value.deadline) return;
  await api.createTask({ ...newTask.value, type: 'project', status: 'active', department: 'PM Unit' });
  showAddModal.value = false;
  newTask.value = { title: '', deadline: new Date().toISOString().split('T')[0] };
  await fetchMissions();
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-pop { animation: pop 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67); }
</style>
