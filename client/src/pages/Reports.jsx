import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMyData } from '../hooks/useMyData'
import { useDataStore } from '../store/dataStore'
import { getUserName } from '../data/users'
import {
  getProgress,
  getProjectStatus,
  isOverdue,
  downloadCSV,
  today,
  PROJECT_STATUS_LABEL,
} from '../utils/helpers'

const badgeColor = {
  selesai: 'bg-green-100 text-green-700',
  berjalan: 'bg-blue-100 text-blue-700',
  terlambat: 'bg-red-100 text-red-700',
}

export default function Reports() {
  const { projects, tasks } = useMyData() // untuk dosen: semua project
  const members = useDataStore((s) => s.members)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Satu baris laporan per project
  const rows = projects.map((p) => {
    const pt = tasks.filter((t) => t.projectId === p.id)
    return {
      id: p.id,
      title: p.title,
      owner: getUserName(p.ownerId),
      memberCount: members.filter((m) => m.projectId === p.id).length + 1,
      taskCount: pt.length,
      doneCount: pt.filter((t) => t.status === 'done').length,
      overdueCount: pt.filter(isOverdue).length,
      progress: getProgress(pt),
      deadline: p.deadline || '-',
      status: getProjectStatus(pt),
    }
  })

  const shown = rows.filter(
    (r) =>
      (statusFilter === 'all' || r.status === statusFilter) &&
      (r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.owner.toLowerCase().includes(search.toLowerCase()))
  )

  const handleExport = () => {
    const header = ['Project', 'Pemilik', 'Anggota', 'Total Task', 'Task Selesai', 'Task Terlambat', 'Progress (%)', 'Deadline', 'Status']
    const body = shown.map((r) => [
      r.title, r.owner, r.memberCount, r.taskCount, r.doneCount,
      r.overdueCount, r.progress, r.deadline, PROJECT_STATUS_LABEL[r.status],
    ])
    downloadCSV(`laporan-project-${today()}.csv`, [header, ...body])
  }

  const countBy = (status) => rows.filter((r) => r.status === status).length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-2xl font-bold">Laporan Project</h1>
        <button
          onClick={handleExport}
          disabled={shown.length === 0}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
        >
          ⬇ Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Object.keys(PROJECT_STATUS_LABEL).map((key) => (
          <div key={key} className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">{PROJECT_STATUS_LABEL[key]}</p>
            <p className="text-3xl font-bold">{countBy(key)}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          placeholder="Cari project atau pemilik..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="all">Semua status</option>
          {Object.entries(PROJECT_STATUS_LABEL).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Project</th>
              <th className="p-3">Pemilik</th>
              <th className="p-3 text-center">Anggota</th>
              <th className="p-3 text-center">Task</th>
              <th className="p-3 text-center">Terlambat</th>
              <th className="p-3">Progress</th>
              <th className="p-3">Deadline</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {shown.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-400">
                  Tidak ada project yang cocok.
                </td>
              </tr>
            )}
            {shown.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="p-3 font-medium">
                  <Link to={`/projects/${r.id}`} className="text-blue-600 hover:underline">
                    {r.title}
                  </Link>
                </td>
                <td className="p-3">{r.owner}</td>
                <td className="p-3 text-center">{r.memberCount}</td>
                <td className="p-3 text-center">{r.doneCount}/{r.taskCount}</td>
                <td className={`p-3 text-center ${r.overdueCount > 0 ? 'text-red-500 font-medium' : ''}`}>
                  {r.overdueCount}
                </td>
                <td className="p-3 min-w-32">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${r.progress}%` }} />
                    </div>
                    <span className="text-xs w-9 text-right">{r.progress}%</span>
                  </div>
                </td>
                <td className="p-3 whitespace-nowrap">{r.deadline}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${badgeColor[r.status]}`}>
                    {PROJECT_STATUS_LABEL[r.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400">
        Menampilkan {shown.length} dari {rows.length} project. Export CSV mengikuti filter yang aktif.
      </p>
    </div>
  )
}