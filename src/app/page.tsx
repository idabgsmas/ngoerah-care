import { redirect } from 'next/navigation'

export default function Home() {
  // Jika orang membuka alamat utama website, paksa masuk ke login dulu
  redirect('/login')
}