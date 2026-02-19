<template>
  <aside class="w-72 h-screen bg-white border-r-[3px] border-slate-300 flex flex-col p-6 shrink-0 shadow-lg font-black uppercase tracking-tight">
    
    <div class="flex items-center gap-4 mb-14 shrink-0 px-2 leading-none">
      <div class="bg-indigo-600 p-3 rounded-2xl text-white shadow-xl shadow-indigo-200 w-14 h-14 flex items-center justify-center">
        <i class="fas fa-cube text-2xl"></i>
      </div>
      <div class="flex flex-col">
        <span class="font-black text-3xl tracking-tighter text-slate-800">CORP-X</span>
        <span class="text-[10px] text-indigo-500 font-bold tracking-[0.2em] mt-1">STRATEGIC HUB</span>
      </div>
    </div>

    <nav class="space-y-2 flex-grow overflow-y-auto custom-scrollbar pr-2">
      <p class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-4">Operations</p>
      
      <button 
        v-for="item in menuItems" 
        :key="item.id" 
        @click="navigateTo(item)"
        :class="[
          'w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-300 text-sm font-bold border-2 group leading-none', 
          activeTab === item.id 
            ? 'bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-400' 
            : 'text-slate-500 hover:bg-indigo-50/50 border-transparent hover:border-indigo-100'
        ]"
      >
        <div class="w-6 flex justify-center">
          <i :class="[item.icon, activeTab === item.id ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-500']" class="text-lg"></i>
        </div>
        <span class="tracking-widest">{{ item.label }}</span>
      </button>
    </nav>

    <div class="mt-4 pt-8 border-t-2 border-slate-100 shrink-0">
      <button 
        @click="handleSignOut" 
        class="w-full flex items-center gap-5 px-5 py-4 rounded-2xl text-slate-400 hover:text-rose-600 transition-all duration-300 text-sm font-black uppercase tracking-widest border-2 border-transparent hover:border-rose-100 group shadow-sm bg-slate-50/50"
      >
        <div class="w-6 flex justify-center">
          <i class="fas fa-power-off group-hover:scale-110 transition-transform"></i>
        </div>
        <span>Sign Out HQ</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// เก็บสถานะว่าตอนนีเราอยู่ที่แท็บไหน
const activeTab = ref('dashboard')

// รายการข้อมูลเมนู
const menuItems = ref([
  { id: 'dashboard', label: 'หน้าแรก', icon: 'fas fa-chart-line', route: '/' },
  { id: 'calendar', label: 'ปฏิทินงาน', icon: 'fas fa-calendar-days', route: '/calendar' },
  { id: 'projects', label: 'โครงการ', icon: 'fas fa-rocket', route: '/projects' },
  { id: 'kanban', label: 'คัมบัง SOP', icon: 'fas fa-list-check', route: '/kanban' },
  { id: 'reports', label: 'ส่งรายงาน', icon: 'fas fa-file-export', route: '/reports' },
  { id: 'team', label: 'ทีมพนักงาน', icon: 'fas fa-users', route: '/team' }
])

// ฟังก์ชันนำทาง
const navigateTo = (item) => {
  activeTab.value = item.id
  if (item.route && item.route !== '#') {
    router.push(item.route)
  }
}

// ตรวจสอบ URL ปัจจุบันเพื่อ Highlight เมนูให้ถูกต้องเวลารีเฟรช
onMounted(() => {
  updateActiveTab()
})

watch(() => route.path, () => {
  updateActiveTab()
})

const updateActiveTab = () => {
  const currentPath = route.path
  const foundItem = menuItems.value.find(item => item.route === currentPath)
  if (foundItem) {
    activeTab.value = foundItem.id
  } else if (currentPath === '/') {
    activeTab.value = 'dashboard'
  }
}

// ฟังก์ชันสำหรับ Sign Out
const handleSignOut = () => {
  router.push('/login')
}
</script>

<style scoped>
/* สไตล์เฉพาะตัวของ Component นี้ */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>
