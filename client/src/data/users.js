export const users = [
  { id: 1, name: 'Budi Mahasiswa', role: 'student' },
  { id: 2, name: 'Bu Sari Dosen', role: 'lecturer' },
  { id: 3, name: 'Ani Lestari', role: 'student' },
  { id: 4, name: 'Citra Dewi', role: 'student' },
]

export const students = users.filter((u) => u.role === 'student')

export const getUserName = (id) => users.find((u) => u.id === id)?.name ?? '-'