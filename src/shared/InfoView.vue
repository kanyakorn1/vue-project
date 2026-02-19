<template>
  <div class="space-y-10 text-left animate-fade-in">
    <!-- Header Section -->
    <div class="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div class="text-left">
        <h2 class="text-2xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Information Portal</h2>
        <p class="text-indigo-500 text-[10px] font-black uppercase mt-2 tracking-widest italic">Identity Verification & Personnel Records Hub</p>
      </div>
      <div class="flex gap-4">
        <button @click="showRequestModal = true" class="bg-[#121926] text-white px-8 py-4 rounded-[1.8rem] text-[12px] font-black uppercase shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3">
          <i class="fas fa-edit"></i> ลงทะเบียน/แก้ไขข้อมูล
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Left: Approval Inbox (Visible only to approvers) -->
      <div v-if="isApprover" class="lg:col-span-12 space-y-6">
        <div class="flex items-center gap-4 px-4">
          <i class="fas fa-shield-alt text-indigo-500 text-xl"></i>
          <h3 class="text-[14px] font-black text-slate-400 uppercase tracking-widest">คำร้องขอตรวจสอบความถูกต้องของข้อมูล</h3>
        </div>
        
        <div v-if="pendingApprovals.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="req in pendingApprovals" :key="req.id" 
               class="bg-white p-7 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            
            <div class="relative z-10 flex flex-col h-full">
              <div class="flex items-start gap-4 mb-6">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.requestedBy}`" class="w-14 h-14 rounded-2xl bg-slate-900/5 p-1 border border-slate-100 shadow-inner">
                <div class="text-left">
                  <p class="text-[15px] font-black text-slate-800 leading-tight">{{ req.requestedBy }}</p>
                  <span class="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter italic">{{ req.role }}</span>
                </div>
              </div>

              <div class="flex-1 space-y-4">
                 <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100/50">
                   <p class="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Type of Update</p>
                   <p class="text-[16px] font-black text-slate-800 italic uppercase tracking-tighter">{{ req.infoType }}</p>
                 </div>
                 
                 <div class="p-4 bgIndigo-50/30 rounded-2xl border border-indigo-100/50">
                    <p class="text-[10px] font-black text-indigo-400 uppercase mb-2 tracking-widest">Requested Data Changes</p>
                    <div class="space-y-2">
                       <div v-for="(val, key) in req.content" :key="key" class="flex justify-between items-center bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                          <span class="text-[10px] font-black text-slate-400 uppercase">{{ key }}</span>
                          <span class="text-[12px] font-bold text-slate-700">{{ val }}</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div class="grid grid-cols-2 gap-3 mt-8">
                <button @click="handleAction(req, 'approved')" class="bg-[#5c56f0] text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-600 transition-all active:scale-95">Verify & Approve</button>
                <button @click="handleAction(req, 'rejected')" class="bg-rose-50 text-rose-500 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95">Reject Request</button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="h-[200px] bg-slate-100/20 rounded-[4rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-10">
          <i class="fas fa-id-card text-4xl text-slate-200 mb-4 opacity-50"></i>
          <p class="text-slate-300 font-black italic uppercase tracking-widest px-10 text-center">Security Clearance clear: No pending identity verifications.</p>
        </div>
      </div>

      <!-- Registration History -->
      <div class="lg:col-span-12 space-y-6">
        <div class="flex items-center gap-4 px-4">
          <i class="fas fa-stream text-slate-400 text-xl"></i>
          <h3 class="text-[14px] font-black text-slate-400 uppercase tracking-widest">Registration Status History</h3>
        </div>
        
        <div class="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Type / Date</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="h in myHistory" :key="h.id" class="hover:bg-slate-50/50 transition-colors">
                <td class="px-8 py-6">
                  <p class="text-[13px] font-black text-slate-800 uppercase italic tracking-tighter leading-none">{{ h.infoType }}</p>
                  <p class="text-[9px] font-bold text-slate-400 mt-2 tracking-widest">{{ formatDate(h.date) }}</p>
                </td>
                <td class="px-8 py-6">
                  <div class="flex flex-wrap gap-2">
                    <span v-for="(v, k) in h.content" :key="k" class="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
                      {{ k }}: {{ v }}
                    </span>
                  </div>
                </td>
                <td class="px-8 py-6">
                  <span :class="['px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border', statusColors[h.requestStatus]]">
                    {{ h.requestStatus }}
                  </span>
                </td>
              </tr>
              <tr v-if="myHistory.length === 0">
                <td colspan="3" class="px-8 py-16 text-center text-slate-300 font-black italic uppercase tracking-[0.2em] italic">
                   No pending identity records or registration logs found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <transition name="modal-fade">
      <div v-if="showRequestModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1121]/95 backdrop-blur-sm p-6 text-left">
        <div class="bg-white w-full max-w-[520px] rounded-[4rem] p-12 shadow-[0_40px_120px_rgba(0,0,0,0.5)] animate-pop text-left relative overflow-hidden">
           <button @click="showRequestModal = false" class="absolute top-10 right-10 text-slate-300 hover:text-rose-500 transition-colors">
             <i class="fas fa-times text-2xl"></i>
           </button>

           <header class="mb-10 text-left">
             <h3 class="text-3xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Register Identity</h3>
             <p class="text-indigo-500 text-[10px] font-black uppercase mt-1 tracking-widest italic">Personal Data Management Hub</p>
           </header>

           <div class="space-y-6 text-left">
             <div class="space-y-2">
               <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">ขอบเขตข้อมูล (Information Scope)</label>
               <select v-model="newRequest.infoType" class="w-full px-8 py-4 bg-slate-50 border-2 border-transparent rounded-[1.8rem] font-bold text-slate-800 outline-none focus:border-indigo-500/30 transition-all appearance-none cursor-pointer">
                 <option value="" disabled>เลือกโครงการข้อมูล...</option>
                 <option value="Personal Profile Update">Personal Profile Update</option>
                 <option value="Position & Rank Reclassification">Position & Rank Reclassification</option>
                 <option value="Emergency Contact Registry">Emergency Contact Registry</option>
                 <option value="Professional Credentials Update">Professional Credentials Update</option>
               </select>
             </div>

             <div v-if="newRequest.infoType === 'Personal Profile Update'" class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                   <label class="text-[10px] font-black text-slate-400 uppercase ml-5">New Full Name</label>
                   <input v-model="contentForm.name" type="text" class="w-full py-4 px-6 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-4 focus:ring-indigo-500/10">
                </div>
                <div class="space-y-2">
                   <label class="text-[10px] font-black text-slate-400 uppercase ml-5">New Title</label>
                   <input v-model="contentForm.title" type="text" class="w-full py-4 px-6 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-4 focus:ring-indigo-500/10">
                </div>
             </div>

             <div v-if="newRequest.infoType === 'Position & Rank Reclassification'" class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-5">Target Position / Rank</label>
                <input v-model="contentForm.position" type="text" placeholder="e.g. Senior Specialist..." class="w-full py-4 px-6 bg-slate-50 rounded-2xl border-none font-bold text-sm">
             </div>

             <div class="bg-[#121926] p-6 rounded-[2.5rem] border border-slate-700/30 text-left">
                <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 leading-none">
                   <i class="fas fa-lock text-indigo-400"></i> SECURITY CLEARANCE PROTOCOL
                </p>
                <div class="flex items-center gap-3">
                   <span class="text-[11px] font-bold text-slate-400 italic">Target Authority:</span>
                   <span class="px-3 py-1 bg-white/10 text-white text-[9px] font-black uppercase rounded-lg border border-white/10">
                      {{ userRole === 'lead' ? 'GENERAL MANAGER' : 'STRATEGIC LEAD' }}
                   </span>
                </div>
             </div>

             <button @click="submitRequest" 
                     :disabled="!newRequest.infoType"
                     class="w-full py-6 bg-[#5c56f0] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-400/20 hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50 mt-4">
               AUTHORIZE REGISTRATION
             </button>
           </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import api from '@/api'

const props = defineProps(['userName', 'userRole', 'userEmail'])
const emit = defineEmits(['notify'])

const showRequestModal = ref(false)
const pendingApprovals = ref([])
const myHistory = ref([])
const newRequest = reactive({ infoType: '' })
const contentForm = reactive({ name: '', title: '', position: '' })

const statusColors = {
  pending: 'bg-amber-50 text-amber-500 border-amber-100',
  approved: 'bg-emerald-50 text-emerald-500 border-emerald-100',
  rejected: 'bg-rose-50 text-rose-500 border-rose-100'
}

const isApprover = computed(() => ['manager', 'lead'].includes(props.userRole))

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  try {
    const history = await api.getInfoRequests({ requestedBy: props.userName })
    if (history) myHistory.value = history

    if (isApprover.value) {
      const approvals = await api.getInfoRequests({ approverRole: props.userRole })
      if (approvals) pendingApprovals.value = approvals.filter(r => r.requestStatus === 'pending')
    }
  } catch (e) {
    console.error("Failed to fetch info data", e)
  }
}

const submitRequest = async () => {
  if (!newRequest.infoType) return
  
  try {
    // Collect non-empty fields from form
    const finalContent = {}
    Object.keys(contentForm).forEach(k => {
      if (contentForm[k]) finalContent[k] = contentForm[k]
    })

    const payload = {
      requestedBy: props.userName,
      role: props.userRole,
      infoType: newRequest.infoType,
      content: finalContent
    }
    
    await api.createInfoRequest(payload)
    emit('notify', 'คำร้องขอลงทะเบียนข้อมูลถูกส่งไปยังผู้มีอำนาจตรวจสอบแล้ว')
    showRequestModal.value = false
    newRequest.infoType = ''
    Object.keys(contentForm).forEach(k => contentForm[k] = '')
    await fetchData()
  } catch (e) {
    alert("Authorization failed. Ensure system connection.")
  }
}

const handleAction = async (req, action) => {
  try {
    await api.updateInfoRequest(req.id, { requestStatus: action })
    emit('notify', `Registration ${action} successful. Records updated.`)
    await fetchData()
  } catch (e) {
    alert("Record update failed.")
  }
}

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('th-TH', { 
    day: '2-digit', 
    month: 'short', 
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67); }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.animate-pop { animation: pop 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67); }
@keyframes pop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>
