import { useState } from 'react'
import { useDataStore } from '../store/dataStore'
import { getUser } from '../data/users'
import { getProjectUserIds } from '../utils/helpers'

export default function TaskForm({ projects, projectId, task, onClose }) {
  const { addTask, updateTask } = useDataStore()
  const members = useDataStore((s) => s.members)

  const [form, setForm] = useState({
    title: task?.title ?? '',
    projectId: task?.projectId ?? projectId ?? projects[0]?.id ?? '',
    assigneeId: task?.assigneeId ?? '',
    deadline: task?.deadline ?? '',
  })

  // Pilihan penanggung jawab = owner + anggota dari project yang dipilih
  const selectedProject = projects.find((p) => p.id === Number(form.projectId))
  const assignable = selectedProject
    ? getProjectUserIds(selectedProject, members).map(getUser).filter(Boolean)
    : []

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Kalau project diganti, penanggung jawab direset (anggotanya berbeda)
  const handleProjectChange = (e) =>
    setForm({ ...form, projectId: e.target.value, assigneeId: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      title: form.title,
      projectId: Number(form.projectId),
      assigneeId: form.assigneeId ? Number(form.assigneeId) : null,
      deadline: form.deadline,
    }
    if (task) updateTask(task.id, data)
    else addTask(data)
    onClose()
  }

  const input = 'w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-10">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 w-full max-w-md space-y-3">
        <h2 className="text-lg font-bold">{task ? 'Edit Task' : 'Task Baru'}</h2>

        <input name="title" placeholder="Judul task" value={form.title}
          onChange={handleChange} className={input} required />

        {!projectId && (
          <select name="projectId" value={form.projectId} onChange={handleProjectChange} className={input}>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        )}

        <select name="assigneeId" value={form.assigneeId} onChange={handleChange} className={input}>
          <option value="">-- Belum ditugaskan --</option>
          {assignable.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        <input type="date" name="deadline" value={form.deadline}
          onChange={handleChange} className={input} />

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Batal</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Simpan</button>
        </div>
      </form>
    </div>
  )
}