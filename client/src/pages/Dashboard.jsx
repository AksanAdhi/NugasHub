import { Link } from 'react-router-dom'
import { useMyData } from '../hooks/useMyData'
import { getProgress, isOverdue } from '../utils/helpers'
import StatusBadge from '../components/StatusBadge'
import StatusPieChart from '../components/StatusPieChart'
import ProgressBarChart from '../components/ProgressBarChart'

function Card({ label, value, color = 'text-blue-600' }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-semibold mb-2">{title}</h2>
      <div className="bg-white rounded-xl shadow p-4">{children}</div>
    </section>
  )
}

export default function Dashboard() {
  const { user, projects, tasks } = useMyData()

  const overdue = tasks.filter(isOverdue)
  const upcoming = tasks
    .filter((t) => t.status !== 'done' && t.deadline)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Halo, {user.name} 👋</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Total Project" value={projects.length} />
        <Card label="Total Task" value={tasks.length} />
        <Card label="Task Selesai" value={tasks.filter((t) => t.status === 'done').length} color="text-green-600" />
        <Card label="Terlambat" value={overdue.length} color="text-red-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Section title="Status task">
          <StatusPieChart tasks={tasks} />
        </Section>
        <Section title="Progress per project">
          <ProgressBarChart projects={projects} tasks={tasks} />
        </Section>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section>
          <h2 className="font-semibold mb-2">Deadline terdekat</h2>
          <div className="bg-white rounded-xl shadow divide-y">
            {upcoming.length === 0 && <p className="p-4 text-sm text-gray-400">Tidak ada task aktif.</p>}
            {upcoming.map((t) => (
              <div key={t.id} className="p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className={`text-xs ${isOverdue(t) ? 'text-red-500' : 'text-gray-500'}`}>{t.deadline}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Daftar project</h2>
          <div className="bg-white rounded-xl shadow divide-y">
            {projects.length === 0 && <p className="p-4 text-sm text-gray-400">Belum ada project.</p>}
            {projects.map((p) => (
              <Link key={p.id} to={`/projects/${p.id}`} className="p-3 flex justify-between hover:bg-gray-50">
                <span className="text-sm">{p.title}</span>
                <span className="text-sm font-medium">
                  {getProgress(tasks.filter((t) => t.projectId === p.id))}%
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}