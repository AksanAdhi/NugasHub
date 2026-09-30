import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialProjects = [
  { id: 1, title: 'Aplikasi Absensi', description: 'Sistem absensi berbasis web untuk kelas.', deadline: '2026-12-15', ownerId: 1 },
  { id: 2, title: 'Website Portofolio', description: 'Tugas akhir mata kuliah Web Programming.', deadline: '2026-11-20', ownerId: 1 },
  { id: 3, title: 'Penelitian IoT', description: 'Monitoring suhu ruangan dengan sensor.', deadline: '2026-12-30', ownerId: 3 },
]

const initialTasks = [
  { id: 1, projectId: 1, title: 'Desain database', status: 'done', deadline: '2026-10-05', assigneeId: 1 },
  { id: 2, projectId: 1, title: 'Buat halaman login', status: 'in_progress', deadline: '2026-10-20', assigneeId: 3 },
  { id: 3, projectId: 1, title: 'Buat laporan absensi', status: 'todo', deadline: '2026-11-15', assigneeId: 4 },
  { id: 4, projectId: 2, title: 'Rancang wireframe', status: 'done', deadline: '2026-09-25', assigneeId: 1 },
  { id: 5, projectId: 2, title: 'Coding halaman utama', status: 'todo', deadline: '2026-10-10', assigneeId: 1 },
  { id: 6, projectId: 3, title: 'Pilih sensor', status: 'in_progress', deadline: '2026-10-15', assigneeId: 3 },
]

export const useDataStore = create(
  persist(
    (set) => ({
      projects: initialProjects,
      tasks: initialTasks,

      // ---- Project ----
      addProject: (data) =>
        set((s) => ({ projects: [...s.projects, { ...data, id: Date.now() }] })),

      updateProject: (id, data) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),

      deleteProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          tasks: s.tasks.filter((t) => t.projectId !== id), // task ikut terhapus
        })),

      // ---- Task ----
      addTask: (data) =>
        set((s) => ({ tasks: [...s.tasks, { ...data, id: Date.now(), status: 'todo' }] })),

      updateTask: (id, data) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),

      updateTaskStatus: (id, status) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
    }),
    { name: 'data-storage' }
  )
)