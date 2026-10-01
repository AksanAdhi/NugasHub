import { useState } from 'react'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'
import { getUser } from '../data/users'
import { ROLE_LABEL, formatDateTime } from '../utils/helpers'

export default function CommentsPanel({ project, canComment }) {
  const user = useAuthStore((s) => s.user)
  const addComment = useDataStore((s) => s.addComment)
  const comments = useDataStore((s) => s.comments).filter((c) => c.projectId === project.id)
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    addComment({ projectId: project.id, userId: user.id, content: text.trim() })
    setText('')
  }

  return (
    <div className="space-y-4">
      {comments.length === 0 && <p className="text-gray-400 text-sm">Belum ada komentar.</p>}

      <div className="space-y-3">
        {comments.map((c) => {
          const author = getUser(c.userId)
          const isLecturer = author?.role !== 'student'
          return (
            <div
              key={c.id}
              className={`rounded-xl p-4 shadow ${isLecturer ? 'bg-amber-50 border border-amber-200' : 'bg-white'}`}
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{author?.name ?? 'Pengguna dihapus'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {ROLE_LABEL[author?.role]}
                </span>
                <span className="text-xs text-gray-400 ml-auto">{formatDateTime(c.createdAt)}</span>
              </div>
              <p className="mt-2 text-gray-700 whitespace-pre-wrap">{c.content}</p>
            </div>
          )
        })}
      </div>

      {canComment && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 space-y-2">
          <textarea
            rows={3}
            placeholder="Tulis komentar..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
            Kirim
          </button>
        </form>
      )}
    </div>
  )
}