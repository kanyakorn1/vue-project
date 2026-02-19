// backend/src/schemas/project.schema.ts

import mongoose, { Schema } from 'mongoose';
import { IProject } from '../interfaces/project.interface.js';

/**
 * Mongoose Schema สำหรับ Project
 * กำหนดโครงสร้างข้อมูลให้สอดคล้องกับฐานข้อมูล MongoDB Atlas และ UI ของ AProjectO
 */
const ProjectSchema: Schema = new Schema({
    // 1. ข้อมูลพื้นฐาน (ดึงข้อมูลมาจากหน้าสร้างโปรเจกต์)
    projectName: {
        type: String,
        required: [true, 'กรุณาระบุชื่อโปรเจกต์']
    },
    scopeDetail: {
        type: String,
        required: [true, 'กรุณาระบุรายละเอียดและขอบเขตงาน']
    },
    deadline: {
        type: String,
        required: [true, 'กรุณาระบุวันที่กำหนดส่ง']
    },
    projectManager: {
        type: String,
        required: [true, 'กรุณาระบุผู้รับผิดชอบหรือ PM']
    },

    // 2. สถานะและความคืบหน้า (ใช้แสดงผลใน Dashboard และ Kanban)
    status: {
        type: String,
        default: 'on time',
        enum: ['on time', 'late', 'completed']
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    // 3. 🔥 ระบบปักหมุดงานเร่งด่วน (Urgent Pinning)
    // สำหรับผู้จัดการสั่งการพิเศษ เพื่อให้งานนี้ติดอยู่บนสุดในหน้า Employee Project
    isUrgent: {
        type: Boolean,
        default: false
    },

    // 4. ฟิลด์เพิ่มเติมที่ปรับแต่งได้ (จากระบบเพิ่มกล่องข้อมูล)
    customFields: [
        {
            label: { type: String },
            type: { type: String },
            options: { type: [String] },
            value: { type: Schema.Types.Mixed } // รองรับทั้ง Text, Checkbox, Dropdown
        }
    ],

    // 5. วันที่สร้าง (ประกาศไว้เพื่อให้เข้าถึงได้ง่ายใน Interface)
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    // 🔥 บันทึกวันที่สร้าง (createdAt) และวันที่แก้ไขล่าสุด (updatedAt) อัตโนมัติ
    timestamps: true
});

/**
 * สร้าง Model 'Project' เพื่อนำไปใช้งานใน Service และ Controller
 * ใช้ Interface 'IProject' เพื่อให้ TypeScript ช่วยตรวจสอบ Type ของข้อมูล
 */
const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);

export default ProjectModel;