<template>
  <div class="space-y-8 animate-fade-up text-left">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none text-left">ตัวชี้วัดประสิทธิภาพแผนก</h2>
        <p class="text-slate-400 text-[10px] font-bold uppercase mt-2 tracking-[0.2em] text-left">ภาพรวมผลการดำเนินงานและการจัดการบุคลากร (ทั้งหมด: {{ allStaff.length }})</p>
      </div>
      
      <button 
        v-if="['lead', 'manager'].includes(userRole)"
        @click="generateNewStaff"
        class="bg-[#5c56f0] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
      >
        <i class="fas fa-plus"></i>
        <span>{{ userRole === 'manager' ? 'เพิ่มหัวหน้าทีมใหม่' : 'เพิ่มพนักงานใหม่' }}</span>
      </button>
    </div>

    <div>
      <!-- Manager View: Department Cards & Detail -->
      <template v-if="userRole === 'manager'">
        
        <!-- Level 1: Department Grid -->
        <div v-if="!selectedDepartment" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div v-for="dept in departmentStats" :key="dept.id" @click="selectedDepartment = dept"
            class="bg-white p-4 rounded-2xl border border-slate-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col items-start text-left space-y-2 group relative overflow-hidden cursor-pointer"
          >
             <div class="absolute top-2 right-2 transition-opacity">
                <!-- Custom 2-part Pie Chart SVG -->
                <svg width="64" height="64" viewBox="0 0 100 100">
                   <!-- Background Circle (Full) -->
                   <circle cx="50" cy="50" r="45" fill="currentColor" :class="dept.colorSub" />
                   <!-- Main Slice (KPI) -->
                   <path :d="getPieSlice(dept.kpi)" fill="currentColor" :class="dept.colorMain" stroke="white" stroke-width="2" stroke-linejoin="round" />
                </svg>
                
                <!-- 🎯 Labels Inside Slices (on Hover) -->
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                   <!-- Label 1: Efficiency (Top Right) -->
                   <div class="absolute top-5 right-1 z-10 text-center">
                      <span class="text-[9px] font-black text-white drop-shadow-md">{{ dept.kpi }}%</span>
                   </div>

                   <!-- Label 2: Missing (Top Left) -->
                   <div class="absolute top-5 left-1 z-10 text-center">
                      <span class="text-[8px] font-bold text-slate-600">{{ 100 - dept.kpi }}%</span>
                   </div>
                </div>
             </div>

             <div class="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-lg font-black text-slate-800 shadow-inner mb-1 z-10">
                {{ dept.code }}
             </div>

             <div class="z-10 relative">
                <!-- 🎯 Name removed -->
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">หัวหน้า: {{ dept.head }}</p>
             </div>

             <div class="w-full grid grid-cols-2 gap-2 mt-2 border-t border-slate-50 pt-4">
                <div class="text-center">
                   <p class="text-2xl font-black text-emerald-500 tracking-tighter">{{ dept.kpi }}%</p>
                   <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">ประสิทธิภาพ</p>
                </div>
                <div class="text-center border-l border-slate-50">
                   <p class="text-2xl font-black text-slate-800 tracking-tighter">{{ dept.staffCount }}</p>
                   <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">สมาชิก</p>
                </div>
             </div>

             <div class="w-full mt-1">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[9px] font-bold text-emerald-600">
                   <i class="fas fa-tasks"></i> {{ dept.trend }} งาน
                </span>
             </div>
          </div>
        </div>

        <!-- Level 2: Department Detail -->
        <div v-else class="space-y-8 animate-fade-up">
           <div class="flex items-center gap-3">
              <button @click="selectedDepartment = null" class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-400 transition-all text-xs">
                 <i class="fas fa-arrow-left"></i>
              </button>
              <div>
                 <h3 class="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{{ selectedDepartment.name }}</h3>
                 <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ประสิทธิภาพแผนกและบุคลากร</p>
              </div>
           </div>


           
           <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div v-for="staff in departmentStaff" :key="staff.id" @click="openKPIDetailModal(staff)"
                class="bg-white p-3 rounded-2xl border border-slate-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col items-center text-center space-y-2 group relative overflow-hidden cursor-pointer"
              >
                <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative">
                  <div class="w-12 h-12 rounded-full bg-slate-50 p-0.5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.staffId}`" class="w-full h-full rounded-full">
                  </div>
                  <div class="absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full flex items-center justify-center bg-white" 
                    :class="staff.name ? 'text-emerald-500' : 'text-slate-300'">
                     <i class="fas fa-check-circle text-[10px]"></i>
                  </div>
                  <!-- 🌐 Real Website Link Badge (Manager View) -->
                  <a v-if="staff.profile_url" :href="staff.profile_url" target="_blank" class="absolute -top-1 -left-1 w-6 h-6 bg-indigo-500 text-white rounded-lg flex items-center justify-center text-[10px] shadow-lg animate-bounce z-10 transition-transform hover:scale-125">
                    <i class="fas fa-external-link-alt"></i>
                  </a>
                </div>
                <div class="space-y-0.5">
                  <h3 class="text-sm font-black text-slate-900 tracking-tight leading-tight">{{ staff.name || 'รอติดตั้งระบบ' }}</h3>
                  <p class="text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded inline-block">{{ staff.staffId }}</p>
                </div>
                <div class="w-full pt-2 border-t border-slate-50 mt-1">
                   <div class="flex justify-between items-start gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                     <div class="flex flex-col flex-1 min-w-0">
                       <span class="text-[10px] text-slate-800 whitespace-nowrap">{{ staff.position || (staff.role === 'staff' ? 'เจ้าหน้าที่ปฏิบัติการ' : staff.role) }}</span>
                       <span class="text-[7px] mt-0.5">หน้าที่</span>
                     </div>
                     <div class="flex flex-col border-l border-slate-100 pl-1 shrink-0">
                       <span class="text-[10px] text-emerald-500">{{ staff.performance }}%</span>
                       <span class="text-[7px] mt-0.5">KPI</span>
                     </div>
                   </div>
                   <button v-if="!staff.name" class="w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all bg-[#5c56f0] text-white hover:bg-indigo-600 shadow-lg shadow-indigo-200">สร้างบัญชี</button>
                    <a v-if="staff.profile_url" :href="staff.profile_url" target="_blank" class="w-full mt-2 py-3 bg-[#121926] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg">
                      <i class="fas fa-globe"></i> ดูโปรไฟล์จริง
                    </a>
                </div>
              </div>

               <div v-if="departmentStaff.length === 0" class="col-span-full py-20 text-center space-y-4 border-2 border-dashed border-slate-200 rounded-[3rem]">
                <i class="fas fa-users-slash text-5xl text-slate-300"></i>
                <p class="text-slate-400 font-bold uppercase text-xs tracking-widest">ไม่พบพนักงานในแผนกนี้</p>
              </div>
           </div>
        </div>
      </template>

      <!-- Staff/Lead/PM View: Staff Cards -->
      <template v-else>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="staff in filteredAllStaff" :key="staff.id" @click="userRole === 'manager' ? openKPIDetailModal(staff) : null"
        class="bg-white p-3 rounded-2xl border border-slate-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col items-center text-center space-y-2 group relative overflow-hidden"
        :class="userRole === 'manager' ? 'cursor-pointer' : ''"
      >
        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <!-- Action Buttons -->
        <div class="absolute top-3 right-3 flex gap-2 z-20">
          <button 
            v-if="userRole === 'manager' || userRole === 'lead'"
            @click.stop="openEditModal(staff)" 
            class="w-6 h-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm border border-slate-100 text-indigo-400 hover:text-indigo-600 hover:scale-110 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <i class="fas fa-edit text-[10px]"></i>
          </button>
          <button 
            v-if="userRole === 'manager' || userRole === 'lead'"
            @click.stop="removeStaff(staff)" 
            class="w-6 h-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm border border-slate-100 text-slate-300 hover:text-rose-500 hover:scale-110 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <i class="fas fa-trash-alt text-[10px]"></i>
          </button>
        </div>
        
        <div class="relative">
          <div class="w-12 h-12 rounded-full bg-slate-50 p-0.5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
            <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.staffId}`" class="w-full h-full rounded-full">
          </div>
          <div class="absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full flex items-center justify-center bg-white" 
            :class="staff.name ? 'text-emerald-500' : 'text-slate-300'">
             <i class="fas fa-check-circle text-[10px]"></i>
          </div>
          <!-- 🌐 Real Website Link Badge -->
          <a v-if="staff.profile_url" :href="staff.profile_url" target="_blank" class="absolute -top-1 -left-1 w-6 h-6 bg-indigo-500 text-white rounded-lg flex items-center justify-center text-[10px] shadow-lg animate-bounce z-10 transition-transform hover:scale-125">
            <i class="fas fa-external-link-alt"></i>
          </a>
        </div>

        <div class="space-y-0.5">
          <h3 class="text-sm font-black text-slate-900 tracking-tight leading-tight">
            {{ staff.name || 'รอติดตั้งระบบ' }}
          </h3>
          <p class="text-[9px] font-black text-[#5c56f0] uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded inline-block">
            {{ staff.staffId }}
          </p>
        </div>

        <div class="w-full pt-2 border-t border-slate-50 mt-1.5">
           <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2"
                :class="userRole === 'staff' ? 'text-center' : 'flex justify-between items-start gap-2'">
             <div class="flex flex-col" :class="userRole !== 'staff' ? 'flex-1 min-w-0' : ''">
               <span class="text-[11px] text-slate-800 whitespace-nowrap font-black uppercase tracking-tight">
                 {{ staff.position || (staff.role === 'staff' ? 'เจ้าหน้าที่ปฏิบัติการ' : staff.role) }}
               </span>
               <span class="text-[8px] mt-0.5 uppercase tracking-[0.2em] font-black text-slate-400">หน้าที่</span>
             </div>
             <div v-if="userRole === 'manager'" class="flex flex-col border-l border-slate-100 pl-2 shrink-0">
               <span class="text-xs text-emerald-500">{{ staff.performance }}%</span>
               <span class="text-[8px] mt-0.5">KPI</span>
             </div>
           </div>

           <button 
             v-if="userRole !== 'staff' && !staff.name"
             @click="handleCardAction(staff)"
             class="w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
             :class="getActivationFor(staff.staffId) ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200' : 'bg-[#5c56f0] text-white hover:bg-indigo-600 shadow-indigo-200'"
           >
             {{ getActivationFor(staff.staffId) ? 'อนุมัติและเปิดใช้งาน' : 'สร้างบัญชี' }}
           </button>

           <a v-if="staff.profile_url" :href="staff.profile_url" target="_blank" class="w-full mt-2 py-3 bg-[#121926] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg">
             <i class="fas fa-globe"></i> เข้าชมเว็บไซต์จริง
           </a>
        </div>
      </div>
        </div>
      </template>

      <!-- Empty State Card -->
      <div v-if="allStaff.length === 0" class="col-span-full py-20 text-center space-y-4 border-2 border-dashed border-slate-200 rounded-[3rem]">
        <i class="fas fa-users-slash text-5xl text-slate-300"></i>
        <p class="text-slate-400 font-bold uppercase text-xs tracking-widest">ยังไม่มีข้อมูลพนักงานในระบบ</p>
      </div>
    </div>
    <!-- Credential Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showCredentialModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
          <div class="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-pop text-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

            <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 text-2xl shadow-lg shadow-emerald-100">
               <i class="fas fa-check"></i>
            </div>

            <h3 class="text-2xl font-black text-slate-800 tracking-tight mb-2">สร้างบัญชีใหม่เรียบร้อยแล้ว!</h3>
            <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">พร้อมสำหรับการตั้งค่าพนักงานใหม่</p>

            <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6 space-y-4 relative overflow-hidden">
               <div class="flex justify-between items-center border-b border-slate-200 pb-4">
                   <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">รหัสพนักงาน</span>
                   <span class="text-lg font-black text-slate-800 tracking-widest">{{ newCredentials.id }}</span>
               </div>
               <div class="flex justify-between items-center">
                   <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">รหัสผ่านชั่วคราว</span>
                   <span class="text-lg font-black text-indigo-500 tracking-widest">{{ newCredentials.password }}</span>
               </div>
            </div>

            <div class="flex items-start gap-3 bg-amber-50 p-4 rounded-xl text-left mb-8 border border-amber-100">
               <i class="fas fa-exclamation-triangle text-amber-500 mt-0.5"></i>
               <p class="text-[10px] text-amber-700 font-bold leading-relaxed">
                 โปรดจดบันทึกและแจ้งพนักงานทันที! <br> รหัสผ่านนี้จะแสดงเพียงครั้งเดียว
               </p>
            </div>

            <button @click="showCredentialModal = false" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
               ปิดและดำเนินการต่อ
            </button>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Staff Edit Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showEditModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
          <div class="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-pop text-left relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>

            <h3 class="text-2xl font-black text-slate-800 tracking-tight mb-2 italic">แก้ไขข้อมูลพนักงาน</h3>
            <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">จัดการข้อมูลพนักงาน (ID: {{ editingStaff.staffId }})</p>

            <div class="space-y-6 mb-8 text-left">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">ชื่อ-นามสกุล (Full Name)</label>
                <input v-model="editingStaff.name" type="text" class="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-indigo-300 transition-all">
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">ตำแหน่ง / หน้าที่ (Position)</label>
                <input v-model="editingStaff.position" type="text" placeholder="เช่น Backend Developer, Security Engineer" class="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-indigo-300 transition-all">
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">บทบาทในระบบ (System Role)</label>
                <select v-model="editingStaff.role" class="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-indigo-300 transition-all appearance-none cursor-pointer">
                  <option value="lead">Lead / Supervisor</option>
                  <option value="pm">Project Manager (PM)</option>
                  <option value="staff">Staff / Operator</option>
                </select>
              </div>

              <!-- 🎯 Field for Real Website Link -->
              <div class="space-y-2">
                <label class="text-[10px] font-black text-[#5c56f0] uppercase ml-4 tracking-widest flex items-center gap-2">
                  <i class="fas fa-link"></i> ลิงก์เว็บไซต์จริง (Portfolio / Social / Pass Link)
                </label>
                <input v-model="editingStaff.profile_url" type="url" placeholder="https://www.google.com/search?q=..." class="w-full px-6 py-4 bg-slate-50 border-2 border-indigo-100 rounded-2xl font-bold outline-none focus:border-indigo-400 text-indigo-600 placeholder:text-slate-300 transition-all">
                <p class="text-[8px] text-slate-400 ml-4 italic font-bold">* ใส่ URL จริงเพื่อเชื่อมโยงโปรไฟล์นี้กับเว็บไซต์ภายนอก</p>
              </div>
            </div>

            <div class="flex gap-4">
              <button @click="saveStaffEdit" class="flex-1 py-4 bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 shadow-xl shadow-indigo-100 transition-all">
                บันทึกการแก้ไข
              </button>
              <button @click="showEditModal = false" class="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Approval Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showApprovalModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
          <div class="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-pop text-left relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 bg-[#5c56f0]"></div>

            <div class="flex items-center gap-4 mb-8">
              <div class="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRequest.staffId}`" class="w-full h-full rounded-full">
              </div>
              <div>
                <h3 class="text-xl font-black text-slate-800 tracking-tight">{{ selectedRequest.name }}</h3>
                <p class="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">{{ selectedRequest.staffId }}</p>
              </div>
            </div>

            <div class="space-y-4 mb-8">
              <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">บทบาทที่ขอ</span>
                <span class="text-xs font-black text-slate-800 uppercase">{{ selectedRequest.role }}</span>
              </div>
              <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">แผนก</span>
                <span class="text-xs font-black text-slate-800 uppercase">{{ selectedRequest.dept }}</span>
              </div>
                <div v-if="selectedRequest.position" class="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex justify-between items-center">
                    <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Duty / หน้าที่</span>
                    <span class="text-xs font-black text-emerald-700 uppercase italic">{{ selectedRequest.position }}</span>
                </div>
            </div>

            <div class="flex gap-4">
              <button @click="approve(selectedRequest)" class="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 shadow-xl shadow-emerald-100 transition-all">
                อนุมัติ
              </button>
              <button @click="reject(selectedRequest)" class="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">
                ปฏิเสธ
              </button>
            </div>
            
            <button @click="showApprovalModal = false" class="w-full mt-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] hover:text-slate-500 transition-colors">
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </transition>
    </Teleport>


    <!-- KPI Detail Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showKPIModal && selectedStaffKPI" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
          <div class="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl animate-pop text-left relative overflow-hidden">
             <!-- Header Gradient -->
             <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"></div>

             <div class="flex justify-between items-start mb-8">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-full bg-slate-50 p-1 shadow-inner">
                    <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStaffKPI.staffId}`" class="w-full h-full rounded-full">
                  </div>
                  <div>
                    <h3 class="text-2xl font-black text-slate-800 tracking-tighter">{{ selectedStaffKPI.name || 'N/A' }}</h3>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ selectedStaffKPI.position || selectedStaffKPI.role }} • {{ selectedStaffKPI.staffId }}</p>
                  </div>
                </div>
                <div class="text-right">
                   <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">คะแนน KPI รวม</p>
                   <div class="text-4xl font-black text-emerald-500 tracking-tighter leading-none">{{ selectedStaffKPI.details.total }}%</div>
                </div>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- 1. On-Time -->
                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <div class="flex justify-between items-end mb-2">
                       <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">การส่งงานตรงเวลา (On-Time)</span>
                      <span class="text-sm font-black text-slate-800">{{ selectedStaffKPI.details.onTimeScore.toFixed(1) }} <span class="text-[10px] text-slate-400">/ 35</span></span>
                   </div>
                   <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div class="bg-indigo-500 h-full rounded-full transition-all duration-1000" :style="`width: ${(selectedStaffKPI.details.onTimeScore / 35) * 100}%`"></div>
                   </div>
                </div>

                <!-- 2. Quality -->
                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <div class="flex justify-between items-end mb-2">
                       <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">คุณภาพของงาน (Quality)</span>
                      <span class="text-sm font-black text-slate-800">{{ selectedStaffKPI.details.qualityScore.toFixed(1) }} <span class="text-[10px] text-slate-400">/ 25</span></span>
                   </div>
                   <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div class="bg-pink-500 h-full rounded-full transition-all duration-1000" :style="`width: ${(selectedStaffKPI.details.qualityScore / 25) * 100}%`"></div>
                   </div>
                </div>

                <!-- 3. Revision -->
                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <div class="flex justify-between items-end mb-2">
                       <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">อัตราการแก้ไขงาน (Revision)</span>
                      <span class="text-sm font-black text-slate-800">{{ selectedStaffKPI.details.issueScore.toFixed(1) }} <span class="text-[10px] text-slate-400">/ 15</span></span>
                   </div>
                   <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div class="bg-amber-500 h-full rounded-full transition-all duration-1000" :style="`width: ${(selectedStaffKPI.details.issueScore / 15) * 100}%`"></div>
                   </div>
                </div>

                <!-- 4. Difficulty -->
                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <div class="flex justify-between items-end mb-2">
                       <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ความยากของงาน (Difficulty)</span>
                      <span class="text-sm font-black text-slate-800">{{ selectedStaffKPI.details.difficultyScore.toFixed(1) }} <span class="text-[10px] text-slate-400">/ 15</span></span>
                   </div>
                   <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div class="bg-cyan-500 h-full rounded-full transition-all duration-1000" :style="`width: ${(selectedStaffKPI.details.difficultyScore / 15) * 100}%`"></div>
                   </div>
                </div>

                <!-- 5. Time Efficiency -->
                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <div class="flex justify-between items-end mb-2">
                       <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ประสิทธิภาพเวลา (Efficiency)</span>
                      <span class="text-sm font-black text-slate-800">{{ selectedStaffKPI.details.timeScore.toFixed(1) }} <span class="text-[10px] text-slate-400">/ 10</span></span>
                   </div>
                   <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div class="bg-teal-500 h-full rounded-full transition-all duration-1000" :style="`width: ${(selectedStaffKPI.details.timeScore / 10) * 100}%`"></div>
                   </div>
                </div>

                 <!-- 6. Bonus -->
                <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                   <div class="flex justify-between items-end mb-2">
                       <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">โบนัสพนักงาน (งานด่วน/วิกฤต)</span>
                      <span class="text-sm font-black text-emerald-800">{{ selectedStaffKPI.details.bonusScore }} <span class="text-[10px] text-emerald-600">/ 10</span></span>
                   </div>
                   <div class="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                      <div class="bg-emerald-500 h-full rounded-full transition-all duration-1000" :style="`width: ${(selectedStaffKPI.details.bonusScore / 10) * 100}%`"></div>
                   </div>
                </div>
             </div>

             <div class="flex justify-end">
                <button @click="showKPIModal = false" class="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all shadow-lg">
                   ปิดหน้าต่าง
                </button>
             </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api'

const props = defineProps(['allStaff', 'userRole', 'deptName', 'projects'])
const emit = defineEmits(['add-staff', 'notify', 'refresh-team'])

const showCredentialModal = ref(false)
const showApprovalModal = ref(false)
const showEditModal = ref(false)
const showKPIModal = ref(false)
const selectedRequest = ref(null)
const selectedStaffKPI = ref(null)
const editingStaff = ref({})
const activations = ref([])
const newCredentials = ref({ id: '', password: '' })
const selectedDepartment = ref(null)

const departmentStats = computed(() => {
  const baseDepts = [
    { id: 1, name: 'Information Technology', code: 'IT', head: 'Somchai R.', colorMain: 'text-indigo-500', colorSub: 'text-indigo-300', mapName: ['IT', 'Information Technology'] },
    { id: 2, name: 'Creative Design', code: 'DS', head: 'Vipa S.', colorMain: 'text-pink-500', colorSub: 'text-pink-300', mapName: ['Design', 'Creative Design', 'DS'] },
    { id: 3, name: 'Human Resources', code: 'HR', head: 'Somsak K.', colorMain: 'text-orange-500', colorSub: 'text-orange-300', mapName: ['HR', 'Human Resources'] },
    { id: 4, name: 'Marketing & Sales', code: 'MK', head: 'Nari M.', colorMain: 'text-emerald-500', colorSub: 'text-emerald-300', mapName: ['Marketing', 'Sales', 'MK', 'Marketing & Sales'] },
  ]

  return baseDepts.map(dept => {
    // 1. Calculate Staff Count
    const staffCount = props.allStaff.filter(s => 
        dept.mapName.some(n => (s.dept || '').toLowerCase() === n.toLowerCase()) || 
        (s.dept === dept.code)
    ).length

    // 2. Calculate KPI (Completed Tasks / Total Tasks) * 100
    // Filter projects belonging to this department
    const deptProjects = (props.projects || []).filter(p => {
        const pDept = (p.dept || '').toLowerCase()
        return dept.mapName.some(n => pDept === n.toLowerCase()) || pDept === dept.code.toLowerCase()
    })

    const totalTasks = deptProjects.length
    const completedTasks = deptProjects.filter(p => p.status === 'completed').length
    const kpi = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return {
        ...dept,
        staffCount,
        kpi,
        trend: totalTasks > 0 ? `${completedTasks}/${totalTasks}` : '0/0' // Using trend field to show fraction as well or keep it simple
    }
  })
})

onMounted(async () => {
    fetchActivations()
})

const fetchActivations = async () => {
    try {
        const data = await api.getActivations({ approverRole: props.userRole })
        if (data) activations.value = data.filter(r => r.status === 'pending')
    } catch (e) {
        console.error("Fetch activations error", e)
    }
}

const getActivationFor = (staffId) => {
    return activations.value.find(r => r.staffId === staffId)
}

// 🎯 KPI Calculation Breakdown
const getStaffKPIDetails = (staff) => {
    const staffTasks = (props.projects || []).filter(p => {
        const sid = (p.staffId || '').toString().trim()
        const targetSid = (staff.staffId || '').toString().trim()
        
        // 1. Primary Match: staffId
        if (sid && targetSid && sid === targetSid) return true
        
        // 2. Fallback Match: name (case-insensitive)
        const pAssignee = (p.assignee || '').toString().trim().toLowerCase()
        const pStaffName = (p.staffName || '').toString().trim().toLowerCase()
        const sName = (staff.name || '').toString().trim().toLowerCase()
        
        return (sName && (pAssignee === sName || pStaffName === sName))
    })

    const totalTasks = staffTasks.length
    if (totalTasks === 0) return {
        onTimeScore: 0, qualityScore: 0, issueScore: 0, difficultyScore: 0,
        timeScore: 0, bonusScore: 0, total: 0, taskCount: 0
    }

    // 1. ON-TIME (35 คะแนน)
    const onTimeTasks = staffTasks.filter(t => t.status === 'completed' && t.deadline && new Date(t.completedAt || new Date()) <= new Date(t.deadline)).length
    const onTimeScore = totalTasks > 0 ? (onTimeTasks / totalTasks) * 35 : 0

    // 2. QUALITY (25 คะแนน)
    const qualitySum = staffTasks.reduce((acc, t) => acc + ((t.qualityRating || 4) / 5) * 25, 0)
    const qualityScore = totalTasks > 0 ? qualitySum / totalTasks : 0

    // 3. REVISION (15 คะแนน)
    const revisionTasks = staffTasks.filter(t => t.status === 'revision' || t.status === 'returned').length
    const issueRate = totalTasks > 0 ? revisionTasks / totalTasks : 0
    const issueScore = (1 - issueRate) * 15

    // 4. DIFFICULTY (15 คะแนน)
    const diffSum = staffTasks.reduce((acc, t) => acc + (t.difficulty || 3), 0)
    const avgDifficulty = totalTasks > 0 ? diffSum / totalTasks : 0
    const difficultyScore = (avgDifficulty / 5) * 15

    // 5. TIME EFFICIENCY (10 คะแนน)
    const timeScoreSum = staffTasks.reduce((acc, t) => {
        const estimated = parseFloat(t.estimatedHours) || 5
        const actual = parseFloat(t.actualHours) || 5
        let eff = actual > 0 ? estimated / actual : 1
        if (eff > 1) eff = 1
        return acc + (eff * 10)
    }, 0)
    const timeScore = totalTasks > 0 ? timeScoreSum / totalTasks : 0

    // BONUS SCORE (Max 10)
    let bonusScore = 0
    staffTasks.forEach(t => {
        if (t.type === 'urgent' || t.priority === 'urgent') bonusScore += 2
        if (t.priority === 'critical') bonusScore += 5
        if (t.priority === 'high') bonusScore += 1 
    })
    if (bonusScore > 10) bonusScore = 10

    const total = onTimeScore + qualityScore + issueScore + difficultyScore + timeScore + bonusScore

    return {
        onTimeScore,
        qualityScore,
        issueScore,
        difficultyScore,
        timeScore,
        bonusScore,
        total: Math.min(100, Math.round(total)),
        taskCount: totalTasks
    }
}


// 🎯 SVG Chart Generator
const getPieSlice = (percentage) => {
    const p = Math.max(0, Math.min(100, percentage || 0));
    const r = 45;
    const c = 50;
    
    // Draw full circle if 100%
    if (p >= 100) {
       return `M ${c} ${c-r} A ${r} ${r} 0 1 1 ${c} ${c+r} A ${r} ${r} 0 1 1 ${c} ${c-r} Z`;
    }
    if (p <= 0) return '';
    
    const startAngle = -Math.PI / 2; // Start at 12 o'clock
    const endAngle = startAngle + (2 * Math.PI * (p / 100));

    const x1 = c + r * Math.cos(startAngle);
    const y1 = c + r * Math.sin(startAngle);
    
    const x2 = c + r * Math.cos(endAngle);
    const y2 = c + r * Math.sin(endAngle);
    
    const largeArc = p > 50 ? 1 : 0;
    
    return `M ${c} ${c} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

