import { useRef, useState } from 'react'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'
import { getUserName } from '../data/users'
import { formatSize, formatDateTime } from '../utils/helpers'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export default function DocumentsPanel({ project, canUpload, isOwner }) {
  const user = useAuthStore((s) => s.user)
  const { addDocument, deleteDocument } = useDataStore()
  const documents = useDataStore((s) => s.documents).filter((d) => d.projectId === project.id)

  const fileRef = useRef(null)
  const [error, setError] = useState('')

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setError('')

    if (file.size > MAX_SIZE) {
      setError('Ukuran file maksimal 5 MB.')
    } else {
      // Simulasi: hanya simpan informasi file, bukan isinya
      addDocument({
        projectId: project.id,
        name: file.name,
        size: file.size,
        uploadedBy: user.id,
      })
    }
    e.target.value = '' // supaya file yang sama bisa dipilih lagi
  }

  return (
    <div className="space-y-4">
      {canUpload && (
        <div className="bg-white rounded-xl shadow p-4 space-y-2">
          <input ref={fileRef} type="file" onChange={handleFile} className="hidden" />
          <button
            onClick={() => fileRef.current.click()}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            + Upload dokumen
          </button>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <p className="text-xs text-gray-400">
            Mode simulasi: hanya nama dan ukuran file yang disimpan. File asli baru tersimpan setelah ada backend.
          </p>
        </div>
      )}

      {documents.length === 0 ? (
        <p className="text-gray-400 text-sm">Belum ada dokumen.</p>
      ) : (
        <div className="bg-white rounded-xl shadow divide-y">
          {documents.map((d) => (
            <div key={d.id} className="p-4 flex justify-between items-center gap-3">
              <div className="min-w-0">
                <p className="font-medium truncate">📄 {d.name}</p>
                <p className="text-xs text-gray-500">
                  {formatSize(d.size)} · {getUserName(d.uploadedBy)} · {formatDateTime(d.uploadedAt)}
                </p>
              </div>
              {canUpload && (isOwner || d.uploadedBy === user.id) && (
                <button
                  onClick={() => window.confirm('Hapus dokumen ini?') && deleteDocument(d.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Hapus
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}