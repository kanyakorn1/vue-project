<template>
  <div class="min-h-full flex flex-col gap-6 animate-fade-up">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
      <div>
        <h2 class="text-3xl font-black text-slate-800 tracking-tighter uppercase">Operational Timeline</h2>
        <p class="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Schedule & Duty Roster: January 2026</p>
      </div>

       <div class="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm">
           <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors">
               <i class="fas fa-chevron-left"></i>
           </button>
           <span class="text-sm font-black text-slate-700 px-4 uppercase tracking-wider">JAN 2026</span>
           <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors">
               <i class="fas fa-chevron-right"></i>
           </button>
       </div>
    </div>

    <!-- Calendar Layout -->
    <div class="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- Main Calendar Grid (3 Cols) -->
        <div class="lg:col-span-3 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-6 flex flex-col overflow-hidden">
            <!-- Weekdays -->
            <div class="grid grid-cols-7 mb-4">
                <div v-for="day in ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']" :key="day" class="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest py-2">
                    {{ day }}
                </div>
            </div>

            <!-- Days Grid -->
            <div class="grid grid-cols-7 grid-rows-5 flex-1 gap-2">
                <!-- Empty Offset Days -->
                <div v-for="n in startOffset" :key="`empty-${n}`" class="p-2 opacity-0"></div>

                <!-- Actual Days -->
                <div v-for="day in daysInMonth" :key="day" 
                     class="relative border border-slate-50 rounded-2xl p-2 hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer group flex flex-col gap-1 min-h-[80px]"
                     :class="day === currentDay ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white'"
                >
                    <span class="text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full"
                          :class="day === currentDay ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-700 group-hover:text-indigo-600'">
                        {{ day }}
                    </span>

                    <!-- Events on this day -->
                    <div v-for="event in getEventsForDay(day)" :key="event.id" 
                         class="text-[8px] font-bold px-2 py-1 rounded-md truncate shadow-sm transition-transform hover:scale-105"
                         :class="event.colorClass">
                        {{ event.title }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Sidebar (1 Col) -->
        <div class="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1">
            
            <!-- Quick Add -->
            <button class="bg-indigo-600 text-white p-6 rounded-[2rem] shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-between group">
                <div class="text-left">
                    <p class="text-[10px] font-bold opacity-70 uppercase tracking-widest">New Entry</p>
                    <h3 class="text-lg font-black uppercase tracking-tight">Add Schedule</h3>
                </div>
                <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform">
                    <i class="fas fa-plus"></i>
                </div>
            </button>

            <!-- Upcoming List -->
            <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-6 flex flex-col gap-4 flex-1">
                <h3 class="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                    <i class="fas fa-clock text-indigo-500"></i> Upcoming
                </h3>

                <div class="space-y-4">
                    <div v-for="event in upcomingEvents" :key="event.id" class="flex gap-4 items-start group cursor-pointer">
                        <div class="flex flex-col items-center min-w-[3rem] bg-slate-50 rounded-xl p-2 border border-slate-100 group-hover:border-indigo-200 transition-colors">
                            <span class="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{{ event.month }}</span>
                            <span class="text-xl font-black text-slate-800 group-hover:text-indigo-600">{{ event.date }}</span>
                        </div>
                        <div>
                            <h4 class="text-xs font-black text-slate-700 group-hover:text-indigo-600 transition-colors line-clamp-1">{{ event.title }}</h4>
                            <p class="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wide">{{ event.time }}</p>
                            <span class="inline-block mt-2 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider" :class="event.badgeColor">
                                {{ event.type }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Configuration for Jan 2026
const daysInMonth = 31
const startOffset = 4 // Jan 1st 2026 starts on Thursday (0=Sun, 1=Mon... 4=Thu)
const currentDay = 29 // Today in simulation

// Mock Data
const allEvents = ref([
    { id: 1, date: 5, title: 'Security Audit', type: 'urgent', colorClass: 'bg-rose-100 text-rose-600' },
    { id: 2, date: 12, title: 'Team Meeting', type: 'meeting', colorClass: 'bg-indigo-100 text-indigo-600' },
    { id: 3, date: 12, title: 'Code Review', type: 'work', colorClass: 'bg-slate-100 text-slate-600' },
    { id: 4, date: 15, title: 'Deploy V3.1', type: 'release', colorClass: 'bg-emerald-100 text-emerald-600' },
    { id: 5, date: 24, title: 'Server Maint.', type: 'system', colorClass: 'bg-amber-100 text-amber-600' },
    { id: 6, date: 29, title: 'Sprint Plan', type: 'meeting', colorClass: 'bg-indigo-600 text-white' },
    { id: 7, date: 30, title: 'Report Due', type: 'urgent', colorClass: 'bg-rose-100 text-rose-600' },
])

const upcomingEvents = ref([
    { id: 6, date: '29', month: 'JAN', title: 'Sprint Planning Q1', time: '10:00 AM - 12:00 PM', type: 'Meeting', badgeColor: 'bg-indigo-50 text-indigo-500' },
    { id: 7, date: '30', month: 'JAN', title: 'Monthly Report Submission', time: '05:00 PM Deadline', type: 'Urgent', badgeColor: 'bg-rose-50 text-rose-500' },
    { id: 8, date: '02', month: 'FEB', title: 'New Intern Onboarding', time: '09:00 AM', type: 'HR', badgeColor: 'bg-emerald-50 text-emerald-500' },
])

const getEventsForDay = (day) => {
    return allEvents.value.filter(e => e.date === day)
}

</script>
