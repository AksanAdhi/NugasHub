import { STATUS_LABEL } from '../utils/helpers'

const colors = {
  todo: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${colors[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
} 