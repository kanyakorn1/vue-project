<template>
  <div class="min-h-screen w-full bg-[#0b1121] flex items-center justify-center p-6 font-sans text-left">
    <div class="bg-white w-full max-w-[460px] rounded-[3.5rem] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden animate-pop text-left">
      
      <div class="bg-[#5c56f0] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
        <i class="fas fa-id-card-alt text-3xl text-white"></i>
      </div>

      <div v-if="!isStaffMode && !isCompletingProfile" class="animate-fade-in text-left">
        <h2 class="text-3xl font-black text-[#1e293b] tracking-tighter mb-10 text-center uppercase italic">Sign In HQ</h2>
        <div class="space-y-6">
          <input v-model="emailInput" type="text" placeholder="Username / Staff ID" class="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold outline-none focus:border-indigo-300 transition-all text-left">
          <input v-model="passwordInput" type="password" placeholder="Password" class="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold outline-none focus:border-indigo-300 transition-all text-left">
          <button @click="handleLogin" class="w-full py-6 bg-[#0f172a] text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-[#5c56f0] transition-all text-center">Enter System</button>
        </div>
        <p @click="isStaffMode = true" class="mt-10 text-[11px] font-black text-[#5c56f0] uppercase cursor-pointer tracking-widest text-center hover:underline">ลงทะเบียนครั้งแรกด้วย STAFF ID</p>
      </div>

      <div v-else-if="isStaffMode && !isCompletingProfile" class="animate-fade-in text-left">
        <h2 class="text-3xl font-black text-[#1e293b] tracking-tighter mb-2 text-center uppercase italic text-center">Activate Account</h2>
        <p class="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 text-center">ใส่รหัสที่ได้รับจากหัวหน้าแผนก</p>
        
        <div class="space-y-6 text-left">
          <input v-model="staffIdInput" type="text" placeholder="Staff ID (เช่น CX-1234)" class="w-full px-8 py-5 bg-slate-50 border-2 border-indigo-100 rounded-[2rem] font-black text-[#5c56f0] outline-none text-left">
          <input v-model="staffPasswordInput" type="password" placeholder="Initial Password" class="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold outline-none text-left">
          <button @click="verifyStaff" class="w-full py-6 bg-[#5c56f0] text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all text-center">Verify Identity</button>
          <p @click="isStaffMode = false" class="text-center text-[11px] font-black text-slate-300 uppercase cursor-pointer pt-4">ย้อนกลับ</p>
        </div>
      </div>

      <div v-else class="animate-fade-in text-left">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-black text-[#1e293b] tracking-tighter uppercase italic text-center">Complete Profile</h2>
          <div class="mt-4 inline-block px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
            <i class="fas fa-check-circle mr-1"></i> ยืนยันตัวตนสำเร็จ: {{ detectedDept }} Dept.
          </div>
        </div>

        <div class="space-y-6 text-left">
          <div class="space-y-2 text-left">
            <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left">ชื่อ-นามสกุล</label>
            <input v-model="profile.name" type="text" placeholder="ระบุชื่อจริงของคุณ" class="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold outline-none focus:border-emerald-300 transition-all text-left">
          </div>
          <div class="space-y-2 text-left">
            <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-widest text-left">ระบุตำแหน่ง / บทบาท (Role Assignment)</label>
            <div v-if="profile.role && profile.role !== 'Wait for setup'" class="w-full px-8 py-5 bg-slate-100 border-2 border-slate-200 rounded-[2rem] font-black text-indigo-500 text-left">
              {{ profile.role }}
            </div>
            <select v-else v-model="profile.role" class="w-full px-8 py-5 bg-slate-50 border-2 border-emerald-100 rounded-[2rem] font-bold outline-none focus:border-emerald-300 transition-all appearance-none cursor-pointer">
              <option value="" disabled>เลือกบทบาทของคุณ...</option>
              <option value="pm">Project Manager (PM)</option>
              <option value="staff">Staff / Operator</option>
            </select>
          </div>

          <!-- New Position Field -->
          <div v-if="profile.role === 'staff'" class="space-y-2 text-left animate-fade-in">
            <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-widest">หน้าที่ความรับผิดชอบ (Role Description)</label>
            <input v-model="profile.position" type="text" placeholder="ระบุหน้าที่ของคุณ เช่น Backend Dev, UI Designer" class="w-full px-8 py-5 bg-slate-50 border-2 border-emerald-100 rounded-[2rem] font-bold outline-none focus:border-emerald-300 transition-all text-left">
          </div>
          <div class="space-y-2 text-left">
            <label class="text-[11px] font-black text-slate-400 uppercase ml-5 tracking-widest">เลือกแผนกประจำการ (Sector Allocation)</label>
            <select v-model="detectedDept" class="w-full px-8 py-5 bg-slate-50 border-2 border-emerald-100 rounded-[2rem] font-bold outline-none focus:border-emerald-300 transition-all appearance-none cursor-pointer">
              <option value="" disabled>กรุณาเลือกแผนก...</option>
              <option value="IT">IT (Information Technology)</option>
              <option value="DS">DS (Creative Design)</option>
              <option value="HR">HR (Human Resources)</option>
              <option value="MK">MK (Marketing)</option>
              <option value="SF">SF (Sales Force)</option>
            </select>
          </div>

          <button @click="finishRegistration" class="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all text-center">
            Start Working <i class="fas fa-rocket ml-2"></i>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

import api from '@/api'

const emit = defineEmits(['login-success', 'add-staff', 'notify'])

const isStaffMode = ref(false)
const isCompletingProfile = ref(false)
const detectedDept = ref('') // เก็บแผนกที่ดึงมาอัตโนมัติ

// ข้อมูลสำหรับ Lead/PM
const emailInput = ref('lead@corpx.com')
const passwordInput = ref('123')

// ข้อมูลสำหรับ Staff
const staffIdInput = ref('')
const staffPasswordInput = ref('')

// ข้อมูล Profile พนักงานใหม่
const profile = reactive({ name: '', role: '', position: '' })

const handleLogin = async () => {
  try {
    const response = await api.login({ username: emailInput.value, password: passwordInput.value })
    if (response && response.success) {
      // Map backend user to frontend expectations
      // Backend: { id, username, role, name }
      // Frontend expects: { email, userName, userRole }
      emit('login-success', {
        email: response.user.username,
        userName: response.user.name,
        userRole: response.user.role,
        userDept: response.user.dept,
        position: response.user.position,
        id: response.user.id
      })
    } else {
        emit('notify', { message: response.message || response.error || 'ไม่สามารถเข้าสู่ระบบได้ โปรดตรวจสอบข้อมูลอีกครั้งครับ', type: 'error' })
    }
  } catch (e) {
    console.error("Login error", e)
    emit('notify', { message: e.message || 'ระบบขัดข้อง กรุณาลองใหม่อีกครั้งครับ', type: 'error' })
  }
}

/**
 * 🎯 ขั้นตอนที่ 1: ตรวจสอบ Staff ID และ "เดา" แผนก
 */
const verifyStaff = async () => {
  if (staffIdInput.value && staffPasswordInput.value) {
    try {
      const info = await api.verifyStaff({ 
        staffId: staffIdInput.value, 
        password: staffPasswordInput.value 
      })
      
      if (info) {
        detectedDept.value = info.dept || 'General'
        profile.role = info.role !== 'Wait for setup' ? info.role : ''
        isCompletingProfile.value = true
      }
    } catch (e) {
      emit('notify', { message: 'Staff ID หรือ Password ไม่ถูกต้อง หรือบัญชีนี้ไม่อยู่ในระบบครับ', type: 'error' })
      console.error(e)
    }
  } else {
    emit('notify', 'กรุณากรอกข้อมูลให้ครบถ้วนนะครับ!')
  }
}

/**
 * 🎯 ขั้นตอนที่ 2: บันทึกข้อมูลและพาเข้าระบบ
 */
const finishRegistration = async () => {
  if (profile.name && profile.role) {
    try {
      const payload = {
        staffId: staffIdInput.value,
        name: profile.name,
        role: profile.role,
        dept: detectedDept.value,
        position: profile.position
      }
      
      await api.createActivation(payload)
      
      emit('notify', `คำขอลงทะเบียนสำเร็จ! โปรดรอหัวหน้าอนุมัติก่อนจะสามารถเข้าใช้งานได้ครับคุณ ${profile.name}`)
      
      // Reset state and go back to login
      isCompletingProfile.value = false
      isStaffMode.value = false
      staffIdInput.value = ''
      staffPasswordInput.value = ''
    } catch (e) {
      emit('notify', { message: 'การลงทะเบียนขัดข้อง กรุณาตรวจสอบข้อมูลและลองใหม่', type: 'error' })
      console.error(e)
    }
  } else {
    emit('notify', 'กรุณากรอกชื่อและตำแหน่งงานด้วยครับ!')
  }
}
</script>

<style scoped>
.animate-pop { animation: pop 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67); }
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
