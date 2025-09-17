import AuthGuard from '../../components/guards/AuthGuard'
import RoleGuard from '../../components/guards/RoleGuard'
import MainLayout from '../../components/pages/MainLayout'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin', 'owner']}>
        <MainLayout>
          {children}
        </MainLayout>
      </RoleGuard>
    </AuthGuard>
  )
}