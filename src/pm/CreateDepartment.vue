<template>
  <div class="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans animate-fade-in">
    <!-- Card -->
    <div class="bg-white rounded-[2.5rem] w-full max-w-lg p-12 shadow-2xl relative overflow-hidden text-center">
        
        <!-- Decoration -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full -z-0 translate-x-1/3 -translate-y-1/3"></div>

        <div class="absolute top-10 left-10 w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 mb-8 relative z-10">
            <i class="fas fa-building text-3xl"></i>
        </div>

        <div class="mt-24 relative z-10 text-left">
            <h2 class="text-3xl font-black text-slate-800 tracking-tighter uppercase mb-2">Establish Division</h2>
            <p class="text-sm font-medium text-slate-500 mb-8 max-w-xs">Commander, please initialize your operational division to proceed with tactical assignments.</p>

            <form @submit.prevent="createDepartment" class="space-y-8">
                <div class="space-y-3">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Division Name (ชื่อแผนก)</label>
                    <input v-model="departmentName" type="text" placeholder="e.g. Cyber Security Unit" class="w-full bg-slate-50 border-none rounded-2xl p-5 text-lg font-black text-slate-800 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-300" required />
                </div>

                <div class="flex gap-4 pt-4">
                    <button type="submit" class="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-xs font-black tracking-[0.2em] uppercase hover:bg-indigo-600 hover:-translate-y-1 transition-all shadow-xl shadow-slate-200">
                        Initialize
                    </button>
                    <button type="button" @click="goBack" class="px-6 py-4 rounded-2xl text-xs font-black tracking-[0.2em] uppercase text-slate-400 hover:bg-slate-50 transition-colors">
                        Abort
                    </button>
                </div>
            </form>
        </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const departmentName = ref('')

const createDepartment = () => {
    if (!departmentName.value) return

    const inputName = departmentName.value.trim()
    
    // 1. Get Existing Departments Registry (Mock DB)
    // Format: { "department name": "lead_email" }
    const registeredDepartments = JSON.parse(localStorage.getItem('registeredDepartments') || '{}')
    
    // 2. Check overlap (Case Insensitive Validation)
    // Find if any key matches the input case-insensitively
    const existingDeptName = Object.keys(registeredDepartments).find(
        key => key.toLowerCase() === inputName.toLowerCase()
    )

    if (existingDeptName) {
        // Department Taken
        const owner = registeredDepartments[existingDeptName]
        alert(`ACCESS DENIED: The division "${existingDeptName}" is already under command of ${owner}.\n\nPlease contact HQ or establish a different division name.`)
        return
    }

    // 3. Save New Department
    const email = localStorage.getItem('currentUserEmail')
    if (email) {
        // Link dept to this user
        localStorage.setItem(`dept_${email}`, inputName)

        // Update Registry
        registeredDepartments[inputName] = email
        localStorage.setItem('registeredDepartments', JSON.stringify(registeredDepartments))
    }
    
    // Simulate Processing
    setTimeout(() => {
        router.push('/')
    }, 500)
}

const goBack = () => {
    localStorage.removeItem('userRole') // Logout
    router.push('/login')
}
</script>
