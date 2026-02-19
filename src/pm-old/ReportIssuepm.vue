<template>
  <div class="max-w-4xl mx-auto animate-fade-up text-left">
    <div class="bg-white rounded-[4rem] p-16 shadow-2xl border border-slate-100 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-rose-500 to-amber-500"></div>

      <header class="mb-12 text-left">
        <h2 class="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none text-left">Report Issue</h2>
        <p class="text-slate-400 text-[11px] font-bold uppercase mt-4 tracking-[0.2em] italic text-left">ศูนย์แจ้งปัญหาและอุปสรรคในการดำเนินงาน</p>
      </header>

      <div class="space-y-10 text-left">
        <div class="space-y-3 text-left">
          <label class="text-[11px] font-black text-slate-400 uppercase ml-6 tracking-widest text-left">หัวข้อปัญหาที่พบ</label>
          <input v-model="issue.title" type="text" placeholder="ระบุชื่อปัญหา..." 
                 class="w-full px-10 py-6 bg-slate-50 border-none rounded-[2.5rem] font-bold text-slate-800 outline-none focus:ring-4 focus:ring-rose-500/5 transition-all text-left shadow-inner">
        </div>

        <div class="space-y-3 text-left">
          <label class="text-[11px] font-black text-slate-400 uppercase ml-6 tracking-widest text-left">ระดับความด่วน (Urgency Level)</label>
          <div class="grid grid-cols-3 gap-4 text-left">
            <button v-for="level in urgencyLevels" :key="level.id"
                    @click="issue.urgency = level.id"
                    :class="['py-6 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] transition-all border-2',
                             issue.urgency === level.id ? level.activeClass : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200']">
              <i :class="[level.icon, 'mr-2']"></i> {{ level.label }}
            </button>
          </div>
        </div>

        <div class="space-y-3 text-left">
          <label class="text-[11px] font-black text-slate-400 uppercase ml-6 tracking-widest text-left">รายละเอียดและอุปสรรค</label>
          <textarea v-model="issue.description" rows="5" placeholder="อธิบายปัญหาที่เกิดขึ้นโดยสังเขป..." 
                    class="w-full px-10 py-8 bg-slate-50 border-none rounded-[3rem] font-bold text-slate-800 outline-none focus:ring-4 focus:ring-rose-500/5 transition-all resize-none text-left shadow-inner"></textarea>
        </div>

        <div class="pt-6 text-left">
          <button @click="submitIssue" 
                  class="w-full py-8 bg-[#121926] text-white rounded-[3rem] font-black uppercase tracking-[0.3em] text-sm shadow-2xl hover:bg-rose-600 hover:-translate-y-1 active:scale-95 transition-all">
            <i class="fas fa-paper-plane mr-3"></i> Broadcast Issue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const issue = reactive({
  title: '',
  urgency: 'normal',
  description: ''
})

const urgencyLevels = [
  { id: 'normal', label: 'Normal', icon: 'fas fa-info-circle', activeClass: 'bg-emerald-50 border-emerald-500 text-emerald-600' },
  { id: 'high', label: 'High Priority', icon: 'fas fa-exclamation-triangle', activeClass: 'bg-amber-50 border-amber-500 text-amber-600' },
  { id: 'critical', label: 'Critical', icon: 'fas fa-radiation', activeClass: 'bg-rose-50 border-rose-500 text-rose-600' }
]

const submitIssue = () => {
  if (!issue.title || !issue.description) {
    alert('กรุณากรอกข้อมูลปัญหาให้ครบถ้วนด้วยครับน้อง!')
    return
  }
  console.log('Issue Deployed:', issue)
  alert('แจ้งปัญหาไปยังส่วนกลางเรียบร้อยแล้วครับ!')
  // ล้างค่า
  issue.title = ''
  issue.description = ''
  issue.urgency = 'normal'
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
h2, p, label, input, button, textarea {
  font-family: 'Inter', 'Kanit', sans-serif;
}
</style>
