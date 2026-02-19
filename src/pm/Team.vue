<template>
  <div class="min-h-full flex flex-col animate-fade-up">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
      <div>
        <h2 class="text-4xl font-black text-indigo-600 tracking-tighter uppercase">SQUAD REGISTRY</h2>
        <p class="text-[12px] font-bold text-slate-400 tracking-wider">รายชื่อกำลังพลในสังกัดแผนก: IT</p>
      </div>
      
    </div>

    <!-- Team Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-y-auto custom-scrollbar pb-6 px-1">
        
        <div v-for="member in team" :key="member.id" class="bg-white rounded-[2rem] p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between border border-slate-50 hover:-translate-y-1">
            
            <div class="flex flex-col items-center w-full">
                <!-- Avatar -->
                <div class="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-3 overflow-hidden shadow-inner">
                    <img :src="`https://api.dicebear.com/9.x/avataaars/svg?seed=${member.seed}`" class="w-full h-full object-cover" />
                </div>

                <!-- Info -->
                <h3 class="text-sm font-black text-slate-800 mb-0.5 text-center leading-tight">{{ member.name }}</h3>
                <p class="text-[9px] font-bold text-indigo-500 tracking-widest uppercase">{{ member.staffId || member.code || 'NO ID' }}</p>
            </div>

            <!-- Action Button -->
            <button @click="showInfo(member)" class="w-full bg-slate-900 text-white py-2 rounded-xl text-[8px] font-black tracking-[0.15em] uppercase hover:bg-indigo-600 transition-colors mt-4 shadow-lg shadow-slate-100">
                PERSONNEL FILE
            </button>
        </div>

    </div>

    <!-- Custom Modal -->
    <div v-if="showNewMemberModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl animate-zoom-in text-center relative overflow-hidden">
             
             <!-- Glow Effect -->
             <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-100 rounded-full blur-3xl -z-0"></div>

             <h2 class="text-xl font-black text-slate-800 tracking-tight mb-8 relative z-10 uppercase">Authorized!</h2>
             
             <div class="bg-slate-50 border border-slate-100 rounded-3xl p-6 mb-8 relative z-10">
                 <div class="mb-4">
                     <p class="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">Staff ID</p>
                     <p class="text-3xl font-black text-indigo-600 tracking-tight">{{ newMemberData.code }}</p>
                 </div>
                 <div>
                     <p class="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">Passcode</p>
                     <p class="text-2xl font-black text-emerald-500 tracking-widest font-mono">{{ newMemberData.password }}</p>
                 </div>
             </div>

             <button @click="showNewMemberModal = false" class="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200 relative z-10">
                 Complete
             </button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

const props = defineProps(['deptName'])
const showNewMemberModal = ref(false)
const newMemberData = ref({ code: '', password: '' })
const team = ref([])

onMounted(async () => {
    try {
        const dept = props.deptName || localStorage.getItem('deptName')
        team.value = await api.getTeam({ dept });
    } catch (e) {
        console.error('Failed to load team', e);
    }
})


const showInfo = (member) => {
    alert(`ข้อมูลพนักงาน: ${member.name} (${member.code})`)
}
</script>
