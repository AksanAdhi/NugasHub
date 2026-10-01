import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'

export function useMyData() {
  const user = useAuthStore((s) => s.user)
  const allProjects = useDataStore((s) => s.projects)
  const allTasks = useDataStore((s) => s.tasks)
  const members = useDataStore((s) => s.members)

  // Mahasiswa: project miliknya + project yang dia ikuti sebagai anggota.
  // Dosen/admin: semua project.
  const projects =
    user.role === 'student'
      ? allProjects.filter(
          (p) =>
            p.ownerId === user.id ||
            members.some((m) => m.projectId === p.id && m.userId === user.id)
        )
      : allProjects

  const ids = projects.map((p) => p.id)
  const tasks = allTasks.filter((t) => ids.includes(t.projectId))

  return { user, projects, tasks }
}