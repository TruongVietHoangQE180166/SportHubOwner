import AuthGuard from '../../components/guards/AuthGuard'
import MainLayout from '../../components/pages/MainLayout'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout is no longer used as we have specific layouts for OWNER and ADMIN roles
  // The role-specific layouts are in (owner)/layout.tsx and (admin)/layout.tsx
  return (
    <AuthGuard>
      <MainLayout>
        {children}
      </MainLayout>
    </AuthGuard>
  )
}