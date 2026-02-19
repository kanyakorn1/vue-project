<template>
  <div v-if="isVisible" class="modal-backdrop" @click="closeModal">
    
    <div class="modal-content" @click.stop>
      
      <div class="modal-header">
        <h3>{{ projectToEdit ? 'รายละเอียด Project' : 'สร้าง Project' }}</h3>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-body split-view">
        
        <!-- Left Panel: Required Forms -->
        <div class="left-panel">
            <h4 class="panel-title">ข้อมูลพื้นฐาน (Required)</h4>
            
            <div class="form-group">
                <label>ชื่อ Project</label>
                <input 
                  type="text" 
                  v-model="formData.projectName" 
                  placeholder="หัวข้อโปรเจกต์"
                  required
                  :disabled="!isEditMode"
                >
            </div>

            <div class="form-group">
                <label>วันที่สร้าง (Created Date)</label>
                <input 
                  type="text" 
                  :value="displayCreatedDate"
                  disabled
                  style="background-color: #e9ecef; cursor: not-allowed;"
                >
            </div>

            <div class="form-group">
                <label>กำหนดวันที่ต้องส่ง (Deadline)</label>
                <input 
                  type="date" 
                  v-model="formData.deadline"
                  required
                  :disabled="!isEditMode"
                  @input="handleDateInput"
                >
            </div>

            <div class="form-group">
                <label>รายละเอียดและขอบเขต (Scope)</label>
                <textarea 
                  v-model="formData.scopeDetail" 
                  placeholder="รายละเอียดของขอบเขตงาน"
                  rows="5"
                  required
                  :disabled="!isEditMode"
                ></textarea>
            </div>

            <div class="form-group">
                <label>ผู้รับผิดชอบ (PM)</label>
                <select v-model="formData.projectManager" required :disabled="!isEditMode">
                  <option value="" disabled>ผู้รับผิดชอบ</option>
                  <option value="user1">Anima Agrawal</option>
                  <option value="user2">Justin Mason</option>
                  <option value="user3">ผู้รับผิดชอบอื่นๆ</option>
                </select>
            </div>
        </div>

        <!-- Right Panel: Custom Fields -->
        <div class="right-panel">
            <div class="right-panel-header">
                <h4 class="panel-title">ข้อมูลเพิ่มเติม</h4>
                <button v-if="isEditMode" type="button" class="add-button-header" @click="addField">
                  + เพิ่มกล่องข้อมูล
                </button>
            </div>

            <draggable
                class="custom-fields-grid"
                :list="customFields" 
                @update:modelValue="handleDragUpdate" 
                item-key="id" 
                handle=".custom-field-handle" 
                tag="div"
            >
                <template #item="{ element: field, index }">
                    <div class="custom-field-group">
                        <h4 class="custom-field-handle" :style="{ cursor: isEditMode ? 'grab' : 'default' }">กล่องข้อมูล #{{ index + 1 }}</h4>

                        <div v-if="field.isEditing && isEditMode" class="field-config-area">
                          <div class="field-meta">
                              <input 
                                  type="text" 
                                  v-model="field.label" 
                                  placeholder="หัวข้อ" 
                                  required
                              >
                              
                              <select v-model="field.type" class="field-type-select">
                                <option value="short-text">Short Text</option>
                                <option value="long-text">Long Text</option>
                                <option value="select">Dropdown</option>
                                <option value="multi-select">Checkbox</option>
                                <option value="radio">Radio</option>
                              </select>
                              
                              <button type="button" class="btn-remove" @click="removeField(field.id)">ลบ</button>
                          </div>
                          
                          <div v-if="field.type !== 'short-text' && field.type !== 'long-text'" class="options-container">
                              <textarea 
                                  v-model="field.options" 
                                  @input="updateOptions(field)"
                                  placeholder="ตัวเลือก A, ตัวเลือก B"
                              ></textarea>
                          </div>

                          <button type="button" class="btn-save-field" @click="saveField(field)">บันทึก</button>
                        </div>
                        
                        <div v-else class="field-display-area">
                          <div class="display-header">
                              <p class="saved-label-text">{{ field.label }}</p>
                              <div v-if="isEditMode" class="display-actions">
                                <button type="button" class="btn-edit-small" @click="editField(field)">Edit</button>
                                <button type="button" class="btn-remove-small" @click="removeField(field.id)">Del</button>
                              </div>
                          </div>
                        </div>
                        
                        <div class="final-input-control">
                          <input v-if="field.type === 'short-text'" type="text" v-model="field.value" :disabled="(!field.isEditing && isEditMode) || !isEditMode">
                          <textarea v-else-if="field.type === 'long-text'" v-model="field.value" rows="3" :disabled="(!field.isEditing && isEditMode) || !isEditMode"></textarea>
                          <select v-else-if="field.type === 'select'" v-model="field.value" :disabled="(!field.isEditing && isEditMode) || !isEditMode">
                              <option v-for="opt in field.parsedOptions" :key="opt" :value="opt">{{ opt }}</option>
                          </select>
                          <div v-else-if="field.type === 'multi-select' && field.parsedOptions.length" class="preview-checkbox-group">
                              <div v-for="option in field.parsedOptions" :key="option" class="preview-item">
                                  <input type="checkbox" :id="'final-'+field.id + option" :value="option" v-model="field.value" :disabled="!field.isEditing && !isEditMode">
                                  <label :for="'final-'+field.id + option">{{ option }}</label>
                              </div>
                          </div>

                          <div v-else-if="field.type === 'radio' && field.parsedOptions.length" class="preview-radio-group">
                              <div v-for="option in field.parsedOptions" :key="option" class="preview-item">
                                  <input type="radio" :id="'final-'+field.id + option" :value="option" :name="'radio-' + field.id" v-model="field.value" :disabled="!field.isEditing && !isEditMode">
                                  <label :for="'final-'+field.id + option">{{ option }}</label>
                              </div>
                          </div>
                        </div>
                    </div>
                </template>
            </draggable>
        </div>

      </form>
      
      <div class="modal-footer">
        <button type="button" class="btn-cancel" @click="closeModal">{{ isEditMode && projectToEdit ? 'ยกเลิกการแก้ไข' : 'ปิด' }}</button>
        
        <button 
            v-if="projectToEdit && isEditMode" 
            type="button" 
            class="btn-danger" 
            @click="handleDelete"
        >
            🗑️ ลบโปรเจค
        </button>
        
        <button v-if="!isEditMode" type="button" class="btn-primary" @click="enableEditMode">
             ✏️ แก้ไขข้อมูล
        </button>

        <button v-else type="submit" class="btn-primary" @click="handleSubmit">
          <span class="plus-icon">{{ projectToEdit ? '💾' : '+' }}</span> {{ projectToEdit ? 'บันทึกการแก้ไข' : 'สร้างโปรเจกต์ใหม่' }}
        </button>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, computed } from 'vue';
