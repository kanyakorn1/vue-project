<template>
  <div class="space-y-8 animate-fade-up text-left">
    <div class="flex justify-between items-end">
      <div class="text-left">
        <h2 class="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none text-left">Team Monitoring</h2>
        <p class="text-slate-400 text-[10px] font-bold uppercase mt-2 tracking-[0.2em] text-left">
          รายชื่อพนักงานและตำแหน่งในสังกัด (Total: {{ allStaff.length }} Personnel)
        </p>
      </div>
    </div>

    <div class="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 border-b border-slate-100">
            <th class="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">รูปโปรไฟล์ / ข้อมูลพื้นฐาน</th>
            <th class="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">ตำแหน่งปฏิบัติงาน</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="staff in allStaff" :key="staff.id" class="hover:bg-slate-50/30 transition-colors group">
            <td class="px-10 py-6 text-left">
              <div class="flex items-center gap-6 text-left">
                <div class="relative">
                  <img 
                    :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.staffId}`" 
                    class="w-14 h-14 rounded-2xl bg-slate-100 p-1 group-hover:scale-105 transition-transform"
                  >
                  <div class="absolute -bottom-1 -right-1 w-4 h-4 border-4 border-white rounded-full bg-emerald-500"></div>
                </div>
                <div class="text-left">
                  <p class="text-sm font-black text-slate-800 uppercase tracking-tight text-left">
                    {{ staff.name || 'ยังไม่ระบุชื่อ' }}
                  </p>
                  <p class="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1 text-left">
                    ID: {{ staff.staffId }}
                  </p>
                </div>
              </div>
            </td>

            <td class="px-10 py-6 text-left">
              <div class="flex items-center gap-3 text-left">
                <div class="w-2 h-2 rounded-full bg-indigo-400"></div>
                <span class="text-xs font-black text-slate-600 uppercase tracking-widest text-left">
                  {{ staff.role || 'Personnel' }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="allStaff.length === 0" class="py-24 text-center">
        <p class="text-slate-300 font-black uppercase text-xs tracking-[0.3em]">No personnel data found in this sector</p>
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
  font-family: 'LINE Seed Sans TH', sans-serif;
}
</style>