const calculateStaffPerformance = (staff) => {
    return getStaffKPIDetails(staff).total
}

const openKPIDetailModal = (staff) => {
    if (props.userRole !== 'manager') return
    selectedStaffKPI.value = { 
        ...staff, 
        details: getStaffKPIDetails(staff) 
    }
    showKPIModal.value = true
}

const handleCardAction = (staff) => {
    const req = getActivationFor(staff.staffId)
    if (req) {
        selectedRequest.value = req
        showApprovalModal.value = true
    }
}

const approve = async (req) => {
  try {
    await api.updateActivation(req._id || req.id, { status: 'approved' })
    emit('notify', `อนุมัติการสมัครของ ${req.name} เรียบร้อยแล้ว!`)
    showApprovalModal.value = false
    await fetchActivations()
    emit('refresh-team')
  } catch (e) {
    console.error("Approve error", e)
    emit('notify', { message: 'การอนุมัติขัดข้อง', type: 'error' })
  }
}

const reject = async (req) => {
  if (!confirm(`ยืนยันการปฏิเสธคำขอของ ${req.name}?`)) return
  try {
    await api.updateActivation(req._id || req.id, { status: 'rejected' })
    emit('notify', `ปฏิเสธคำขอของ ${req.name} แล้ว`)
    showApprovalModal.value = false
    await fetchActivations()
  } catch (e) {
    console.error("Reject error", e)
    emit('notify', { message: 'การปฏิเสธขัดข้อง', type: 'error' })
  }
}

