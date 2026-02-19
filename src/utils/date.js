export const formatDate = (dateString) => {
    if (!dateString) return 'ไม่ระบุ';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'ไม่ระบุ';
    // Use Thai locale with full year and short month
    return d.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

export const formatDateFull = (dateString) => {
    if (!dateString) return 'ไม่มีข้อมูล';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'ไม่มีข้อมูล';
    return d.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export const isOverdue = (deadline, progress = 0) => {
    if (!deadline) return false;
    if (Number(progress) >= 100) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(deadline);
    due.setHours(0, 0, 0, 0);
    return today > due;
}

export const formatThaiDateShort = (dateStr) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).replace('พ.ศ. ', '');
}

export const formatThaiDateLong = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).replace('พ.ศ. ', '');
}

export const formatThaiTime = (dateStr) => {
    if (!dateStr) return '00:00';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}
