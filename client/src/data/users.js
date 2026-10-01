export const users = [
  { id: 1, name: 'Budi Mahasiswa', email: 'mhs@kampus.ac.id', role: 'student' },
  { id: 2, name: 'Bu Sari Dosen', email: 'dosen@kampus.ac.id', role: 'lecturer' },
  { id: 3, name: 'Ani Lestari', email: 'ani@kampus.ac.id', role: 'student' },
  { id: 4, name: 'Citra Dewi', email: 'citra@kampus.ac.id', role: 'student' },
]

export const getUser = (id) => users.find((u) => u.id === id)

export const getUserName = (id) => getUser(id)?.name ?? '-'