const departmentStaff = computed(() => {
  if (!selectedDepartment.value) return []
  return props.allStaff.filter(staff => {
    const sDept = (staff.dept || '').toLowerCase()
    // Use the same mapping logic as departmentStats
    return selectedDepartment.value.mapName.some(n => sDept === n.toLowerCase()) || 
           sDept === selectedDepartment.value.code.toLowerCase()
  }).map(staff => ({
      ...staff,
      performance: calculateStaffPerformance(staff)
  }))
})

const filteredAllStaff = computed(() => {
  let list = props.allStaff
  
  if (props.userRole !== 'manager') {
      const myDept = props.deptName || ''
      list = props.allStaff.filter(staff => 
        staff.dept === myDept || 
        (staff.dept && myDept && staff.dept.toLowerCase().includes(myDept.toLowerCase()))
      )
  }

  return list.map(staff => ({
      ...staff,
      performance: calculateStaffPerformance(staff)
  }))
})

// Edit Functionality
const openEditModal = (staff) => {
  editingStaff.value = { ...staff }
  showEditModal.value = true
}

const saveStaffEdit = async () => {
  try {
    await api.updateTeamMember(editingStaff.value.staffId, {
      name: editingStaff.value.name,
      position: editingStaff.value.position,
      role: editingStaff.value.role,
      profile_url: editingStaff.value.profile_url
    })
    emit('notify', `อัปเดตข้อมูลของ ${editingStaff.value.name} เรียบร้อยแล้ว!`)
    showEditModal.value = false
    emit('refresh-team')
  } catch (e) {
    console.error("Update staff error", e)
    emit('notify', { message: 'ไม่สามารถอัปเดตข้อมูลได้', type: 'error' })
  }
}

