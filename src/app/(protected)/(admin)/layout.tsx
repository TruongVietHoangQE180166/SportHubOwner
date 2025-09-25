import AuthGuard from '../../../components/guards/AuthGuard'
import RoleGuard from '../../../components/guards/RoleGuard'
import MainLayout from '../../../components/pages/MainLayout'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['ADMIN']}>
        <MainLayout>
          {children}
        </MainLayout>
      </RoleGuard>
    </AuthGuard>
  )
}