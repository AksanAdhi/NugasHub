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

// Owner tidak dimasukkan ke sini, owner sudah tercatat di projects.ownerId
const initialMembers = [
  { projectId: 1, userId: 3 },
  { projectId: 1, userId: 4 },
  { projectId: 3, userId: 1 },
]

const initialDocuments = [
  { id: 1, projectId: 1, name: 'proposal-absensi.pdf', size: 245760, uploadedBy: 1, uploadedAt: '2026-09-28T09:00:00.000Z' },
]

const initialComments = [
  { id: 1, projectId: 1, userId: 2, content: 'Tolong lengkapi rancangan database sebelum minggu depan.', createdAt: '2026-09-29T10:15:00.000Z' },
]

export const useDataStore = create(
  persist(
    (set) => ({
      projects: initialProjects,
      tasks: initialTasks,
      members: initialMembers,
      documents: initialDocuments,
      comments: initialComments,

      // ---- Project ----
      addProject: (data) =>
        set((s) => ({ projects: [...s.projects, { ...data, id: Date.now() }] })),

      updateProject: (id, data) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),

      // Hapus project = hapus juga semua data yang terkait
      deleteProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          tasks: s.tasks.filter((t) => t.projectId !== id),
          members: s.members.filter((m) => m.projectId !== id),
          documents: s.documents.filter((d) => d.projectId !== id),
          comments: s.comments.filter((c) => c.projectId !== id),
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

      // ---- Anggota ----
      addMember: (projectId, userId) =>
        set((s) => ({ members: [...s.members, { projectId, userId }] })),

      // Anggota dikeluarkan: task miliknya jadi "belum ditugaskan"
      removeMember: (projectId, userId) =>
        set((s) => ({
          members: s.members.filter(
            (m) => !(m.projectId === projectId && m.userId === userId)
          ),
          tasks: s.tasks.map((t) =>
            t.projectId === projectId && t.assigneeId === userId
              ? { ...t, assigneeId: null }
              : t
          ),
        })),

      // ---- Dokumen (simulasi: hanya metadata) ----
      addDocument: (data) =>
        set((s) => ({
          documents: [
            ...s.documents,
            { ...data, id: Date.now(), uploadedAt: new Date().toISOString() },
          ],
        })),

      deleteDocument: (id) =>
        set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),

      // ---- Komentar ----
      addComment: (data) =>
        set((s) => ({
          comments: [
            ...s.comments,
            { ...data, id: Date.now(), createdAt: new Date().toISOString() },
          ],
        })),
    }),
    { name: 'data-storage' }
  )
)