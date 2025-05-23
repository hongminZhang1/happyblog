import { ModalProvider } from '@/components/provider/modal-provider'
import { Toaster } from '@/components/ui/sonner'
import { ADMIN_ONLY } from '@/config/constant'
import { noPermission } from '@/lib/auth'
import AdminNavbar from '@/modules/admin/layout/admin-layout-header'
import { SessionProvider } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // * config/constant/index.ts 中配置了只允许 admin 访问后台
  if (ADMIN_ONLY && (await noPermission())) {
    redirect('/')
  }

  return (
    <SessionProvider>
      <main className="flex flex-col min-h-screen max-w-screen dark:bg-black dark:text-white">
        <AdminNavbar />
        <div className="flex-1 px-6 flex mt-2">
          <main className="flex-1 flex">{children}</main>
        </div>
        <ModalProvider />
        <Toaster position="top-center" richColors />
      </main>
    </SessionProvider>
  )
}