// 🎯 ฟังก์ชันสุ่มรหัสและรหัสผ่าน
const generateNewStaff = () => {
  // 1. สุ่ม Staff ID (CX-ตามด้วยเลข 4 หลัก)
  const randomId = 'CX-' + Math.floor(1000 + Math.random() * 9000);
  
  // 2. สุ่ม Password (เลข 6 หลัก)
  const randomPass = Math.floor(100000 + Math.random() * 900000).toString();

  // Show Modal
  newCredentials.value = { id: randomId, password: randomPass }
  showCredentialModal.value = true

  // 3. ส่งข้อมูลกลับไปที่ App.vue เพื่อบันทึกลง Array หลัก
  emit('add-staff', {
    staffId: randomId,
    password: randomPass,
    name: '', 
    role: props.userRole === 'manager' ? 'lead' : 'staff', 
    dept: props.deptName || (selectedDepartment.value ? selectedDepartment.value.code : 'IT'),
    performance: 0
  })
}

const removeStaff = async (staff) => {
  const sid = (staff.staffId || '').trim();
  if (!sid) {
    emit('notify', { message: 'ระบบไม่พบ Staff ID ของพนักงานท่านนี้', type: 'error' });
    return;
  }

  if (!confirm(`ยืนยันการลบพนักงาน ${staff.name || sid} ออกจากระบบ?`)) return
  
  try {
    const res = await api.deleteTeamMember(sid)
    if (res.success) {
      emit('notify', { message: res.message, type: 'success' })
      emit('refresh-team')
    }
  } catch (e) {
    console.error("Delete staff error", e)
    emit('notify', { message: `ไม่สามารถลบข้อมูลได้: ${e.message}`, type: 'error' })
  }
}
</script>

<style scoped>
/* รักษาสไตล์เดิมของน้องไว้ */
.animate-fade-up {
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
code {
  font-family: 'LINE Seed Sans TH', sans-serif;
}
</style>
