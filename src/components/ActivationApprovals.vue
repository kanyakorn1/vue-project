<template>
  <div class="space-y-2 animate-fade-in text-left">
    <div class="flex items-center gap-4 mb-2">
      <div class="w-1 h-6 bg-indigo-500 rounded-full"></div>
      <div>
        <h3 class="text-xl font-black text-slate-800 uppercase tracking-tighter italic">อนุมัติผู้ใช้งาน</h3>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">คำร้องขอเข้าใช้งานระบบจากพนักงานใหม่</p>
      </div>
    </div>

    <div v-if="activations.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="req in activations" :key="req.id" 
           class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative group hover:shadow-xl transition-all">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
              <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.staffId}`" class="w-10 h-10">
            </div>
            <div>
              <p class="text-sm font-black text-slate-800">{{ req.name }}</p>
              <p class="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">{{ req.staffId }}</p>
            </div>
          </div>
          <span class="text-[9px] font-black bg-amber-50 text-amber-500 px-3 py-1.5 rounded-full uppercase tracking-widest">รออนุมัติ</span>
        </div>

        <div class="bg-slate-50/50 p-4 rounded-2xl mb-6 border border-slate-50">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <p class="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">ตำแหน่ง</p>
              <p class="text-[10px] font-black text-slate-700 uppercase">{{ req.role }}</p>
            </div>
            <div>
              <p class="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">แผนก</p>
              <p class="text-[10px] font-black text-slate-700 uppercase">{{ req.dept }}</p>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="approve(req)" class="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all">
            <i class="fas fa-check-circle mr-1"></i> อนุมัติ
          </button>
          <button @click="reject(req)" class="flex-1 py-3 bg-rose-50 text-rose-500 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-rose-100 transition-all">
            <i class="fas fa-times-circle mr-1"></i> ปฏิเสธ
          </button>
        </div>
      </div>
    </div>

    <div v-else class="py-4 text-center bg-white/40 rounded-[2rem] border-2 border-dashed border-slate-200">
      <div class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-300">
        <i class="fas fa-user-clock text-lg"></i>
      </div>
      <p class="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">ไม่มีคำร้องขอใช้งานในขณะนี้</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const props = defineProps(['userRole'])
const emit = defineEmits(['notify', 'refresh-team'])

const activations = ref([])

onMounted(async () => {
  await fetchActivations()
})

const fetchActivations = async () => {
  try {
    const data = await api.getActivations({ approverRole: props.userRole })
    if (data) activations.value = data.filter(r => r.status === 'pending')
  } catch (e) {
    console.error("Failed to fetch activations", e)
  }
}

const approve = async (req) => {
  try {
    await api.updateActivation(req._id || req.id, { status: 'approved' })
    emit('notify', `อนุมัติการสมัครของ ${req.name} เรียบร้อยแล้ว! พนักงานสามารถเข้าสู่ระบบได้ทันที`)
    await fetchActivations()
    emit('refresh-team')
  } catch (e) {
    console.error("Failed to approve", e)
    alert("การอนุมัติขัดข้อง")
  }
}

const reject = async (req) => {
  if (!confirm(`ยืนยันการปฏิเสธคำขอของ ${req.name}?`)) return
  try {
    await api.updateActivation(req._id || req.id, { status: 'rejected' })
    emit('notify', `ปฏิเสธคำขอของ ${req.name} แล้ว`)
    await fetchActivations()
  } catch (e) {
    console.error("Failed to reject", e)
    alert("การปฏิเสธขัดข้อง")
  }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
h3, p, button, span { font-family: 'LINE Seed Sans TH', sans-serif; }
</style>
