<template>
  <div class="h-[calc(100vh-4rem)] flex flex-col animate-fade-up">

    <!-- 📄 MODE: INBOX (Picture 1 Landing) -->
    <template v-if="currentView === 'inbox'">
        <div class="flex flex-col h-[calc(100vh-8rem)]">
          <ReportInbox 
            user-role="pm" 
            @write-report="handleWriteReport" 
            @show-history="currentView = 'history'" 
            @edit="handleEditFromInbox"
          />
        </div>
    </template>

    <!-- ✍️ MODE: FORM (Writing/Editing Mode) -->
    <template v-else-if="currentView === 'form'">
        <!-- Header -->
        <div class="flex items-center gap-6 mb-8 shrink-0">
          <button @click="currentView = 'inbox'" class="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm cursor-pointer shrink-0">
              <i class="fas fa-arrow-left"></i>
          </button>
          <div class="flex items-end gap-4">
            <div class="bg-indigo-500 w-2 h-12 rounded-full"></div>
            <div>
              <h2 class="text-[16px] font-black text-slate-900 uppercase tracking-tighter leading-none italic">
                {{ editingReport ? 'แก้ไขรายงานสรุปผล' : 'ส่งรายงานสรุปผล' }}
              </h2>
              <p class="text-slate-400 text-[12px] font-bold uppercase mt-1 tracking-[0.2em] italic">รายงานผลการปฏิบัติงานส่วนบุคคล</p>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0 text-left">
        
        <!-- Submission Form (Left - 2 Cols) -->
        <div class="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-10 overflow-y-auto custom-scrollbar relative">
            <!-- ... (Keep existing form content) ... -->
            <div class="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-bl-[100px] -z-0 pointer-events-none"></div>

            <h3 class="text-xl font-black text-indigo-600 uppercase tracking-tight mb-6 relative z-10 flex items-center gap-2">
                <i class="fas fa-pen-to-square"></i> เขียนรายงานใหม่
            </h3>

            <form @submit.prevent="submitReport" class="space-y-6 relative z-10">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Title -->
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">หัวข้อรายงาน</label>
                        <input v-model="reportTitle" type="text" placeholder="เช่น รายงานผลการทดสอบระบบ V.2" class="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300" />
                    </div>

                    <!-- Report Type -->
                    <div class="space-y-2">
                         <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ประเภทรายงาน</label>
                         <select v-model="reportType" class="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer">
                             <option value="daily">รายงานประจำวัน (Daily Update)</option>
                             <option value="incident">รายงานปัญหา (Incident Report)</option>
                             <option value="suggestion">ข้อเสนอแนะ (Suggestion)</option>
                             <option value="manpower">ขอกำลังพลเพิ่ม (Request Manpower)</option>
                         </select>
                    </div>
                </div>

                <!-- Incident Fields -->
                <div v-if="reportType === 'incident'" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up">
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ระดับความรุนแรง (Severity)</label>
                         <div class="flex gap-2">
                            <button type="button" @click="priority = 'normal'" :class="['flex-1 py-3 rounded-lg text-xs font-black border transition-colors', priority === 'normal' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100']">Normal</button>
                            <button type="button" @click="priority = 'urgent'" :class="['flex-1 py-3 rounded-lg text-xs font-black border transition-colors', priority === 'urgent' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100']">Urgent</button>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">เวลาที่เกิดเหตุ</label>
                        <input type="time" class="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                </div>

                <!-- Manpower Fields -->
                <div v-if="reportType === 'manpower'" class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up">
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">จำนวน (คน)</label>
                        <input type="number" min="1" value="1" class="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div class="space-y-2 md:col-span-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ตำแหน่ง / ทักษะที่ต้องการ</label>
                        <input type="text" placeholder="เช่น Backend Developer (Node.js)" class="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                </div>

                <!-- Content -->
                <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {{ reportType === 'suggestion' ? 'รายละเอียดข้อเสนอแนะ' : 'รายละเอียด' }}
                    </label>
                    <textarea v-model="reportContent" rows="6" :placeholder="placeholderText" class="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all resize-none placeholder:text-slate-300"></textarea>
                </div>

                 <!-- File Attachment Area -->
                 <div class="space-y-2">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">แนบไฟล์หลักฐาน (ถ้ามี)</label>
                      
                      <div v-if="!selectedFile" @click="triggerFileInput" class="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all group">
                          <input type="file" ref="fileInput" @change="handleFileChange" accept=".pdf,.png,.jpg,.jpeg" class="hidden" />
                          <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <i class="fas fa-cloud-upload-alt text-lg"></i>
                          </div>
                          <p class="text-xs font-bold text-slate-400">ลากไฟล์มาวาง หรือ <span class="text-indigo-600 underline">คลิกเพื่อเลือกไฟล์</span></p>
                          <p class="text-[9px] text-slate-300">รองรับ PDF, PNG, JPG (สูงสุด 10MB)</p>
                      </div>

                      <div v-else class="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between animate-fade-up">
                          <div class="flex items-center gap-3">
                              <div class="w-10 h-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-sm">
                                  <i class="fas fa-file-alt"></i>
                              </div>
                              <div class="flex flex-col">
                                  <span class="text-xs font-black text-slate-800 line-clamp-1">{{ selectedFile.name }}</span>
                                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ formatFileSize(selectedFile.size) }}</span>
                              </div>
                          </div>
                          <button @click="removeFile" type="button" class="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center shadow-sm">
                              <i class="fas fa-times text-xs"></i>
                          </button>
                      </div>
                 </div>

                <!-- Submit Button -->
                <div class="flex justify-end pt-4">
                     <button type="submit" :disabled="isSubmitting" class="bg-indigo-600 text-white px-8 py-3.5 rounded-xl text-xs font-black tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-50">
                        <i class="fas fa-paper-plane"></i> {{ isSubmitting ? 'กำลังส่ง...' : 'ส่งรายงานทันที' }}
                    </button>
                </div>

            </form>
        </div>

        <!-- History Side (Right - 1 Col) -->
        <div class="flex flex-col gap-6 h-full min-h-0">


             <!-- Recent List -->
             <div class="flex-1 bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 overflow-y-auto custom-scrollbar flex flex-col">
                 <h3 class="text-sm font-black text-slate-700 uppercase tracking-tight mb-4 flex items-center justify-between">
                     <div class="flex items-center gap-2">
                        <i class="fas fa-history text-indigo-500"></i> ประวัติล่าสุด
                     </div>
                 </h3>
                 
                 <div class="space-y-3">
                     <div v-if="historyReports.length === 0" class="py-10 text-center text-slate-300 font-bold text-[10px] uppercase">ไม่มีประวัติรายงาน</div>
                     <div v-for="report in historyReports.slice(0, 5)" :key="report.id" @click="viewReport(report)" class="p-3 bg-slate-50 hover:bg-white border text-left border-transparent hover:border-slate-100 rounded-2xl cursor-pointer transition-all group relative overflow-hidden">
                          <div class="flex justify-between items-start mb-1">
                              <span :class="['text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider', getTypeClass(report.type)]">{{ translateType(report.type) }}</span>
                              <span class="text-[8px] font-bold text-slate-400 uppercase">{{ formatDate(report.date) }}</span>
                          </div>
                          
                          <h4 class="text-xs font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{{ report.title }}</h4>
                          
                          <div class="flex items-center gap-2 mt-2">
                              <div :class="['w-1.5 h-1.5 rounded-full', report.status === 'RETURNED' ? 'bg-rose-400' : (report.status === 'REVIEWED' ? 'bg-emerald-400' : 'bg-amber-400')]"></div>
                              <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                 {{ report.status === 'RETURNED' ? 'ส่งกลับแก้ไข' : (report.status === 'REVIEWED' ? 'ตรวจสอบแล้ว' : 'รอตรวจสอบ') }}
                              </p>
                          </div>
                     </div>
                 </div>

             </div>

        </div>
      </div>
    </template>

    <!-- 📚 MODE: HISTORY (Picture 2 Grid View) -->
    <template v-else-if="currentView === 'history'">
        <div class="flex flex-col h-[calc(100vh-8rem)] animate-fade-up">
            
            <!-- Header -->
            <div class="flex items-center justify-between mb-8 shrink-0">
                 <div class="flex items-center gap-6">
                    <button @click="currentView = 'inbox'" class="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm cursor-pointer z-10 hover:shadow-md">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <div class="flex items-end gap-4">
                        <div class="w-2 h-12 rounded-full bg-[#121926] transition-colors duration-500"></div>
                        <div>
                            <h2 class="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none text-left">รายงานทั้งหมด</h2>
                            <p class="text-slate-400 text-[10px] font-bold uppercase mt-2 tracking-[0.2em] italic leading-none text-left">ตรวจสอบข้อมูลรายงานปฏิบัติงานที่บันทึกไว้ในระบบ</p>
                        </div>
                    </div>
                 </div>

                 <!-- Grid/List Tabs -->
                 <div class="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                    <button v-for="tab in ['all', 'pending', 'reviewed', 'returned']" :key="tab" @click="historyTab = tab"
                        :class="['px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', 
                        historyTab === tab ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600']">
                        {{ tab === 'all' ? 'ทั้งหมด' : (tab === 'pending' ? 'รอตรวจสอบ' : (tab === 'reviewed' ? 'ตรวจสอบแล้ว' : 'ส่งกลับ')) }}
                    </button>
                 </div>
            </div>

            <!-- Cards Grid -->
            <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
                <div v-if="filteredHistory.length === 0" class="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                     <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200 text-3xl">
                        <i class="fas fa-folder-open"></i>
                     </div>
                     <p class="text-slate-400 font-bold uppercase tracking-widest text-xs leading-none">ไม่พบข้อมูลรายงานในหมวดหมู่นี้</p>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div v-for="report in filteredHistory" :key="report.id" @click="viewReport(report)"
                      class="group bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer relative overflow-hidden flex flex-col h-full text-left">
                      
                      <div class="flex justify-between items-start mb-6">
                        <span :class="['text-[9px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest leading-none', getTypeClass(report.type)]">
                          {{ translateType(report.type) }}
                        </span>
                        <span class="text-[9px] font-black text-slate-300 uppercase italic tracking-tighter leading-none">
                          {{ formatDate(report.date) }}
                        </span>
                      </div>
                      
                      <h4 class="text-lg font-black text-slate-800 leading-tight uppercase tracking-tight mb-4 group-hover:text-indigo-600 transition-colors flex-1 line-clamp-2">
                         {{ report.title }}
                      </h4>
                      
                      <div class="flex justify-between items-center mb-4">
                        <div class="flex items-center gap-2">
                            <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${report.submittedBy}`" class="w-5 h-5 rounded-full bg-slate-100">
                            <span class="text-[10px] font-bold text-slate-500 uppercase leading-none">{{ report.submittedBy }}</span>
                        </div>
                      </div>


                  <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                         <div class="flex items-center gap-2">
                            <div :class="['w-1.5 h-1.5 rounded-full shadow-sm', report.status === 'RETURNED' ? 'bg-rose-500 animate-pulse' : (report.status === 'REVIEWED' ? 'bg-emerald-500' : 'bg-amber-400')]"></div>
                            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                {{ report.status === 'RETURNED' ? 'ส่งกลับแก้ไข' : (report.status === 'REVIEWED' ? 'ตรวจสอบแล้ว' : 'รอตรวจสอบ') }}
                            </span>
                         </div>
                         <div class="w-8 h-8 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                            <i class="fas fa-chevron-right text-[10px]"></i>
                         </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
  </div>

    <!-- Report Detail Modal (Accessible from both main view and full history) -->
    <div v-if="selectedViewReport" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" @click.self="closeViewReport">
        <div class="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col animate-scale-up">
            
            <!-- Header -->
            <div class="px-8 py-6 border-b border-slate-50 flex justify-between items-center shrink-0 bg-white z-10">
                <div class="flex items-center gap-4">
                     <span :class="['text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest', getTypeClass(selectedViewReport.type)]">
                         {{ translateType(selectedViewReport.type) }}
                     </span>
                     <span class="text-xs font-black text-slate-300 uppercase tracking-wider">{{ formatDate(selectedViewReport.date) }}</span>
                </div>
                <button @click="closeViewReport" class="w-8 h-8 rounded-full bg-slate-50 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-colors">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Content -->
            <div class="p-8 overflow-y-auto custom-scrollbar space-y-8">
                
                <h2 class="text-xl font-black text-slate-800 leading-tight uppercase tracking-tight">{{ selectedViewReport.title }}</h2>

                <!-- Status Badge -->
                <div class="flex items-center gap-3">
                     <span :class="['px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border', 
                        selectedViewReport.status === 'RETURNED' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                        selectedViewReport.status === 'REVIEWED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        'bg-amber-50 text-amber-600 border-amber-100']">
                        {{ selectedViewReport.status === 'RETURNED' ? 'ส่งกลับแก้ไข' : (selectedViewReport.status === 'REVIEWED' ? 'ตรวจสอบแล้ว' : 'รอตรวจสอบ') }}
                     </span>
                     
                     <span v-if="selectedViewReport.priority === 'urgent'" class="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest animate-pulse">
                         ด่วนพิเศษ
                     </span>
                </div>

                <!-- Feedback Section -->
                <div v-if="selectedViewReport.status === 'RETURNED' && selectedViewReport.feedback" class="bg-rose-50 border border-rose-100 rounded-2xl p-6">
                    <h4 class="text-rose-800 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                        <i class="fas fa-exclamation-triangle"></i> เหตุผลที่ถูกส่งกลับ
                    </h4>
                    <p class="text-rose-700 text-sm font-medium leading-relaxed">{{ selectedViewReport.feedback }}</p>
                </div>

                <!-- Main Content -->
                <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-300 uppercase tracking-widest">รายละเอียด</label>
                    <div class="bg-slate-50 p-6 rounded-2xl text-slate-700 text-sm font-medium leading-relaxed whitespace-pre-wrap border border-slate-100">
                        {{ selectedViewReport.content || '-' }}
                    </div>
                </div>

                <!-- Attachments -->
                <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-300 uppercase tracking-widest">ไฟล์แนบ</label>
                    <div v-if="selectedViewReport.attachments && selectedViewReport.attachments.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div v-for="(file, idx) in selectedViewReport.attachments" :key="idx" class="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors cursor-pointer group">
                            <div class="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <i class="fas fa-file-alt"></i>
                            </div>
                            <div class="min-w-0">
                                <p class="text-xs font-black text-slate-700 truncate max-w-[150px]">{{ file.name }}</p>
                                <p class="text-[9px] text-slate-400 uppercase tracking-wider">{{ (file.size / 1024).toFixed(1) }} KB</p>
                            </div>
                        </div>
                    </div>
                    <div v-else class="p-8 border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-300 gap-2">
                        <i class="fas fa-paperclip text-2xl"></i>
                        <span class="text-[10px] font-black uppercase tracking-widest">ไม่มีไฟล์แนบ</span>
                    </div>
                </div>

            </div>

            <!-- Review Actions (If PM viewing Staff report) -->
            <div v-if="selectedViewReport && selectedViewReport.submittedByRole === 'staff' && (selectedViewReport.status === 'PENDING' || selectedViewReport.status === 'รอตรวจสอบ')" class="px-8 py-6 border-t border-slate-50 bg-slate-50/50 space-y-4">
                <div class="space-y-2 text-left">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ข้อเสนอแนะสำหรับการตรวจสอบ</label>
                    <textarea v-model="reviewFeedback" placeholder="ระบุเหตุผลหากต้องการให้แก้ไข หรือข้อความชื่นชม..." class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all resize-none h-20"></textarea>
                </div>
                <div class="flex gap-3">
                    <button @click="returnReport" class="flex-1 py-3 bg-white text-rose-500 border border-rose-200 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-50 transition-all shadow-sm">
                        <i class="fas fa-undo-alt mr-2"></i> ส่งกลับไปแก้ไข
                    </button>
                    <button @click="approveReport" class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                        <i class="fas fa-check-circle mr-2"></i> ตรวจสอบผ่าน
                    </button>
                </div>
            </div>

            <div v-else class="p-6 border-t border-slate-50 bg-slate-50 flex justify-end">
                <button @click="closeViewReport" class="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-colors shadow-sm">
                    ปิดหน้าต่าง
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/api'
import { formatDate } from '@/utils/date'
import ReportInbox from '@/lead/ReportInbox.vue'

const emit = defineEmits(['notify', 'refresh'])
const props = defineProps(['deptName', 'userName'])

const reportType = ref('daily')
const priority = ref('normal')
const reportContent = ref('')
const reportTitle = ref('')
const isSubmitting = ref(false)
const historyReports = ref([])
const reviewFeedback = ref('')
const selectedFile = ref(null)
const fileInput = ref(null)

const placeholderText = computed(() => {
    switch(reportType.value) {
        case 'daily': return 'ระบุรายละเอียดผลการปฏิบัติงานวันนี้ ความคืบหน้า และสิ่งที่ทำสำเร็จ...'
        case 'incident': return 'อธิบายเหตุการณ์ที่เกิดขึ้น สาเหตุ ผลกระทบ และการแก้ไขเบื้องต้น...'
        case 'suggestion': return 'อธิบายแนวคิด ข้อเสนอแนะ หรือสิ่งที่อยากให้ปรับปรุง...'
        case 'manpower': return 'ระบุเหตุผลความจำเป็น ขอบเขตงาน และคุณสมบัติที่ต้องการเพิ่มเติม...'
        default: return 'ระบุรายละเอียด...'
    }
})

const currentView = ref('inbox')
const editingReport = ref(null)
const historyTab = ref('pending')

const handleWriteReport = () => {
    resetForm()
    currentView.value = 'form'
}

const handleEditFromInbox = (reportData) => {
    editingReport.value = reportData
    reportTitle.value = reportData.title
    reportType.value = reportData.type
    reportContent.value = reportData.content
    priority.value = reportData.priority || 'normal'
    currentView.value = 'form'
}

const resetForm = () => {
    editingReport.value = null
    reportTitle.value = ''
    reportType.value = 'daily'
    reportContent.value = ''
    priority.value = 'normal'
    selectedFile.value = null
}

const filteredHistory = computed(() => {
    let results = historyReports.value
    
    if (historyTab.value === 'pending') {
        results = historyReports.value.filter(r => (r.status || '').toUpperCase() === 'PENDING' || (r.status || '') === 'รอตรวจสอบ')
    } else if (historyTab.value === 'reviewed') {
        results = historyReports.value.filter(r => (r.status || '').toUpperCase() === 'REVIEWED' || (r.status || '') === 'ตรวจสอบแล้ว')
    } else if (historyTab.value === 'returned') {
        results = historyReports.value.filter(r => (r.status || '').toUpperCase() === 'RETURNED' || (r.status || '') === 'ส่งกลับแก้ไข')
    }
    
    return results
})

const fetchHistory = async () => {
    try {
        const myName = props.userName || localStorage.getItem('userName')
        const data = await api.getReports({ submittedBy: myName, role: 'pm' })
        if (data) historyReports.value = data // Update full list
    } catch (e) {
        console.error("Failed to fetch history", e)
    }
}

onMounted(() => {
    fetchHistory()
})

watch(() => props.userName, fetchHistory)

const selectedViewReport = ref(null)

const viewReport = (report) => {
    selectedViewReport.value = {
        ...report,
        type: report.type || 'daily',
        priority: report.priority || 'normal',
        content: report.content || report.description,
        footer: report.footer || report.description, // Fallback
        attachments: report.attachments || []
    }
}

const closeViewReport = () => {
    selectedViewReport.value = null
    reviewFeedback.value = ''
}

const approveReport = async () => {
    if (!selectedViewReport.value) return
    try {
        await api.updateReport(selectedViewReport.value.id, { 
            status: 'reviewed', 
            feedback: reviewFeedback.value 
        })
        emit('notify', { message: 'ตรวจสอบรายงานเรียบร้อยแล้ว', type: 'success' })
        closeViewReport()
        fetchHistory()
        emit('refresh')
    } catch (e) {
        console.error(e)
        emit('notify', { message: 'เกิดข้อผิดพลาดในการตรวจสอบ', type: 'error' })
    }
}

const returnReport = async () => {
    if (!selectedViewReport.value) return
    if (!reviewFeedback.value) return emit('notify', { message: 'กรุณาระบุเหตุผลในการส่งกลับ', type: 'error' })
    try {
        await api.updateReport(selectedViewReport.value.id, { 
            status: 'returned', 
            feedback: reviewFeedback.value 
        })
        emit('notify', { message: 'ส่งคืนรายงานให้แก้ไขแล้ว', type: 'success' })
        closeViewReport()
        fetchHistory()
        emit('refresh')
    } catch (e) {
        console.error(e)
        emit('notify', { message: 'เกิดข้อผิดพลาดในการส่งคืน', type: 'error' })
    }
}

const translateType = (type) => {
  const mapping = {
    daily: 'รายงานรายวัน',
    incident: 'รายงานปัญหา',
    suggestion: 'ข้อเสนอแนะ',
    manpower: 'ขอกำลังพล',
    weekly: 'รายงานสัปดาห์',
    emergency: 'รายงานฉุกเฉิน',
    task: 'งานปฏิบัติการ'
  }
  return mapping[type] || type
}

const translatePriority = (priority) => {
  const mapping = {
    high: 'สูงมาก',
    urgent: 'ด่วนพิเศษ',
    normal: 'ปกติ',
    low: 'ต่ำ'
  }
  return mapping[priority] || priority
}

const getTypeClass = (type) => {
  const styles = { 
      daily: 'bg-emerald-100 text-emerald-600', 
      incident: 'bg-rose-100 text-rose-600',
      urgent: 'bg-rose-100 text-rose-600',
      suggestion: 'bg-amber-100 text-amber-600',
      manpower: 'bg-blue-100 text-blue-600'
  }
  return styles[type] || 'bg-slate-100 text-slate-600'
}

const triggerFileInput = () => {
    fileInput.value.click()
}

const handleFileChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
        if (files[0].size > 10 * 1024 * 1024) {
             emit('notify', { message: 'ขนาดไฟล์ต้องไม่เกิน 10MB ครับ', type: 'error' })
             return
        }
        selectedFile.value = files[0]
    }
}

const removeFile = () => {
    selectedFile.value = null
    if (fileInput.value) fileInput.value.value = ''
}

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const submitReport = async () => {
    if (!reportTitle.value.trim() || !reportContent.value.trim()) {
        emit('notify', { message: 'กรุณากรอกข้อมูลให้ครบถ้วนครับ', type: 'error' })
        return
    }

    isSubmitting.value = true
    try {
        // Convert file to Base64 if exists
        let attachmentData = null
        if (selectedFile.value) {
            attachmentData = await new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(selectedFile.value)
            })
        }

        const attachments = []
        if (selectedFile.value && attachmentData) {
            attachments.push({
                name: selectedFile.value.name,
                size: selectedFile.value.size,
                type: selectedFile.value.type,
                data: attachmentData
            })
        }

        const payload = {
            title: reportTitle.value,
            type: reportType.value,
            content: reportContent.value,
            description: reportContent.value,
            priority: priority.value,
            submittedBy: props.userName || localStorage.getItem('userName'),
            submittedByRole: 'pm',
            dept: props.deptName || localStorage.getItem('deptName'),
            date: new Date(),
            attachments: attachments
        }

        const res = await api.createReport(payload)
        if (res && res.success) {
            emit('notify', { message: 'ส่งรายงานเรียบร้อยแล้ว! ระบบได้รับข้อมูลแล้วครับ', type: 'success' })
            reportTitle.value = ''
            reportContent.value = ''
            removeFile()
            fetchHistory()
            emit('refresh')
        }
    } catch (e) {
        console.error("Submit report error", e)
        if (e.message.includes('413')) {
            emit('notify', { message: 'ขนาดไฟล์เกินกำหนด! กรุณารีสตาร์ท Server (Ctrl+C แล้ว node server.js) เพื่ออัปเดตค่า', type: 'error' })
        } else {
            emit('notify', { message: 'ไม่สามารถส่งรายงานได้: ' + e.message, type: 'error' })
        }
    } finally {
        isSubmitting.value = false
    }
}
</script>
