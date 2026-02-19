<template>
  <div class="space-y-10 text-left animate-fade-in relative">
    
      <div v-if="selectedTaskView" class="animate-fade-in text-left">
      <div class="flex items-center gap-4 mb-8">
        <button @click="closeTaskView" class="w-12 h-12 rounded-full bg-[#121926] text-white flex items-center justify-center hover:bg-indigo-600 transition-all shadow-xl">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="text-left">
          <span class="text-[12px] font-black text-indigo-500 uppercase tracking-[0.3em]">รายละเอียดปฏิบัติการ</span>
          <h3 class="text-[16px] font-black text-slate-900 uppercase italic tracking-tighter leading-none mt-1">{{ selectedTaskView.title }}</h3>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl space-y-6">
            
            <!-- ⚡ Highlighted Reason for Edit Request -->
            <div v-if="(selectedTaskView.editRequested === true || String(selectedTaskView.editRequested) === 'true') && selectedTaskView.comments?.length" 
                 class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-2xl animate-pulse">
                <div class="flex items-center gap-2 mb-1">
                    <i class="fas fa-exclamation-triangle text-amber-500 text-[10px]"></i>
                    <h5 class="text-[10px] font-black text-amber-700 uppercase tracking-widest">หมายเหตุการขอแก้ไขงาน (Reason)</h5>
                </div>
                <p class="text-[13px] font-bold text-amber-900 italic leading-relaxed">
                   "{{ selectedTaskView.comments[selectedTaskView.comments.length - 1].text }}"
                </p>
                <div class="mt-2 flex items-center gap-2">
                    <span class="text-[8px] font-black text-amber-400 uppercase italic">โดย: {{ selectedTaskView.comments[selectedTaskView.comments.length - 1].sender }}</span>
                </div>
            </div>

            <div class="space-y-2">
              <p class="text-[12px] font-bold text-slate-600 leading-relaxed italic">{{ selectedTaskView.description || selectedTaskView.desc || selectedTaskView.content || 'ไม่มีข้อมูลรายละเอียดเพิ่มเติม' }}</p>
            </div>
            
            <div v-if="taskReports && taskReports.length > 0" class="space-y-6">
                <div v-for="(report, index) in taskReports" :key="report.id" class="space-y-4 bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100/50 relative">
                  <!-- Round Indicator -->
                  <div class="absolute -top-3 -left-3 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white">
                      รอบการส่งที่ {{ taskReports.length - index }} 
                      <span class="opacity-75 font-normal ml-1">({{ formatDateFull(report.date) }})</span>
                  </div>

                  <div class="flex justify-between items-start mt-2">
                      <h5 class="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <i class="fas fa-file-alt"></i> ข้อมูลการส่งงานจากพนักงาน
                      </h5>
                      <!-- Progress Display -->
                      <div class="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-emerald-100 shadow-sm">
                         <div class="w-16 h-2 bg-emerald-100 rounded-full overflow-hidden">
                            <div class="h-full bg-emerald-500 rounded-full" :style="{ width: (report.progress || 0) + '%' }"></div>
                         </div>
                         <span class="text-[10px] font-black text-emerald-600">{{ report.progress || 0 }}%</span>
                      </div>
                  </div>

                  <div class="space-y-3">
                    <p class="text-[12px] font-bold text-slate-700 leading-relaxed italic">{{ report.description || report.content || report.text || report.title || 'ไม่ได้ระบุหมายเหตุการส่งงาน' }}</p>
                    
                    <div v-if="report.link" class="pt-2">
                      <a :href="report.link" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-emerald-200 text-emerald-600 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all">
                        <i class="fas fa-external-link-alt"></i> ลิงก์หลักฐานภายนอก
                      </a>
                    </div>

                    <!-- Attachments List -->
                    <div v-if="report.attachments && report.attachments.length > 0" class="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div v-for="(file, idx) in report.attachments" :key="idx" class="flex items-center gap-3 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                            <div class="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center text-xs shrink-0">
                                 <i class="fas fa-file-pdf" v-if="file.type?.includes('pdf')"></i>
                                 <i class="fas fa-image" v-else-if="file.type?.includes('image')"></i>
                                 <i class="fas fa-file" v-else></i>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-[10px] font-black text-slate-700 truncate">{{ file.name }}</p>
                                <p class="text-[8px] font-bold text-slate-400">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
                            </div>
                            <a v-if="file.url" :href="file.url" target="_blank" class="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                                <i class="fas fa-download text-[10px]"></i>
                            </a>
                        </div>
                    </div>
                  </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-slate-50 p-4 rounded-[1.5rem]">
                <p class="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Operator (ผู้รับผิดชอบ)</p>
                <p class="text-[14px] font-black text-slate-800 italic uppercase">{{ selectedTaskView.staffName || selectedTaskView.assignee || 'ยังไม่ระบุ' }}</p>
              </div>
              <div class="bg-rose-50 p-4 rounded-[1.5rem]">
                <p class="text-[10px] font-black text-rose-400 uppercase mb-1 tracking-widest">กำหนดส่ง (Deadline)</p>
                <p class="text-[14px] font-black text-rose-600 italic">{{ formatDate(selectedTaskView.deadline || selectedTaskView.dueDate || selectedTaskView.date) }}</p>
                <p v-if="selectedTaskView.createdAt" class="text-[10px] font-bold text-rose-300 mt-1">วันที่สร้าง: {{ formatDateFull(selectedTaskView.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6 text-left">
          <div v-if="userRole !== 'staff'" class="space-y-6">
            <button v-if="selectedTaskView.status !== 'completed'" @click="completeTask(selectedTaskView)" class="w-full py-8 bg-[#5c56f0] text-white rounded-[3rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 duration-200">
              <i class="fas" :class="taskReports.length > 0 ? 'fa-clipboard-check' : 'fa-check-circle'"></i> 
              {{ taskReports.length > 0 ? 'ตรวจสอบและยืนยันเสร็จสิ้น' : 'ทำเครื่องหมายว่าเสร็จสิ้น' }}
            </button>
            <div v-else class="space-y-4">
              <div class="w-full py-8 bg-emerald-100 text-emerald-600 rounded-[3rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 border-2 border-emerald-200 shadow-inner">
                  <i class="fas fa-flag-checkered"></i> ภารกิจเสร็จสมบูรณ์แล้ว
              </div>
              <button @click="reopenTask(selectedTaskView)" class="w-full py-4 text-slate-400 text-[10px] font-black uppercase hover:text-indigo-500 transition-colors flex items-center justify-center gap-2">
                  <i class="fas fa-undo-alt"></i> กลับไปแก้ไข / ยกเลิกการตรวจเสร็จสิ้น
              </button>
            </div>
            <button @click="deleteTask(selectedTaskView)" class="w-full py-8 bg-rose-50 text-rose-500 rounded-[3rem] font-black uppercase tracking-widest hover:bg-rose-100 transition-all">
              <i class="fas fa-trash-alt mr-3"></i> ยกเลิกภารกิจ
            </button>
          </div>

          <!-- Comments Section (Visible to everyone) -->
          <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-5 text-left flex flex-col min-h-[350px]">
            <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
              <i class="fas fa-comments text-[#5c56f0]"></i> พื้นที่พูดคุยและข้อเสนอแนะ
            </h3>
            
            <div class="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
              <div v-for="(comment, i) in selectedTaskView.comments" :key="i" class="bg-slate-50 p-4 rounded-2xl relative">
                <div class="flex justify-between items-center mb-1">
                    <p class="text-[10px] font-black text-[#5c56f0] uppercase italic">{{ comment.sender || comment.author || 'Unknown' }}</p>
                    <span class="text-[10px] font-bold text-slate-300">{{ (() => {
                        const d = new Date(comment.date || comment.createdAt);
                        if (isNaN(d.getTime())) return '-';
                        const day = String(d.getDate()).padStart(2, '0');
                        const month = String(d.getMonth() + 1).padStart(2, '0');
                        const year = d.getFullYear();
                        return `${day}/${month}/${year}`;
                    })() }}</span>
                </div>
                <p class="text-[12px] font-bold text-slate-700 leading-relaxed">{{ comment.text }}</p>
              </div>
              <div v-if="!selectedTaskView.comments?.length" class="h-full flex flex-col items-center justify-center opacity-30 italic">
                <i class="fas fa-comment-slash text-2xl mb-2"></i>
                <p class="text-[10px] font-black uppercase">ยังไม่มีข้อเสนอแนะ</p>
              </div>
            </div>

            <div class="space-y-3 pt-4 border-t border-slate-50">
              <textarea v-model="newComment" placeholder="พิมพ์ข้อแสดงความเห็นเพิ่มเติม..." 
                     class="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-5 py-4 text-[12px] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/30 transition-all resize-none h-24 placeholder:text-slate-300"></textarea>
              
              <div class="flex justify-center">
                <button @click="postComment" class="bg-[#5c56f0] text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100/50 hover:bg-indigo-600 hover:-translate-y-0.5 active:scale-90 transition-all">
                  <i class="fas fa-paper-plane text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-10">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button @click="emit('go-back')" class="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-all cursor-pointer z-10">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div>
            <h2 class="text-[16px] font-black text-slate-900 tracking-tighter uppercase italic leading-none">{{ selectedProject?.title || 'ยุทธศาสตร์ภารกิจ' }}</h2>
            <p class="text-slate-400 text-[12px] font-bold uppercase mt-2 tracking-widest italic">ศูนย์ควบคุมปฏิบัติการ | Project Manager</p>
          </div>
        </div>
        <div class="flex gap-4">
          <button v-if="(userRole === 'lead' || userRole === 'pm') && selectedProject?.status !== 'completed' && subTasks.length > 0 && completedSubTasksCount === subTasks.length" 
                  @click="completeProject" 
                  class="bg-emerald-500 text-white px-6 py-4 rounded-[2rem] text-[12px] font-black uppercase shadow-xl hover:bg-emerald-600 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2">
            <i class="fas fa-check-double"></i>
            ปิดโครงการ
          </button>

          <div v-if="selectedProject?.status === 'completed'" class="flex flex-col items-center">
             <div class="bg-emerald-100 text-emerald-600 px-6 py-4 rounded-[2rem] text-[12px] font-black uppercase shadow-inner flex items-center gap-2 cursor-default">
                <i class="fas fa-flag-checkered"></i> ภารกิจเสร็จสิ้น
             </div>
             <button @click="reopenProject" class="mt-2 text-[9px] font-black text-slate-300 uppercase hover:text-indigo-500 transition-colors">
                (คืนค่าโครงการเป็นกำลังดำเนินการ)
             </button>
          </div>

          <button v-if="userRole !== 'staff'" @click="showAssignModal = true" class="bg-[#5c56f0] text-white px-8 py-4 rounded-[2rem] text-[12px] font-black uppercase shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2">
            <i class="fas fa-user-plus"></i>
            แบ่งงานให้กำลังพล
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mt-12 text-left">
        <div class="lg:col-span-3 space-y-5 text-left">
          <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 text-left">
            <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
              <i class="fas fa-info-circle text-[#5c56f0]"></i> สรุปโครงการ
            </h3>
            
            <div class="space-y-2 mb-4">
              <p class="text-[13px] font-bold text-slate-600 leading-relaxed italic">{{ selectedProject?.desc || selectedProject?.description || selectedProject?.content || 'ไม่มีข้อมูลรายละเอียดโครงการ' }}</p>
            </div>

            <div class="space-y-2 pt-4 border-t border-slate-50">
              <div class="flex items-center gap-2">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest min-w-[50px]">ความยากง่าย</p>
                <div class="flex items-center gap-1">
                    <i v-for="n in 5" :key="n" :class="['fas fa-star text-[10px]', n <= (selectedProject?.difficulty || 3) ? 'text-amber-400' : 'text-slate-100']"></i>
                    <span class="text-[10px] font-black text-slate-400 ml-1">{{ selectedProject?.difficulty || 3 }}/5</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest min-w-[50px]">กำหนดส่ง</p>
                <p class="text-sm font-black text-rose-600 tracking-tighter whitespace-nowrap">{{ formatThaiDateShort(selectedProject?.deadline || selectedProject?.dueDate || selectedProject?.date) }}</p>
              </div>
              <div v-if="selectedProject?.createdAt" class="flex items-start gap-2">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest min-w-[50px] pt-1">วันที่สร้าง</p>
                <div class="flex flex-col">
                    <p class="text-[10px] font-bold text-slate-500 tracking-tight whitespace-nowrap">{{ formatThaiDateLong(selectedProject?.createdAt) }}</p>
                    <p class="text-[10px] font-bold text-slate-500 tracking-tight mt-0.5">เวลา {{ formatThaiTime(selectedProject?.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-6 space-y-6 text-left">
          <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3 text-left">
            <i class="fas fa-tasks text-[#5c56f0]"></i> รายการภารกิจที่มอบหมาย
          </h3>

          <div v-if="subTasks.length > 0" class="grid grid-cols-1 gap-4 text-left">
            <div v-for="(task, index) in subTasks" :key="index" 
                 @click="openTaskView(task)"
                 :class="['group bg-white p-4 px-6 rounded-[2rem] border transition-all duration-500 animate-pop cursor-pointer text-left relative overflow-hidden',
                   String(task.id || task._id) === String(targetTaskId) 
                   ? 'border-purple-500 shadow-xl shadow-purple-100 bg-purple-50/30' 
                   : 'border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100'
                 ]">
              
              <div class="absolute top-4 right-6 flex items-center gap-3">
                  <!-- Quick Delete Button (Lead/PM only) -->
                  <button v-if="userRole !== 'staff'" 
                          @click.stop="deleteTask(task)"
                          class="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white flex items-center justify-center border border-rose-100 shadow-sm z-20">
                      <i class="fas fa-trash-alt text-[10px]"></i>
                  </button>

                  <!-- Due Badge -->
                  <div v-if="task.deadline" class="flex flex-col items-end">
                      <span class="text-[7px] font-black text-slate-300 uppercase tracking-[0.2em] mb-0.5">กำหนดส่ง</span>
                      <span class="text-[10px] font-black text-rose-500 uppercase italic tracking-tighter bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                        {{ formatThaiDateShort(task.deadline || task.dueDate || task.date) }}
                      </span>
                  </div>
              </div>

              <div class="flex flex-col gap-2.5">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-500">
                    <i class="fas fa-rocket text-sm"></i>
                  </div>
                  <div class="space-y-0 text-left flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-0.5">
                      <h4 class="font-black text-slate-900 uppercase italic tracking-tighter text-[13px] leading-none group-hover:text-indigo-600 transition-colors truncate">{{ task.title }}</h4>
                      <span v-if="task.priority" :class="['text-[7px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest border', 
                        task.priority === 'urgent' ? 'bg-rose-50 text-rose-500 border-rose-100' : 
                        task.priority === 'medium' ? 'bg-amber-50 text-amber-500 border-amber-100' : 
                        'bg-indigo-50 text-indigo-500 border-indigo-100']">
                        {{ task.priority === 'urgent' ? 'เร่งด่วน' : task.priority === 'medium' ? 'ปานกลาง' : 'ปกติ' }}
                      </span>
                    </div>
                    <p class="text-slate-400 text-[8px] font-black uppercase tracking-widest italic">จุดภารกิจ</p>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-3 border-t border-slate-50 mt-0.5">
                  <div class="flex items-center gap-3">
                    <div class="space-y-0">
                       <p class="text-[7px] font-black text-slate-300 uppercase tracking-[0.2em]">มอบหมายให้</p>
                       <p class="text-[11px] font-black text-slate-700 uppercase italic tracking-tight">{{ task.staffName || task.assignee }}</p>
                    </div>
                    <div class="w-7 h-7 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100">
                      <img :src="`https://api.dicebear.com/9.x/avataaars/svg?seed=${task.staffName || task.assignee}`" class="w-full h-full object-cover">
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <!-- Edit Requested Badge -->
                    <div v-if="task.editRequested === true || task.editRequested === 'true'" 
                         class="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[9px] font-black uppercase italic tracking-tighter border border-amber-100 flex items-center gap-1 animate-pulse shadow-sm">
                        <i class="fas fa-exclamation-circle text-[8px]"></i> 
                        ป้ายขอแก้งาน
                    </div>

                    <div class="w-7 h-7 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all shadow-sm">
                      <i v-if="task.status === 'completed'" class="fas fa-check-circle text-emerald-500 scale-110"></i>
                      <i v-else-if="task.status === 'review'" class="fas fa-clock text-amber-500 animate-pulse"></i>
                      <i v-else class="fas fa-arrow-right text-[10px]"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="w-full aspect-[16/6] rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-12 bg-slate-50/30 text-center">
            <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <i class="fas fa-rocket text-3xl text-slate-100"></i>
            </div>
            <p class="text-slate-300 font-black italic uppercase tracking-widest text-lg">พร้อมสำหรับการมอบหมายภารกิจ</p>
          </div>
        </div>

        <div class="lg:col-span-3 space-y-4 text-left">
          <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 text-left">สถิติปฏิบัติการด่วน</h3>
          <div class="bg-[#121926] p-6 rounded-[2rem] shadow-2xl min-h-[180px] flex flex-col justify-between text-left">
            <div>
                 <h5 class="text-indigo-300 font-black italic uppercase tracking-widest text-[9px] text-left">
                    {{ selectedProject?.status === 'completed' ? 'ภารกิจที่สำเร็จสมบูรณ์' : 'จำนวนงานที่มอบหมาย' }}
                 </h5>
                <p class="text-5xl font-black text-white italic tracking-tighter text-left mt-1">
                    {{ selectedProject?.status === 'completed' ? completedSubTasksCount : subTasks.length }}
                    <span v-if="selectedProject?.status === 'completed'" class="text-lg text-slate-500">/ {{ subTasks.length }}</span>
                </p>
            </div>
            
            <div class="space-y-3 mt-6">
                 <div class="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div class="h-full transition-all duration-1000 ease-out" 
                        :class="selectedProject?.status === 'completed' ? 'bg-emerald-500' : 'bg-[#5c56f0]'"
                        :style="{ width: (subTasks.length > 0 ? averageProgress : 0) + '%' }"></div>
                 </div>
                 <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">
                    {{ selectedProject?.status === 'completed' ? 'Mission Accomplished' : 'ตัวชี้วัดความคืบหน้าภารกิจ (' + averageProgress + '%)' }}
                 </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="#modal-target">
      <transition name="modal-fade">
        <div v-if="showAssignModal" 
             class="absolute inset-0 z-[1000] flex justify-center items-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div class="bg-white w-full max-w-md rounded-[2.5rem] p-6 sm:p-8 shadow-[0_40px_120px_rgba(0,0,0,0.6)] animate-pop flex flex-col max-h-[90vh] overflow-hidden text-left relative mx-auto">
            <header class="mb-4 text-left shrink-0">
              <h3 class="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">มอบหมายงาน</h3>
              <p class="text-indigo-500 text-[9px] font-black uppercase mt-1 tracking-widest italic">ศูนย์กระจายงาน</p>
            </header>
  
            <div class="space-y-4 text-left flex-1 overflow-y-auto custom-scrollbar pr-2 py-2 text-left">
              <div class="space-y-1 text-left">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left">หัวข้อภารกิจ</label>
                <input v-model="newTask.title" type="text" placeholder="ระบุภารกิจ..." class="w-full px-7 py-3.5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none font-bold text-[14px] text-slate-900 placeholder:text-slate-300 focus:border-indigo-500/30 transition-all text-left">
              </div>
  
              <div class="space-y-1 text-left">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">รายละเอียดปฏิบัติงาน</label>
                <textarea v-model="newTask.description" rows="2" placeholder="รายละเอียด..." 
                          class="w-full px-7 py-3.5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none font-bold text-[14px] text-slate-900 placeholder:text-slate-300 resize-none focus:border-indigo-500/30 transition-all text-left"></textarea>
              </div>
  
              <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">เลือกกำลังพล</label>
                  <div class="relative">
                    <select v-model="newTask.staffId" class="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none font-bold text-slate-700 appearance-none cursor-pointer focus:border-indigo-500/30 transition-all">
                      <option value="">เลือกพนักงาน</option>
                      <option v-for="staff in filteredStaff" :key="staff.staffId || staff.id" :value="staff.staffId || staff.id">
                        {{ staff.name }} {{ (staff.position || staff.role) ? `(${staff.position || staff.role})` : '' }}
                      </option>
                    </select>
                    <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <i class="fas fa-chevron-down text-[10px]"></i>
                    </div>
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">ความเร่งด่วน</label>
                  <div class="flex gap-2 p-1 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                    <button v-for="p in ['urgent', 'medium', 'normal']" :key="p" 
                      @click="newTask.priority = p"
                      :class="['flex-1 py-1.5 rounded-[1.2rem] text-[9px] font-black uppercase transition-all', 
                      newTask.priority === p ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400']">
                      {{ p === 'urgent' ? 'ด่วน' : p === 'medium' ? 'ปกติ' : 'ต่ำ' }}
                    </button>
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-slate-400 uppercase ml-5 tracking-widest">กำหนดส่ง (Deadline)</label>
                  <input v-model="newTask.deadline" type="date" placeholder="ระบุ วัน/เดือน/ปี" class="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none font-bold text-slate-700 cursor-pointer focus:border-indigo-500/30 transition-all">
                </div>
              </div>
            </div>
  
            <div class="grid grid-cols-2 gap-4 mt-8 shrink-0">
              <button @click="assignTask" class="bg-[#5c56f0] text-white py-4 rounded-[1.5rem] font-black uppercase tracking-[0.2em] italic text-[14px] shadow-lg shadow-indigo-100 hover:bg-indigo-600 hover:-translate-y-1 transition-all active:scale-95">ยืนยัน</button>
              <button @click="showAssignModal = false" class="bg-slate-50 text-slate-400 py-4 rounded-[1.5rem] font-black uppercase tracking-[0.2em] italic text-[14px] hover:bg-slate-100 transition-all">ยกเลิก</button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import api from '@/api'
import { formatDate, formatDateFull, formatThaiDateShort, formatThaiDateLong, formatThaiTime } from '@/utils/date'

const props = defineProps({ 
  allStaff: Array,
  selectedProject: Object,
  userRole: String,
  targetTaskId: [String, Number]
})
const emit = defineEmits(['go-back', 'notify', 'update-project']) 

// State Management
const showAssignModal = ref(false)
const selectedTaskView = ref(null) 
const taskReports = ref([])
const subTasks = ref([]) 
const newComment = ref('')

const filteredStaff = computed(() => {
    if (!props.allStaff) return []
    const available = props.allStaff.filter(s => {
        const role = (s.role || '').toLowerCase()
        return role !== 'lead' && role !== 'pm' && role !== 'manager'
    })
    const nameMap = new Map()
    available.forEach(s => {
        if (!nameMap.has(s.name) || (s.position && !nameMap.get(s.name).position)) {
            nameMap.set(s.name, s)
        }
    })
    return Array.from(nameMap.values()).sort((a, b) => (a.name || '').localeCompare(b.name || ''))
})

const completedSubTasksCount = computed(() => {
    return subTasks.value.filter(t => t.status === 'completed').length
})

const averageProgress = computed(() => {
    if (subTasks.value.length === 0) return 0
    const total = subTasks.value.reduce((sum, task) => sum + (Number(task.progress) || 0), 0)
    return Math.round(total / subTasks.value.length)
})

const openTaskView = async (task) => {
  if (!task || (!task.id && !task._id)) return;
  selectedTaskView.value = task
  taskReports.value = []
  try {
    const taskId = task.id || task._id;
    const [reports, freshTask] = await Promise.all([
        api.getReports({ missionId: taskId }),
        api.getMissionById(taskId)
    ])
    if (freshTask) selectedTaskView.value = freshTask
    if (reports && reports.length > 0) taskReports.value = reports 
  } catch (e) {
    console.error("Failed to fetch task details", e)
  }
}

const closeTaskView = () => {
  selectedTaskView.value = null
  taskReports.value = []
}

const newTask = reactive({ title: '', description: '', staffId: '', deadline: '', priority: 'normal' })

const fetchSubTasks = async () => {
  if (!props.selectedProject?.id) return
  try {
    const data = await api.getTasks('task', { projectId: props.selectedProject.id })
    if (data) {
        subTasks.value = data;
        // Auto-open removed per user request: Land on the list first.
    }
  } catch (e) {
    console.error("Failed to fetch subtasks", e)
  }
}

onMounted(() => {
  fetchSubTasks()
})

watch(() => props.selectedProject?.id, () => {
  fetchSubTasks()
})

watch(averageProgress, (newVal) => {
  if (props.selectedProject && props.selectedProject.status !== 'completed' && subTasks.value.length > 0) {
    emit('update-project', props.selectedProject.id, { progress: newVal })
  }
})

const assignTask = async () => {
  if (newTask.title && newTask.staffId) {
    try {
        console.log('[PM-ASSIGN] Looking for staffId:', newTask.staffId, 'in pool of', props.allStaff?.length)
        const staff = props.allStaff.find(s => String(s.staffId || s.id) === String(newTask.staffId))
        console.log('[PM-ASSIGN] Staff found:', staff ? staff.name : 'NULL')
        const staffNameValue = staff ? (staff.name || staff.staffId) : 'ไม่พบรายชื่อพนักงาน'
        const taskData = {
          ...JSON.parse(JSON.stringify(newTask)),
          projectId: props.selectedProject.id,
          dept: props.selectedProject.dept,
          type: 'task',
          staffName: staffNameValue,
          staffId: staff ? staff.staffId : null,
          assignee: staffNameValue
        }
        const response = await api.createTask(taskData)
        if (response) {
            emit('notify', `Deploy ภารกิจ "${newTask.title}" สำเร็จ!`)
            await fetchSubTasks()
            Object.keys(newTask).forEach(key => newTask[key] = '')
            showAssignModal.value = false
        }
    } catch (e) {
        console.error("Error assigning task", e)
    }
  }
}

const deleteTask = async (task) => {
  if(confirm('ยืนยันการยกเลิกภารกิจนี้ใช่หรือไม่?')) {
    try {
        await api.deleteTask(task.id)
        emit('notify', `ยกเลิกภารกิจ "${task.title}" เรียบร้อยแล้ว`)
        await fetchSubTasks()
        selectedTaskView.value = null
    } catch (e) {
        console.error("Error deleting task", e)
    }
  }
}

const completeTask = async (task) => {
  task.status = 'completed'
  task.progress = 100
  try {
      await api.updateTask(task.id, { status: 'completed', progress: 100 })
      emit('notify', `ภารกิจ "${task.title}" ได้รับการยืนยันเสร็จสิ้น!`)
      await emit('refresh')
      setTimeout(async () => {
        await fetchSubTasks()
        await emit('refresh')
        selectedTaskView.value = null
      }, 500)
  } catch (e) {
      console.error("Error completing task", e)
  }
}

const reopenTask = async (task) => {
  if (confirm('ยืนยันที่จะยกเลิกสถานะเสร็จสมบูรณ์ และกลับไปเป็น "กำลังปฏิบัติงาน" หรือไม่?')) {
    try {
      await api.updateTask(task.id, { status: 'active', progress: 99 })
      emit('notify', 'ข้อมูลถูกย้อนกลับแล้ว สามารถตรวจสอบต่อได้ครับ')
      fetchSubTasks()
    } catch (e) {
      console.error("Error reopening task", e)
    }
  }
}

const postComment = async () => {
  if (!newComment.value.trim() || !selectedTaskView.value) return
  
  const senderName = localStorage.getItem('userName') || (props.userRole === 'staff' ? 'Operator' : 'Project Manager')
  
  try {
    const taskId = selectedTaskView.value.id || selectedTaskView.value._id
    const response = await api.addComment(taskId, newComment.value, senderName)
    
    if (response && response.comments) {
        selectedTaskView.value.comments = response.comments
    } else {
        const newCommentObj = {
            sender: senderName,
            text: newComment.value,
            createdAt: new Date().toISOString()
        }
        selectedTaskView.value.comments = [...(selectedTaskView.value.comments || []), newCommentObj]
    }
    
    newComment.value = ''
    emit('notify', 'เพิ่มความเห็นในภารกิจเรียบร้อยแล้ว!')
  } catch (e) {
    console.error("Failed to post comment", e)
    emit('notify', 'ไม่สามารถบันทึกความคิดเห็นได้')
  }
}

const completeProject = () => {
  if(confirm('ยืนยันที่จะปิดโครงการนี้และบันทึกเป็น "เสร็จสิ้น" หรือไม่?')) {
      emit('update-project', props.selectedProject.id, { status: 'completed', progress: 100 })
      emit('notify', 'Mission Accomplished!')
  }
}

const reopenProject = () => {
  if (confirm('ยืนยันที่จะเปิดโครงการนี้ใหม่เพื่อแก้ไขงาน หรือไม่?')) {
    emit('update-project', props.selectedProject.id, { status: 'active' })
    emit('notify', 'เปิดโครงการใหม่อีกครั้งแล้ว')
  }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-pop { animation: pop 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67); }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.4s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
h1, h2, h3, h4, h5, p, span, label, input, select, textarea {
  font-family: 'LINE Seed Sans TH', sans-serif;
}
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
