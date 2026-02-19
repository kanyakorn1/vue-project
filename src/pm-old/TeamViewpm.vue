<template>
  <div class="space-y-8 animate-fade-up text-left">
    <div class="flex justify-between items-end">
      <div class="text-left">
    <h2 class="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none text-left">TEAM MANAGEMENT</h2>
        <p class="text-slate-400 text-[10px] font-bold uppercase mt-2 tracking-[0.2em] text-left">
          บริหารจัดการสิทธิ์เข้าใช้งานและรหัสผ่านพนักงาน (TOTAL: {{ allStaff.length }})
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <div v-for="staff in allStaff" :key="staff.id" 
        class="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-center text-center space-y-4 group relative overflow-hidden"
      >
        <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div class="relative">
          <div class="w-24 h-24 rounded-full bg-slate-50 p-1 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
            <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.staffId}`" class="w-full h-full rounded-full">
          </div>
          <div class="absolute bottom-1 right-1 w-6 h-6 border-4 border-white rounded-full flex items-center justify-center bg-white" 
            :class="staff.name ? 'text-emerald-500' : 'text-slate-300'">
             <i class="fas fa-check-circle text-xl"></i>
          </div>
        </div>

        <div class="space-y-1">
          <h3 class="text-xl font-black text-slate-900 tracking-tight">
            {{ staff.name || 'รอติดตั้งระบบ' }}
          </h3>
          <p class="text-xs font-black text-[#5c56f0] uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg inline-block">
            {{ staff.staffId }}
          </p>
        </div>

        <div class="w-full pt-4 border-t border-slate-50 mt-2">
           <div class="flex justify-between items-start gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
             <div class="flex flex-col flex-1 min-w-0">
               <span class="text-[11px] text-slate-800 uppercase whitespace-nowrap">{{ staff.role || '-' }}</span>
               <span class="text-[8px] mt-0.5">Position</span>
             </div>

           </div>


        </div>
      </div>

      <div v-if="allStaff.length === 0" class="col-span-full py-20 text-center space-y-4 border-2 border-dashed border-slate-200 rounded-[3rem]">
        <i class="fas fa-users-slash text-5xl text-slate-300"></i>
        <p class="text-slate-400 font-bold uppercase text-xs tracking-widest">No personnel data found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// รับข้อมูลพนักงานมาจาก App.vue
const props = defineProps({
  allStaff: { type: Array, default: () => [] }
})
</script>

<style scoped>
.animate-fade-up {
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
h2, p, span, th, td {
  font-family: 'Inter', 'Kanit', sans-serif;
}
</style>
