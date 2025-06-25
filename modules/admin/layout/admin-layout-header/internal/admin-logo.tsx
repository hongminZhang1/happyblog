import { Code } from 'lucide-react'
import Link from 'next/link'

function AdminLogo() {
  return (
    <Link
      className="flex items-center gap-1 hover:underline"
      href="/"
    >
      <h2 className="font-bold">后台管理系统</h2>
      <Code size={18} />
    </Link>
  )
}

export default AdminLogo
