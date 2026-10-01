// ===== Versi 1 =====
export const STATUS_LABEL = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

// Tanggal hari ini format YYYY-MM-DD
export const today = () => new Date().toISOString().slice(0, 10)

// Progress project = persen task yang berstatus done
export function getProgress(tasks) {
  if (tasks.length === 0) return 0
  const done = tasks.filter((t) => t.status === 'done').length
  return Math.round((done / tasks.length) * 100)
}

export function isOverdue(task) {
  return task.status !== 'done' && task.deadline && task.deadline < today()
}

// ===== Versi 2 =====
export const ROLE_LABEL = {
  student: 'Mahasiswa',
  lecturer: 'Dosen',
  admin: 'Admin',
}

// Ukuran file: 1536000 -> "1.5 MB"
export function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// "2026-10-01T08:30:00.000Z" -> "1 Okt 2026, 15.30"
export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Daftar id user yang tergabung di sebuah project (owner + anggota)
export function getProjectUserIds(project, members) {
  const memberIds = members
    .filter((m) => m.projectId === project.id)
    .map((m) => m.userId)
  return [project.ownerId, ...memberIds]
}

// ===== Versi 3 =====
export const PROJECT_STATUS_LABEL = {
  selesai: 'Selesai',
  berjalan: 'Berjalan',
  terlambat: 'Terlambat',
}

// Status project dihitung dari task-nya (tidak disimpan)
export function getProjectStatus(projectTasks) {
  if (projectTasks.length > 0 && projectTasks.every((t) => t.status === 'done')) {
    return 'selesai'
  }
  if (projectTasks.some(isOverdue)) return 'terlambat'
  return 'berjalan'
}

// rows = array dari array, baris pertama biasanya header
export function downloadCSV(filename, rows) {
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = rows.map((row) => row.map(escape).join(',')).join('\n')

  // '\uFEFF' membuat Excel membaca huruf dengan benar
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}