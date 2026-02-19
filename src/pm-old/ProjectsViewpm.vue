<template>
  <div class="space-y-10 text-left animate-fade-up">
    <div class="flex justify-between items-end">
      <div class="text-left">
        <h2 class="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none text-left">Strategic Projects</h2>
        <p class="text-slate-400 text-[11px] font-bold uppercase mt-4 tracking-widest italic text-left">แผนงานระดับยุทธศาสตร์บริษัท (GRID-7)</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
      
      <div v-for="project in projects" :key="project.id"
        @click="$emit('card-click', project)"
        class="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-50 relative overflow-hidden group 
               hover:shadow-2xl hover:scale-[1.02] cursor-pointer transition-all duration-500 text-left"
      >
        <div class="bg-[#5c56f0] w-full h-2.5 absolute top-0 left-0"></div>
        
        <div class="flex justify-between items-start">
          <span class="text-[9px] font-black bg-indigo-50 text-[#5c56f0] px-4 py-1.5 rounded-xl uppercase tracking-widest">Active</span>
          <i class="fas fa-external-link-alt text-indigo-200 group-hover:text-[#5c56f0] transition-colors"></i>
        </div>
        
        <h4 class="mt-6 text-2xl font-black text-slate-800 uppercase italic tracking-tighter text-left leading-tight line-clamp-2">{{ project.title }}</h4>
        <p class="text-[10px] text-slate-400 font-bold mt-3 leading-relaxed text-left line-clamp-3">{{ project.description || 'รายละเอียดโครงการ...' }}</p>
        
        <div class="mt-16 text-left">
          <div class="flex justify-between items-end mb-3">
            <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Mastery</span>
            <span class="text-lg font-black text-[#5c56f0]">0%</span>
          </div>
          <div class="w-full h-2 bg-slate-50 rounded-full overflow-hidden shadow-inner">
            <div class="h-full bg-[#5c56f0] rounded-full shadow-[0_0_10px_rgba(92,86,240,0.5)] transition-all duration-1000" style="width: 0%"></div>
          </div>
        </div>
      </div>

    </div>

    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
        <div class="bg-white w-full max-w-xl rounded-[4rem] p-14 shadow-2xl relative text-left">
          <button @click="showModal = false" class="absolute top-10 right-10 text-slate-300 hover:text-slate-900 transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
          
          <h3 class="text-4xl font-black text-slate-900 uppercase mb-10 italic tracking-tighter text-left">Launch New Project</h3>
          
          <div class="space-y-6">
            <div class="space-y-2 text-left">
              <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-widest">Project Name</label>
              <input v-model="newProject.title" type="text" placeholder="ชื่อโครงการ..." class="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] outline-none font-bold text-lg placeholder:text-slate-300 text-left">
            </div>

            <div class="space-y-2 text-left">
              <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left">Project Deadline (กำหนดส่ง)</label>
              <input v-model="newProject.deadline" type="date" class="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] outline-none font-bold text-lg text-slate-800 cursor-pointer text-left">
            </div>

            <div class="space-y-2 text-left">
              <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left">Operational Objectives</label>
              <textarea v-model="newProject.description" rows="3" placeholder="ระบุเป้าหมาย..." class="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] outline-none font-bold text-lg placeholder:text-slate-300 resize-none text-left"></textarea>
            </div>
          </div>

          <button @click="createProject" class="w-full mt-10 py-6 bg-[#5c56f0] text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all text-center">
            Deploy Mission
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps(['projects'])
const emit = defineEmits(['card-click', 'add-project'])

const showModal = ref(false)
const newProject = reactive({
  title: '',
  description: '',
  deadline: ''
})

const createProject = () => {
  if (newProject.title && newProject.deadline) {
    emit('add-project', JSON.parse(JSON.stringify(newProject)))
    newProject.title = ''
    newProject.description = ''
    newProject.deadline = ''
    showModal.value = false
  } else {
    alert('กรุณากรอกชื่อโครงการและกำหนดส่งให้ครบครับ!')
  }
}
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
  font-family: 'Inter', 'Kanit', sans-serif;
}
</style>
