const dummyUsers = [
  { id: 1, name: 'Budi Mahasiswa', email: 'mhs@kampus.ac.id', password: '123456', role: 'student' },
  { id: 2, name: 'Bu Sari Dosen', email: 'dosen@kampus.ac.id', password: '123456', role: 'lecturer' },
  { id: 3, name: 'Ani Lestari', email: 'ani@kampus.ac.id', password: '123456', role: 'student' },
  { id: 4, name: 'Citra Dewi', email: 'citra@kampus.ac.id', password: '123456', role: 'student' },
]

export async function loginRequest({ email, password }) {
  await new Promise((r) => setTimeout(r, 600))

  const found = dummyUsers.find((u) => u.email === email && u.password === password)
  if (!found) throw new Error('Email atau password salah')

  const { password: _, ...user } = found
  return { user, token: 'fake-jwt-token' }
}