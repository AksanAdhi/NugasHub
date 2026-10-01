import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { STATUS_LABEL } from '../utils/helpers'

const COLORS = {
  todo: '#9ca3af',
  in_progress: '#eab308',
  done: '#22c55e',
}

export default function StatusPieChart({ tasks }) {
  // Ubah daftar task menjadi [{ key, name, value }], buang yang nol
  const data = Object.keys(STATUS_LABEL)
    .map((key) => ({
      key,
      name: STATUS_LABEL[key],
      value: tasks.filter((t) => t.status === key).length,
    }))
    .filter((d) => d.value > 0)

  if (data.length === 0) {
    return <p className="text-sm text-gray-400 py-10 text-center">Belum ada data task.</p>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
            {data.map((d) => (
              <Cell key={d.key} fill={COLORS[d.key]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}