<template>
  <div class="space-y-10 text-left animate-fade-up">
    <div class="flex justify-between items-end">
      <div class="text-left">
        <h2 class="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none text-left">Strategic Projects</h2>
        <p class="text-slate-400 text-[11px] font-bold uppercase mt-4 tracking-widest italic text-left">แผนงานระดับยุทธศาสตร์บริษัท (GRID-7)</p>
      </div>
      </div>

    <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
      
      <div 
        @click="$emit('card-click', 'STRATEGIC ERP V3')"
        class="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-50 relative overflow-hidden group 
               hover:shadow-2xl hover:scale-[1.02] cursor-pointer transition-all duration-500 text-left"
      >
        <div class="bg-[#5c56f0] w-full h-2.5 absolute top-0 left-0"></div>
        
        <div class="flex justify-between items-start">
          <span class="text-[9px] font-black bg-indigo-50 text-[#5c56f0] px-4 py-1.5 rounded-xl uppercase tracking-widest">Active</span>
          <i class="fas fa-external-link-alt text-indigo-200 group-hover:text-[#5c56f0] transition-colors"></i>
        </div>
        
        <h4 class="mt-6 text-2xl font-black text-slate-800 uppercase italic tracking-tighter text-left leading-tight">ERP HUB V3</h4>
        <p class="text-[10px] text-slate-400 font-bold mt-3 leading-relaxed text-left">พัฒนาระบบภายในองค์กรส่วนกลางเพื่อความเสถียรของกำลังพลและทรัพยากร</p>
        
        <div class="mt-16 text-left">
          <div class="flex justify-between items-end mb-3">
            <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Mastery</span>
            <span class="text-lg font-black text-[#5c56f0]">45%</span>
          </div>
          <div class="w-full h-2 bg-slate-50 rounded-full overflow-hidden shadow-inner">
            <div class="h-full bg-[#5c56f0] rounded-full shadow-[0_0_10px_rgba(92,86,240,0.5)] transition-all duration-1000" style="width: 45%"></div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// ประกาศสัญญาณ (Emit) เพื่อส่งชื่อโครงการกลับไปที่ App.vue
defineEmits(['card-click'])
</script>

<style scoped>
/* Animation สำหรับความนุ่มนวลเวลาเปลี่ยนหน้า */
.animate-fade-up {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* รักษาฟอนต์ให้คมเข้มดุดันตามมาตรฐาน CORP-X */
h2, h4, p, span {
  font-family: 'LINE Seed Sans TH', sans-serif;
}
</style>
