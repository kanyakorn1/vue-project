<template>
  <div class="space-y-10 text-left animate-fade-in">
    <header class="flex justify-between items-center">
      <div class="text-left">
        <h2 class="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Staff Mission</h2>
        <p class="text-slate-400 text-[11px] font-bold uppercase mt-3 tracking-widest italic">ศูนย์รวมภารกิจและการปฏิบัติงานส่วนบุคคล</p>
      </div>
      <div class="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
        <span class="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Status: Ready for Duty</span>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div class="lg:col-span-2 space-y-6 text-left">
        <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
          <i class="fas fa-clipboard-list text-[#5c56f0]"></i> My Assigned Tasks
        </h3>

        <div v-if="myTasks.length > 0" class="space-y-4">
          <div v-for="(task, index) in myTasks" :key="index" 
               class="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all animate-pop text-left">
            <div class="flex justify-between items-start">
              <div class="space-y-4 flex-1">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                    <i class="fas fa-rocket text-lg"></i>
                  </div>
                  <h4 class="font-black text-slate-800 uppercase italic tracking-tighter text-2xl">{{ task.title }}</h4>
                </div>
                <p class="text-slate-500 font-bold text-sm leading-relaxed ml-16">{{ task.description }}</p>
                <div class="flex gap-4 ml-16 pt-2">
                  <span class="text-[10px] font-black text-rose-600 bg-rose-50 px-4 py-2 rounded-xl uppercase tracking-widest">
                    <i class="far fa-clock mr-1"></i> Deadline: {{ formatDate(task.deadline) }}
                  </span>
                </div>
              </div>
              <button @click="submitWork(task)" class="bg-[#5c56f0] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                ส่งรายงานผล
              </button>
            </div>
          </div>
        </div>

        <div v-else class="w-full aspect-[16/6] rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-12 bg-slate-50/30">
          <p class="text-slate-300 font-black italic uppercase tracking-widest text-lg">ไม่มีภารกิจค้างในขณะนี้</p>
        </div>
      </div>

      <div class="space-y-6 text-left">
        <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Personal Stats</h3>
        <div class="bg-[#121926] p-12 rounded-[3.5rem] shadow-2xl text-left space-y-10">
          <div>
            <p class="text-indigo-300 font-black uppercase text-[10px] tracking-widest mb-2">Efficiency Mastery</p>
            <p class="text-6xl font-black text-white italic tracking-tighter">88%</p>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Completed</span>
              <span>12 Tasks</span>
            </div>
            <div class="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-[#5c56f0] rounded-full" style="width: 88%"></div>
            </div>
          </div>
        </div>

        <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 mt-10">Active Project Manager</h3>
        <div class="bg-[#0f172a] p-8 rounded-[3rem] shadow-xl flex items-center gap-6 border border-slate-800">
          <div class="relative">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=PM" class="w-16 h-16 rounded-2xl bg-slate-800 p-1">
             <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#0f172a] rounded-full"></div>
          </div>
          <div>
            <h4 class="text-white font-black uppercase text-lg italic tracking-tighter">Somchai Manager</h4>
            <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Online • Ready to Review</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const myTasks = ref([])
const props = defineProps(['userEmail']) // รับ Email พนักงานเพื่อกรองงาน

onMounted(() => {
  // 🎯 ดึงงานจาก LocalStorage ที่ PM เคยเซฟไว้
  const savedTasks = localStorage.getItem('CORPX_SUB_TASKS_DATA')
  if (savedTasks) {
    const allTasks = JSON.parse(savedTasks)
    // ในระบบจริงต้องกรองตามชื่อพนักงาน แต่ในตัวอย่างนี้พี่โหลดมาโชว์ทั้งหมดก่อนครับ
    myTasks.value = allTasks 
  }
})

const submitWork = (task) => {
  alert(`รับทราบ! เริ่มกระบวนการส่งรายงานสำหรับภารกิจ: ${task.title}`)
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
</script>
