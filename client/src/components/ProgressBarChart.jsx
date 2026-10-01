import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getProgress } from '../utils/helpers'

const shorten = (text) => (text.length > 14 ? text.slice(0, 14) + '…' : text)

export default function ProgressBarChart({ projects, tasks }) {
  const data = projects.map((p) => ({
    name: shorten(p.title),
    fullName: p.title,
    progress: getProgress(tasks.filter((t) => t.projectId === p.id)),
  }))

  if (data.length === 0) {
    return <p className="text-sm text-gray-400 py-10 text-center">Belum ada project.</p>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value) => [`${value}%`, 'Progress']}
            labelFormatter={(_, payload) => payload?.[0]?.payload.fullName}
          />
          <Bar dataKey="progress" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}