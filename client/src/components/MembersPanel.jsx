import { useState } from 'react'
import { useDataStore } from '../store/dataStore'
import { users, getUser } from '../data/users'
import { getProjectUserIds } from '../utils/helpers'

export default function MembersPanel({ project, canManage }) {
  const { addMember, removeMember } = useDataStore()
  const members = useDataStore((s) => s.members)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const memberUsers = getProjectUserIds(project, members).map(getUser).filter(Boolean)

  const handleInvite = (e) => {
    e.preventDefault()
    setError('')

    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())

    if (!found) return setError('Email tidak terdaftar.')
    if (found.role !== 'student') return setError('Hanya mahasiswa yang bisa diundang.')
    if (memberUsers.some((u) => u.id === found.id)) return setError('Orang ini sudah menjadi anggota.')

    addMember(project.id, found.id)
    setEmail('')
  }

  return (
    <div className="space-y-4">
      {canManage && (
        <form onSubmit={handleInvite} className="bg-white rounded-xl shadow p-4 space-y-2">
          <p className="text-sm font-medium">Undang anggota</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email mahasiswa"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
              Undang
            </button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <p className="text-xs text-gray-400">Coba: ani@kampus.ac.id atau citra@kampus.ac.id</p>
        </form>
      )}

      <div className="bg-white rounded-xl shadow divide-y">
        {memberUsers.map((u) => {
          const isOwner = u.id === project.ownerId
          return (
            <div key={u.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full ${isOwner ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                  {isOwner ? 'Owner' : 'Anggota'}
                </span>
                {canManage && !isOwner && (
                  <button
                    onClick={() => window.confirm(`Keluarkan ${u.name}?`) && removeMember(project.id, u.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Keluarkan
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}