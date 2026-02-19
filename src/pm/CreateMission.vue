<template>
  <div class="min-h-full flex flex-col gap-6 animate-fade-up text-left">
    <!-- Header -->
    <div class="flex items-center justify-between shrink-0">
      <div class="text-left">
        <h2 class="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">New Operation</h2>
        <p class="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-2">Deploy Tactical Mission Parameters</p>
      </div>
      <button @click="$emit('go-back')" class="text-slate-400 hover:text-slate-800 transition-colors">
        <i class="fas fa-times text-2xl"></i>
      </button>
    </div>

    <!-- Form Area -->
    <div class="flex-1 min-h-0 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 overflow-y-auto custom-scrollbar">
      <form @submit.prevent="handleSubmit" class="max-w-3xl mx-auto space-y-8 text-left">
        
        <!-- Mission Title -->
        <div class="space-y-2 text-left">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mission Name</label>
          <input 
            v-model="form.title"
            required
            type="text" 
            placeholder="E.G. PROJECT NEBULA - UI DEPLOYMENT"
            class="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-3xl px-8 py-5 text-sm font-black text-slate-800 transition-all outline-none placeholder:text-slate-200 text-left"
          />
        </div>

        <!-- Description -->
        <div class="space-y-2 text-left">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Briefing Details</label>
          <textarea 
            v-model="form.description"
            required
            rows="4"
            placeholder="ENTER TACTICAL OBJECTIVES AND MISSION REQUIREMENTS..."
            class="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[2rem] px-8 py-5 text-sm font-bold text-slate-600 transition-all outline-none placeholder:text-slate-200 resize-none text-left"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Priority -->
          <div class="space-y-2 text-left">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Priority Level</label>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <button 
                v-for="p in ['Low', 'Medium', 'High', 'Critical']" 
                :key="p"
                type="button"
                @click="form.priority = p"
                :class="[
                  'py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border-2',
                  form.priority === p ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-100'
                ]"
              >
                {{ p }}
              </button>
            </div>
          </div>

          <!-- Assignee -->
          <div class="space-y-2 text-left">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Assign Agent</label>
            <select 
              v-model="form.staffName"
              required
              class="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 text-xs font-bold text-slate-800 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="" disabled>SELECT AGENT FROM REGISTRY</option>
              <option v-for="agent in filteredStaff" :key="agent.id" :value="agent.name">{{ agent.name }} {{ (agent.position || agent.role) ? `(${agent.position || agent.role})` : '' }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
           <!-- Deadline -->
           <div class="space-y-2 text-left">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Deadline</label>
            <input 
              v-model="form.deadline"
              type="date"
              placeholder="ระบุ วัน/เดือน/ปี"
              class="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 text-xs font-bold text-slate-800 transition-all outline-none cursor-pointer"
            />
          </div>

          <!-- Type -->
          <div class="space-y-2 text-left">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mission Type</label>
            <select 
              v-model="form.type"
              class="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 text-xs font-bold text-slate-800 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="task">Individual Task</option>
              <option value="project">Strategic Project</option>
            </select>
          </div>
        </div>

        <!-- Submit -->
        <div class="pt-6">
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-slate-900 text-white py-6 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-4 group active:scale-95"
          >
            <span v-if="loading">INITIALIZING...</span>
            <template v-else>
              DEPLOY MISSION <i class="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </template>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api'

const emit = defineEmits(['go-back', 'notify', 'add-project'])

const loading = ref(false)
const team = ref([])

const form = ref({
  title: '',
  description: '',
  priority: 'Medium',
  staffName: '',
  type: 'task',
  deadline: new Date().toISOString().split('T')[0]
})

onMounted(async () => {
    try {
        const data = await api.getTeam()
        team.value = data || []
    } catch (e) {
        console.error('Failed to load team registry', e)
    }
})

// 🎯 กรองรายชื่อพนักงานสำหรับ PM: ให้เลือก Lead และ Staff ได้ แต่ซ่อนระดับ PM/Manager
const filteredStaff = computed(() => {
  if (!team.value) return []
  
  // 1. กรองออกเฉพาะระดับ PM หรือ Manager (เพื่อไม่ให้ PM มอบงานให้ PM ด้วยกันเองในระบบนี้)
  const available = team.value.filter(s => {
    const role = (s.role || '').toLowerCase()
    return role !== 'pm' && role !== 'manager'
  })

  // 2. ลบคนชื่อซ้ำ
  const nameMap = new Map()
  available.forEach(s => {
    if (!nameMap.has(s.name) || (s.position && !nameMap.get(s.name).position)) {
      nameMap.set(s.name, s)
    }
  })
  
  return Array.from(nameMap.values()).sort((a, b) => a.name.localeCompare(b.name))
})

const handleSubmit = async () => {
  loading.value = true
  try {
    emit('add-project', { ...form.value })
    emit('notify', 'สถาปนาภารกิจใหม่สำเร็จ!')
    emit('go-back')
  } catch (e) {
    alert('Failed to deploy mission: ' + e.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f5f9;
  border-radius: 10px;
}
.animate-fade-up {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
