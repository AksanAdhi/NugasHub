import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'

export default function ProjectFormPage() {
  const { id } = useParams() // ada di /projects/:id/edit, kosong di /projects/new
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { projects, addProject, updateProject } = useDataStore()

  const existing = id ? projects.find((p) => p.id === Number(id)) : null
  const isEdit = Boolean(existing)

  const [form, setForm] = useState({
    title: existing?.title ?? '',
    description: existing?.description ?? '',
    deadline: existing?.deadline ?? '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEdit) {
      updateProject(existing.id, form)
      navigate(`/projects/${existing.id}`)
    } else {
      addProject({ ...form, ownerId: user.id })
      navigate('/projects')
    }
  }

  const input = 'w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 max-w-xl space-y-4">
      <h1 className="text-xl font-bold">{isEdit ? 'Edit Project' : 'Buat Project Baru'}</h1>

      <input name="title" placeholder="Judul project" value={form.title}
        onChange={handleChange} className={input} required />
      <textarea name="description" placeholder="Deskripsi" rows={4} value={form.description}
        onChange={handleChange} className={input} />
      <div>
        <label className="text-sm text-gray-500">Deadline project</label>
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className={input} />
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded border">Batal</button>
        <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Simpan</button>
      </div>
    </form>
  )
}