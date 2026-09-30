export const STATUS_LABEL = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

// Tanggal hari ini format YYYY-MM-DD
export const today = () => new Date().toISOString().slice(0, 10)

// Progress project = persen task yang berstatus done
export function getProgress(tasks) {
  if (tasks.length === 0) return 0
  const done = tasks.filter((t) => t.status === 'done').length
  return Math.round((done / tasks.length) * 100)
}

export function isOverdue(task) {
  return task.status !== 'done' && task.deadline && task.deadline < today()
}