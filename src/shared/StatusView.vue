<template>
  <div class="space-y-10 text-left animate-fade-in">
    <!-- Header Section -->
    <div class="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div class="text-left">
        <h2 class="text-2xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Status Center</h2>
        <p class="text-indigo-500 text-[10px] font-black uppercase mt-2 tracking-widest italic">Personal & Team Availability Management</p>
      </div>
      <div class="flex gap-4">
        <button @click="showRequestModal = true" class="bg-[#5c56f0] text-white px-8 py-4 rounded-[1.8rem] text-[12px] font-black uppercase shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3">
          <i class="fas fa-plus-circle"></i> ลงทะเบียนสถาานะใหม่
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Left: Approval Inbox (Visible only to approvers) -->
      <div v-if="isApprover" class="lg:col-span-12 space-y-6">
        <div class="flex items-center gap-4 px-4">
          <i class="fas fa-inbox text-indigo-500 text-xl"></i>
          <h3 class="text-[14px] font-black text-slate-400 uppercase tracking-widest">Inbox: รอการอนุมัติสถานะ</h3>
        </div>
        
        <div v-if="pendingApprovals.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="req in pendingApprovals" :key="req.id" 
               class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div class="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
            
            <div class="relative z-10 flex flex-col h-full">
              <div class="flex items-start gap-4 mb-5">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.requestedBy}`" class="w-12 h-12 rounded-2xl bg-slate-900/5 p-1 border border-slate-100 shadow-inner">
                <div class="text-left">
                  <p class="text-[13px] font-black text-slate-800 leading-tight">{{ req.requestedBy }}</p>
                  <span class="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter italic">{{ req.role }}</span>
                </div>
              </div>

              <div class="flex-1 space-y-4">
                 <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                   <p class="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Requested Status</p>
                   <p class="text-[15px] font-black text-slate-700 italic uppercase tracking-tighter">{{ req.status }}</p>
                 </div>
                 <div class="px-2">
                   <p class="text-[12px] font-bold text-slate-500 leading-relaxed italic line-clamp-2">"{{ req.message || 'ไม่มีหมายเหตุ' }}"</p>
                 </div>
              </div>

              <div class="grid grid-cols-2 gap-3 mt-8">
                <button @click="handleAction(req, 'approved')" class="bg-emerald-500 text-white py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-95">Approve</button>
                <button @click="handleAction(req, 'rejected')" class="bg-rose-50 text-rose-500 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95">Reject</button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="h-[200px] bg-slate-100/20 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-10">
          <i class="fas fa-check-double text-4xl text-slate-200 mb-4 scale-x-[-1]"></i>
          <p class="text-slate-300 font-black italic uppercase tracking-widest">All caught up! No pending requests.</p>
        </div>
      </div>

      <!-- My Request History -->
      <div class="lg:col-span-12 space-y-6">
        <div class="flex items-center gap-4 px-4">
          <i class="fas fa-history text-slate-400 text-xl"></i>
          <h3 class="text-[14px] font-black text-slate-400 uppercase tracking-widest">ประวัติการลงทะเบียนของฉัน</h3>
        </div>
        
        <div class="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Date</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Message</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Approver Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="h in myHistory" :key="h.id" class="hover:bg-slate-50/50 transition-colors">
                <td class="px-8 py-6">
                  <p class="text-[13px] font-black text-slate-800 uppercase italic tracking-tighter leading-none">{{ h.status }}</p>
                  <p class="text-[9px] font-bold text-slate-400 mt-2">{{ formatDate(h.date) }}</p>
                </td>
                <td class="px-8 py-6 max-w-[300px]">
                  <p class="text-[12px] font-bold text-slate-600 leading-relaxed italic truncate">{{ h.message || '-' }}</p>
                </td>
                <td class="px-8 py-6">
                  <span :class="['px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm', statusColors[h.requestStatus]]">
                    {{ h.requestStatus }}
                  </span>
                </td>
              </tr>
              <tr v-if="myHistory.length === 0">
                <td colspan="3" class="px-8 py-12 text-center text-slate-300 font-black italic uppercase italic">
                   No registration history found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Request Form -->
    <transition name="modal-fade">
      <div v-if="showRequestModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1121]/90 backdrop-blur-sm p-6 text-left">
        <div class="bg-white w-full max-w-[480px] rounded-[3.5rem] p-10 shadow-2xl animate-pop text-left relative">
           <button @click="showRequestModal = false" class="absolute top-8 right-8 text-slate-300 hover:text-slate-600">
             <i class="fas fa-times text-xl"></i>
           </button>

           <header class="mb-10 text-left">
             <h3 class="text-3xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Register Status</h3>
             <p class="text-indigo-500 text-[10px] font-black uppercase mt-2 tracking-widest italic">Submit for Review</p>
           </header>

           <div class="space-y-6 text-left">
             <div class="space-y-2">
               <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">ระบุสถานะ</label>
               <select v-model="newRequest.status" class="w-full px-8 py-4 bg-slate-50 border-2 border-transparent rounded-[1.8rem] font-bold text-slate-800 outline-none focus:border-indigo-500/30 transition-all appearance-none cursor-pointer">
                 <option value="" disabled>เลือกสถานะที่ต้องการ...</option>
                 <option value="Working from Home (WFH)">Working from Home (WFH)</option>
                 <option value="On Annual Leave">On Annual Leave</option>
                 <option value="Medical Leave">Medical Leave</option>
                 <option value="Out of Office / Business Trip">Out of Office / Business Trip</option>
                 <option value="Busy / Focus Mode">Busy / Focus Mode</option>
               </select>
             </div>

             <div class="space-y-2">
               <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">หมายเหตุ (Optional)</label>
               <textarea v-model="newRequest.message" placeholder="ระบุรายละเอียดเพิ่มเติม..." 
                         class="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.8rem] h-28 font-bold text-slate-600 outline-none focus:border-indigo-500/30 transition-all resize-none"></textarea>
             </div>

             <div class="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-left">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                   <i class="fas fa-shield-alt text-indigo-400"></i> Personnel Approval Hierarchy
                </p>
                <div class="flex items-center gap-3">
                   <span class="text-[11px] font-bold text-slate-600 italic">การลงทะเบียนของคุณจะถูกส่งให้</span>
                   <span class="px-3 py-1 bg-indigo-100 text-indigo-600 text-[9px] font-black uppercase rounded-lg">
                      {{ userRole === 'lead' ? 'ผู้จัดการ (Manager)' : 'หัวหน้า (Lead)' }}
                   </span>
                   <span class="text-[11px] font-bold text-slate-600 italic">อนุมัติ</span>
                </div>
             </div>

             <button @click="submitRequest" 
                     :disabled="!newRequest.status"
                     class="w-full py-5 bg-[#5c56f0] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50 mt-4">
               SUBMIT REGISTRATION
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
import { formatDate } from '@/utils/date'

const props = defineProps(['userName', 'userRole', 'userEmail'])
const emit = defineEmits(['notify'])

const showRequestModal = ref(false)
const pendingApprovals = ref([])
const myHistory = ref([])
const newRequest = reactive({ status: '', message: '' })

const statusColors = {
  pending: 'bg-amber-100 text-amber-600 border border-amber-200',
  approved: 'bg-emerald-100 text-emerald-600 border border-emerald-200',
  rejected: 'bg-rose-100 text-rose-600 border border-rose-200'
}

const isApprover = computed(() => ['manager', 'lead'].includes(props.userRole))

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  try {
    // Fetch History
    const history = await api.getStatusRequests({ requestedBy: props.userName })
    if (history) myHistory.value = history

    // Fetch Approvals (if manager or lead)
    if (isApprover.value) {
      const approvals = await api.getStatusRequests({ approverRole: props.userRole })
      if (approvals) pendingApprovals.value = approvals.filter(r => r.requestStatus === 'pending')
    }
  } catch (e) {
    console.error("Failed to fetch status data", e)
  }
}

const submitRequest = async () => {
  if (!newRequest.status) return
  
  try {
    const payload = {
      requestedBy: props.userName,
      role: props.userRole,
      status: newRequest.status,
      message: newRequest.message
    }
    
    await api.createStatusRequest(payload)
    emit('notify', 'สถานะถูกส่งไปเพื่อขอการอนุมัติแล้ว')
    showRequestModal.value = false
    newRequest.status = ''
    newRequest.message = ''
    await fetchData()
  } catch (e) {
    alert("การส่งคำขอล้มเหลว")
  }
}

const handleAction = async (req, action) => {
  try {
    await api.updateStatusRequest(req.id, { requestStatus: action })
    emit('notify', `ดำเนินการ ${action} สำเร็จ`)
    await fetchData()
  } catch (e) {
    alert("ดำเนินการล้มเหลว")
  }
}

// Utility formatDate is now imported from @/utils/date
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.animate-pop { animation: pop 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67); }
@keyframes pop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>
