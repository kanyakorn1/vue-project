<template>
  <div class="space-y-12 animate-fade-in text-left">
    <!-- Header -->
    <div class="flex flex-col items-center justify-center py-10 space-y-8">
      <div class="bg-indigo-600 p-5 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 animate-bounce">
        <i class="fas fa-cube text-4xl"></i>
      </div>
      <div class="text-center">
        <h2 class="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">CORP-X SEARCH</h2>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-[0.4em] mt-3">Global Identity & Strategic Information Portal</p>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="max-w-3xl mx-auto relative group">
      <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-[3rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <div class="relative flex items-center bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden px-8 py-2">
        <i class="fas fa-search text-slate-300 text-xl mr-5"></i>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="ค้นหาพนักงาน, โครงการ หรือข้อมูลเชิงยุทธศาสตร์..." 
          class="flex-1 bg-transparent border-none py-6 outline-none font-bold text-slate-700 text-lg placeholder:text-slate-300"
          @keyup.enter="handleSearch"
        >
        <button @click="handleSearch" class="bg-[#121926] text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
          Execute Search
        </button>
      </div>
      
      <!-- Quick Options -->
      <div class="flex justify-center gap-4 mt-6">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Quick Links:</span>
        <button @click="searchQuery = 'ยุทธศาสตร์ IT'" class="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 transition-all">Strategic IT</button>
        <button @click="searchQuery = 'รายชื่อ PM'" class="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 transition-all">Identity PM</button>
        <button @click="searchQuery = 'Deadline เดือนนี้'" class="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 px-3 py-1 rounded-full border border-rose-100 transition-all">Urgent Targets</button>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="searchPerformed" class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 py-10">
      
      <!-- Left Column: Search Results (8/12) -->
      <div class="lg:col-span-8 space-y-8">
        <div v-if="results.length > 0" class="space-y-10">
          <div v-for="res in results" :key="res.id" class="group cursor-pointer">
            <p class="text-[11px] text-emerald-600 font-bold mb-1 opacity-60">https://corp-x.com/intel/{{ res.type }}/{{ res.id }}</p>
            <h3 class="text-xl font-black text-[#1e293b] group-hover:text-indigo-600 transition-colors uppercase italic tracking-tighter mb-2">{{ res.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed font-bold line-clamp-3">{{ res.desc }}</p>
            <div class="flex gap-4 mt-3">
              <span class="text-[9px] font-black text-slate-400 uppercase underline decoration-indigo-200">View Tactical Data</span>
              <span class="text-[9px] font-black text-slate-400 uppercase underline decoration-emerald-200">Asset Verification</span>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm border-dashed">
          <i class="fas fa-database text-4xl text-slate-200 mb-4"></i>
          <p class="text-slate-400 font-black uppercase tracking-widest">No Intelligence Found</p>
          <p class="text-[10px] text-slate-300 font-bold italic mt-2">โปรดลองใช้คำค้นหาอื่นในการตรวจรหัสยุทธศาสตร์</p>
        </div>
      </div>

      <!-- Right Column: Knowledge Graph Panel (4/12) - ✨ เหมือน Google ที่คุณหา -->
      <div class="lg:col-span-4">
        <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden sticky top-10">
          <!-- Top Cover -->
          <div class="h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-900 relative">
             <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
             <div class="absolute bottom-[-30px] left-8 w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center p-4">
                <i class="fas fa-cube text-3xl text-indigo-600"></i>
             </div>
          </div>
          
          <div class="p-8 pt-12">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">CORP-X GLOBAL</h3>
                <p class="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Strategic Enterprise Entity</p>
              </div>
              <button class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <i class="fas fa-share-alt"></i>
              </button>
            </div>

            <p class="text-sm text-slate-600 font-bold leading-relaxed mb-8 italic">
              "ผู้นำด้านการจัดการยุทธศาสตร์องค์กรขั้นสูง มุ่งเน้นการบูรณาการข้อมูลและทรัพยากรมนุษย์เพื่อบรรลุเป้าหมายที่เหนือกว่าเดิม"
            </p>

            <div class="space-y-6 border-t border-slate-50 pt-8">
              <div class="flex items-start gap-4">
                 <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <i class="fas fa-building text-xs"></i>
                 </div>
                 <div>
                    <span class="block text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Status</span>
                    <span class="font-bold text-slate-700 text-sm">Operational Global Hub</span>
                 </div>
              </div>
              <div class="flex items-start gap-4">
                 <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <i class="fas fa-users text-xs"></i>
                 </div>
                 <div>
                    <span class="block text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Assets</span>
                    <span class="font-bold text-slate-700 text-sm">{{ stats.memberCount || 0 }} Elite Personnel</span>
                 </div>
              </div>
              <div class="flex items-start gap-4">
                 <div class="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                    <i class="fas fa-rocket text-xs"></i>
                 </div>
                 <div>
                    <span class="block text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Active Missions</span>
                    <span class="font-bold text-slate-700 text-sm">{{ stats.projectCount || 0 }} Strategic Projects</span>
                 </div>
              </div>
            </div>

            <button class="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all">
              <i class="fas fa-globe"></i> Visit Official Identity
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api'

const searchQuery = ref('')
const searchPerformed = ref(false)
const results = ref([])
const stats = ref({ projectCount: 0, memberCount: 0 })

const props = defineProps(['projects', 'allStaff'])

onMounted(async () => {
  stats.value.projectCount = props.projects?.length || 0
  stats.value.memberCount = props.allStaff?.length || 0
})

const handleSearch = () => {
    if (!searchQuery.value) return
    
    searchPerformed.value = true
    results.value = []
    
    const query = searchQuery.value.toLowerCase()
    
    // Search in Projects
    if (props.projects) {
        props.projects.forEach(p => {
            if (p.title.toLowerCase().includes(query) || (p.desc && p.desc.toLowerCase().includes(query))) {
                results.value.push({
                    id: p.id,
                    type: 'project',
                    title: p.title,
                    desc: p.desc || 'โครงการยุทธศาสตร์บริษัท'
                })
            }
        })
    }
    
    // Search in Staff
    if (props.allStaff) {
        props.allStaff.forEach(s => {
            if (s.name?.toLowerCase().includes(query) || s.staffId?.toLowerCase().includes(query) || s.position?.toLowerCase().includes(query)) {
                results.value.push({
                    id: s.staffId,
                    type: 'identity',
                    title: `Personnel Identity: ${s.name || 'Unknown'}`,
                    desc: `Position: ${s.position || 'Staff'} | Department: ${s.dept} | ID: ${s.staffId}`
                })
            }
        })
    }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
