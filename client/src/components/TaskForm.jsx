import { useState } from 'react'
import { useDataStore } from '../store/dataStore'
import { students } from '../data/users'

// projects : daftar project yang boleh dipilih
// projectId: kalau diisi, pilihan project disembunyikan (dipakai di halaman detail)
// task     : kalau diisi, form berubah jadi mode Edit
export default function TaskForm({ projects, projectId, task, onClose }) {
  const { addTask, updateTask } = useDataStore()

  const [form, setForm] = useState({
    title: task?.title ?? '',
    projectId: task?.projectId ?? projectId ?? projects[0]?.id ?? '',
    assigneeId: task?.assigneeId ?? '',
    deadline: task?.deadline ?? '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

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
          <select name="projectId" value={form.projectId} onChange={handleChange} className={input}>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        )}

        <select name="assigneeId" value={form.assigneeId} onChange={handleChange} className={input}>
          <option value="">-- Belum ditugaskan --</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
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