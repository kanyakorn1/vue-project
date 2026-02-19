<template>
  <div class="space-y-10 animate-fade-up text-left">
    <div class="flex justify-between items-start">
      <div class="text-left">
        <h2 class="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">หน้าแรก</h2>
        <p class="text-slate-400 text-[10px] font-bold uppercase mt-2 tracking-[0.2em]">IDENTITY: PROJECT MANAGER (OFFICE)</p>
      </div>

      <!-- View Switcher -->
      <div class="bg-slate-100 p-1.5 rounded-full flex items-center">
        <button 
          @click="viewMode = 'department'"
          class="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
          :class="viewMode === 'department' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'"
        >
          Department
        </button>
        <button 
          @click="viewMode = 'my'"
          class="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
          :class="viewMode === 'my' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'"
        >
          My View
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <div v-for="stat in dashStats" :key="stat.label" 
        @click="stat.label === 'โครงการยุทธศาสตร์' ? goToProjects() : null"
        :class="[
          'bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden text-left',
          stat.label === 'โครงการยุทธศาสตร์' ? 'cursor-pointer border-indigo-200 hover:border-[#5c56f0]' : ''
        ]">
        
        <div class="flex justify-between items-start mb-6">
          <div :class="[stat.bgColor, 'p-4 rounded-2xl text-white shadow-lg shadow-indigo-100 transition-transform group-hover:scale-110']">
            <i :class="[stat.icon, 'text-xl']"></i>
          </div>
          <span class="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            +15.4%
          </span>
        </div>

        <div class="space-y-1">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ stat.label }}</p>
          <h3 class="text-5xl font-black text-slate-900 tracking-tighter">{{ stat.value }}</h3>
        </div>

        <div v-if="stat.label === 'โครงการยุทธศาสตร์'" class="absolute bottom-4 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
           <i class="fas fa-arrow-right text-indigo-500 text-xs"></i>
        </div>
      </div>
    </div>

    <div class="relative w-full h-[320px] rounded-[4rem] overflow-hidden shadow-2xl shadow-indigo-200">
      <div class="absolute inset-0 bg-gradient-to-br from-[#4f46e5] via-[#5c56f0] to-[#7c3aed]"></div>
      <div class="absolute right-[-10%] bottom-[-20%] opacity-10 rotate-12 scale-150">
        <i class="fas fa-chess-king text-[300px] text-white"></i>
      </div>
      <div class="relative h-full flex flex-col justify-center px-20">
        <h1 class="text-7xl font-black text-white tracking-tighter leading-none italic uppercase">Command Control</h1>
        <h2 class="text-4xl font-black text-emerald-400 tracking-tight italic uppercase mt-2">Intelligence HQ</h2>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
      <div class="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl">
        <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 italic">สรุปสถานะภารกิจล่าสุด</h3>
        <div class="space-y-4">
          <div v-for="n in 3" :key="n" class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-slate-100 transition-colors">
            <div class="flex items-center gap-4 text-left">
              <div class="w-2 h-10 bg-indigo-500 rounded-full"></div>
              <div>
                <p class="text-xs font-black text-slate-800 uppercase">Phase {{ n }} Deployment Progress</p>
                <p class="text-[10px] text-slate-400 font-bold uppercase italic">Status: Monitoring Active</p>
              </div>
            </div>
            <i class="fas fa-chevron-right text-slate-200 group-hover:text-indigo-500 transition-colors"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// 1. รับ Props ข้อมูลพนักงานมาจาก App.vue
const props = defineProps({
  allStaff: {
    type: Array,
    default: () => []
  }
})

// 2. ประกาศ Emit เพื่อส่งสัญญาณสลับหน้าไปยัง App.vue
const emit = defineEmits(['change-tab'])

// View Mode State: 'department' | 'my'
const viewMode = ref('department')

// 3. คำนวณจำนวนพนักงานทั้งหมดแบบ Real-time
const totalStaff = computed(() => props.allStaff.length)

// 4. ข้อมูลสถิติจำลองร่วมกับข้อมูลจริง (Reactive ตาม View Mode)
const dashStats = computed(() => {
  if (viewMode.value === 'department') {
    return [
      { label: 'งานปฏิบัติการ', value: '42', icon: 'fas fa-tasks', bgColor: 'bg-indigo-500' },
      { label: 'ปฏิบัติสำเร็จ', value: '38', icon: 'fas fa-check-circle', bgColor: 'bg-emerald-500' },
      { label: 'โครงการยุทธศาสตร์', value: '1', icon: 'fas fa-rocket', bgColor: 'bg-blue-600' },
      { label: 'กำลังพลทั้งหมด', value: totalStaff.value, icon: 'fas fa-users', bgColor: 'bg-purple-500' },
      { label: 'งานด่วนวิกฤต', value: '02', icon: 'fas fa-bolt', bgColor: 'bg-rose-500' }
    ]
  } else {
    // My View Stats (Mockup for PM's personal tasks)
    return [
      { label: 'งานของฉัน', value: '5', icon: 'fas fa-user-tag', bgColor: 'bg-indigo-500' },
      { label: 'เสร็จสิ้นแล้ว', value: '3', icon: 'fas fa-check-double', bgColor: 'bg-emerald-500' },
      { label: 'รอการอนุมัติ', value: '2', icon: 'fas fa-clock', bgColor: 'bg-amber-500' },
      { label: 'ทีมภายใต้การดูแล', value: '8', icon: 'fas fa-sitemap', bgColor: 'bg-purple-500' },
      { label: 'การแจ้งเตือน', value: '4', icon: 'fas fa-bell', bgColor: 'bg-rose-500' }
    ]
  }
})

// 5. ฟังก์ชันสั่งสลับหน้าไปยัง Projects
const goToProjects = () => {
  emit('change-tab', 'projects')
}
</script>

<style scoped>
.animate-fade-up {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
h1, h2, h3, h4, p, span {
  font-family: 'Inter', 'Kanit', sans-serif;
}
</style>
