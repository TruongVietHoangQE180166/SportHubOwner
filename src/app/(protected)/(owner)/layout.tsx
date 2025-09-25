import AuthGuard from '../../../components/guards/AuthGuard'
import RoleGuard from '../../../components/guards/RoleGuard'
import MainLayout from '../../../components/pages/MainLayout'

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['OWNER']}>
        <MainLayout>
          {children}
        </MainLayout>
      </RoleGuard>
    </AuthGuard>
  )
}