import draggable from 'vuedraggable'; 
import api from '@/api';

const isEditMode = ref(true); // Default to edit mode (for new projects) 

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  projectToEdit: {
    type: Object,
    default: null
  }
});

// *** เพิ่ม 'project-created' ใน emit list ***
const emit = defineEmits(['close', 'project-created']); 

const displayCreatedDate = computed(() => {
    if (props.projectToEdit && props.projectToEdit.createdAt) {
        return new Date(props.projectToEdit.createdAt).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    return new Date().toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

const minDeadlineDate = computed(() => {
    let date;
    if (props.projectToEdit && props.projectToEdit.createdAt) {
        date = new Date(props.projectToEdit.createdAt);
    } else {
        date = new Date();
    }
    // Format YYYY-MM-DD for input[type="date"]
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
});

const handleDateInput = () => {
    // Allows viewing past months (no min attribute) but prevents selecting them.
    if (formData.deadline && formData.deadline < minDeadlineDate.value) {
        formData.deadline = ''; // Silently clear invalid date
    }
};

const formData = reactive({
  projectName: '',
  scopeDetail: '',
  deadline: '',
  projectManager: '',
});

const customFields = reactive([]); 

const addField = () => {
  customFields.push({
    id: Date.now(), 
    label: '',       
    type: 'short-text', 
    value: '',       
    options: '', 
    parsedOptions: [], 
    _oldType: 'short-text', 
    isEditing: true, 
  });
};

const removeField = (id) => {
  const index = customFields.findIndex(field => field.id === id);
  if (index !== -1) {
    customFields.splice(index, 1);
  }
};

const saveField = (field) => {
    if (!field.label) {
        alert('กรุณาใส่ชื่อกล่องข้อมูลก่อนบันทึก');
        return;
    }
    const isOptionType = ['select', 'multi-select', 'radio'].includes(field.type);
    if (isOptionType && field.parsedOptions.length === 0 && field.options.trim().length === 0) {
        alert('กรุณาใส่ตัวเลือกอย่างน้อยหนึ่งตัวเลือกก่อนบันทึก');
        return;
    }

    field.isEditing = false;
};

const editField = (field) => {
    field.isEditing = true;
};

const updateOptions = (field) => {
    if (field.options) {
        field.parsedOptions = field.options
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);
    } else {
        field.parsedOptions = [];
    }
};

const handleDragUpdate = (newArray) => {
    customFields.splice(0, customFields.length, ...newArray);
    console.log('Drag position updated successfully.');
};

watch(() => props.projectToEdit, (newVal) => {
    if (newVal) {
        // Populate Form
        formData.projectName = newVal.title || newVal.projectName;
        formData.scopeDetail = newVal.desc || newVal.scopeDetail;
        formData.projectManager = newVal.assignee || newVal.projectManager;
        
        // Fix date format for input[type="date"] (YYYY-MM-DD)
        const dateVal = newVal.dueDate || newVal.deadline;
        formData.deadline = dateVal ? new Date(dateVal).toISOString().split('T')[0] : '';

        // Populate Custom Fields
        const mappedFields = (newVal.customFields || []).map((f, i) => ({
             id: Date.now() + i, // Generate temporary ID
             label: f.label,
             type: f.type,
             value: f.value,
             options: Array.isArray(f.options) ? f.options.join(', ') : '',
             parsedOptions: Array.isArray(f.options) ? f.options : [],
             isEditing: false, // View mode by default
             _oldType: f.type
        }));
        customFields.splice(0, customFields.length, ...mappedFields);
        
        isEditMode.value = false; // View mode for existing projects
    } else {
        // Reset Form
        Object.assign(formData, { 
            projectName: '', 
            scopeDetail: '', 
            deadline: '', 
            projectManager: '' 
        });
        customFields.splice(0, customFields.length);
        isEditMode.value = true; // Edit mode for new projects
    }
}, { immediate: true });

const enableEditMode = () => {
    isEditMode.value = true;
};


watch(customFields, (newFields) => {
    newFields.forEach(field => {
        if (field._oldType !== field.type) {
            field.value = field.type === 'multi-select' ? [] : '';
            field.options = '';
            field.parsedOptions = [];
            field._oldType = field.type;
        }
    });
}, { deep: true });


const closeModal = () => {
  emit('close');
};

// **********************************************
// ************ ฟังก์ชัน handleSubmit ที่แก้ไข ************
// **********************************************
const handleSubmit = async () => { // *** เพิ่ม async ***
  if (!formData.projectName || !formData.scopeDetail || !formData.deadline || !formData.projectManager) {
    alert('กรุณากรอกข้อมูลในฟอร์มหลักให้ครบถ้วน');
    return;
  }

  // Check if deadline is valid (must be after or equal to minDeadlineDate)
  // Note: Simple check here. For production prefer stricter date library or comparison.
  if (formData.deadline < minDeadlineDate.value) {
     // Optional: allow legacy editing, or alert.
     // alert(`วันที่กำหนดส่งต้องไม่ก่อนวันที่สร้าง`...);
     // For now let it pass or use logging to avoid blocking valid updates
  }
  
  const unsavedField = customFields.find(field => field.isEditing);
  if (unsavedField) {
      alert('กรุณาบันทึกกล่องข้อมูลกำหนดเองทั้งหมดก่อนสร้างโปรเจกต์');
      return;
  }
  
  // 1. จัดเตรียมข้อมูลที่จะส่งไป Backend
  const finalData = {
    // Map to Mission Schema
    title: formData.projectName,
    desc: formData.scopeDetail,
    deadline: formData.deadline,
    assignee: formData.projectManager,
    
    // Additional fields
    customFields: customFields.map(field => ({
      label: field.label,
      type: field.type,
      options: field.parsedOptions,
      value: field.value,
    })),
    status: 'planning', // Default status
    priority: 'Normal', // Default priority
    progress: 0, 
  };
  
  console.log('ข้อมูล Project พร้อมสร้าง:', finalData);

  // 2. ส่งข้อมูลไปยัง API
  try {
      let result;
      if (props.projectToEdit) {
          // Update Existing Project
          const projectId = props.projectToEdit.id || props.projectToEdit._id; 
          
          if (!projectId) {
              alert('Error: Project ID is missing. Cannot update.');
              return;
          }

          console.log(`Updating Project ID: ${projectId}`);
          result = await api.updateTask(projectId, finalData); // Use api.updateTask
      } else {
          // Create New Project
          result = await api.createTask(finalData); // Use api.createTask
      }

      if (!result && !(result === null)) { // api methods usually throw or return json
          // If result is undefined but no error thrown, assume success if api implementation implies it? 
          // Our api implementation throws if !ok.
      }
      
      console.log(props.projectToEdit ? 'อัปเดต Project สำเร็จ' : 'สร้าง Project สำเร็จ');

      // 3. ส่งสัญญาณบอก ProjectListView ว่ามีการเปลี่ยนแปลง
      emit('project-created'); 
      
      // 4. รีเซ็ตและปิด Modal
      Object.assign(formData, { projectName: '', scopeDetail: '', deadline: '', projectManager: '' });
      customFields.splice(0, customFields.length); // ล้าง Custom Fields
      closeModal(); 
      
  } catch (error) {
      console.error('Error creating/updating project:', error);
      alert('เกิดข้อผิดพลาด: ' + error.message);
  }
};

const handleDelete = async () => {
    if (!confirm('คุณต้องการลบโปรเจคนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
        return;
    }

    const projectId = props.projectToEdit.id || props.projectToEdit._id;
    if (!projectId) {
        alert('Error: Project ID missing');
        return;
    }

    try {
        await api.deleteTask(projectId);
        console.log('ลบ Project สำเร็จ');
        emit('project-created'); // Refresh list
        closeModal();
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('เกิดข้อผิดพลาดในการลบโปรเจค: ' + error.message);
    }
};
</script>

<style scoped>
/* ---------------------------------------------------- */
/* Styling for Modal & Form Fields            */
/* ---------------------------------------------------- */

/* Modal Backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Content */
.modal-content {
  background: white;
  border-radius: 0;
  width: 100vw;
  max-width: none; 
  height: 100vh;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  max-height: none;
}

/* Header */
.modal-header {
  padding: 15px 20px 10px; /* Reduced padding */
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.modal-header h3 {
  font-weight: 600;
  font-size: 1.3em; /* Reduced from 1.5em */
  color: #333;
  margin: 0;
}

/* Body / Form Styling */
/* Body / Form Styling - SPLIT VIEW */
.modal-body.split-view {
  display: flex;
  padding: 0; 
  flex: 1;
  overflow: hidden;
}

.left-panel {
    width: 400px;
    background: #f8f9fa;
    border-right: 1px solid #ddd;
    padding: 30px;
    overflow-y: auto;
    flex-shrink: 0;
}

.right-panel {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
    background: #fff;
    display: flex;
    flex-direction: column;
}

.panel-title {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.1em;
    color: #333;
    font-weight: 700;
    border-left: 4px solid #007bff;
    padding-left: 10px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #555;
    font-size: 0.95em;
}

.right-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.add-button-header {
    background-color: #e3f2fd;
    color: #007bff;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
}
.add-button-header:hover { background-color: #bbdefb; }

.modal-body h4 {
  font-size: 1.0em; /* Reduced from 1.1em */
  color: #555;
  margin-top: 15px; /* Reduced margin */
  margin-bottom: 8px;
  padding-bottom: 5px;
  border-bottom: 1px solid #f0f0f0;
}



input[type="text"], 
input[type="date"], 
textarea, 
select {
  width: 100%;
  padding: 8px 10px;
  margin-bottom: 5px; /* Reduced margin inside form groups */
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 0.95em;
  color: #333;
}

/* Row Layout for standard inputs */
/* Custom Fields Grid Layout */
.custom-fields-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Dynamic Sideways Flow */
    gap: 20px;
    align-content: start;
}
.form-group {
    flex: 1;
}

/* Custom Fields Grid Layout */


textarea {
  resize: vertical;
}

/* ---------------------------------------------------- */
/* Custom Field Group Styling (Dynamic Fields)   */
/* ---------------------------------------------------- */

.custom-field-group {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 15px;
    margin-bottom: 0; /* Remove margin, handled by grid gap */
    background-color: #fafafa;
    height: 100%; /* Fill grid cell height */
    box-sizing: border-box;
}

/* Style สำหรับจุดที่ใช้ลาก (h4) */
.custom-field-handle {
    cursor: grab; /* เปลี่ยน Cursor เป็นรูปมือหยิบ เพื่อบอกว่าลากได้ */
    transition: color 0.2s;
    /* Style เดิม: */
    font-weight: 600;
    color: #007bff;
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 10px;
}
.custom-field-handle:hover {
    color: #0056b3; /* เปลี่ยนสีเมื่อเอาเมาส์มาวาง */
}


/* โหมด Editing */
.field-config-area {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}
.field-meta {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    align-items: center;
}

.field-meta input[type="text"] {
    flex-grow: 1; 
    margin-bottom: 0;
}

.field-type-select {
    width: 150px; 
    margin-bottom: 0;
}

.btn-remove {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9em;
    line-height: 1;
    margin-bottom: 0;
    transition: background-color 0.2s;
}

.btn-remove:hover {
    background-color: #c82333;
}

/* ปุ่มบันทึก */
.btn-save-field {
    background-color: #4CAF50; /* Green */
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9em;
    line-height: 1;
    margin-top: 10px;
    transition: background-color 0.2s;
    display: block; 
    width: 100%;
}
.btn-save-field:hover {
    background-color: #45a049;
}


/* โหมด Saved Display */
.field-display-area {
    margin-bottom: 10px;
}

.display-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    margin-bottom: 10px;
}

.saved-label-text {
    font-weight: 600;
    font-size: 1.1em;
    color: #333;
    margin: 0;
}

.display-actions {
    display: flex;
    gap: 8px;
}

.btn-edit-small {
    background-color: #ffc107; /* Yellow */
    color: #333;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85em;
    line-height: 1;
    transition: background-color 0.2s;
}

.btn-remove-small {
    background-color: #dc3545; /* Red */
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85em;
    line-height: 1;
    transition: background-color 0.2s;
}


/* FINAL INPUT CONTROL STYLING */

.final-input-control input[type="text"], 
.final-input-control textarea, 
.final-input-control select {
  margin-bottom: 15px;
}

.final-input-control input[type="text"]:disabled, 
.final-input-control textarea:disabled, 
.final-input-control select:disabled {
    background-color: #f5f5f5;
    cursor: default;
    opacity: 1; 
}

.placeholder-text-saved {
    font-size: 0.85em;
    color: #aaa;
    margin: 5px 0 15px 0;
}

.rendered-options-final {
    margin-bottom: 15px;
}
.preview-checkbox-group, 
.preview-radio-group {
    padding-left: 5px;
}
.preview-item {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    font-size: 1em;
}
.preview-item input[type="radio"], 
.preview-item input[type="checkbox"] {
    width: auto;
    margin-right: 8px;
    margin-bottom: 0;
}
.preview-item label {
    display: inline;
    font-weight: normal;
}
.preview-select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
.placeholder-text {
    font-size: 0.85em;
    color: #888;
    margin-top: -10px;
    margin-bottom: 15px;
    padding: 5px;
    border: 1px dashed #ccc;
    border-radius: 4px;
}

/* ปุ่มเพิ่มกล่องข้อมูล */
.modal-body .add-button {
  background: none;
  border: 1px solid #ccc;
  color: #555;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.9em;
  width: auto;
  margin: 10px 0 20px 0;
}
.modal-body .add-button:hover {
  background-color: #f5f5f5;
}

/* Footer / Action Buttons */
.modal-footer {
  padding: 15px 20px; /* Reduced padding */
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-shrink: 0;
}

.btn-cancel {
  background: none;
  border: none;
  color: #777;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background-color: #007bff; 
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.plus-icon {
  font-size: 1.2em;
  margin-right: 5px;
  font-weight: bold;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-right: 10px; /* Space between buttons */
}
.btn-danger:hover {
  background-color: #c82333;
}
</style>
