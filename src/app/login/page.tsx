import AuthPage from '../../components/pages/AuthPage'
import ReverseAuthGuard from '../../components/guards/ReverseAuthGuard'

export default function LoginPage() {
  return (
    <ReverseAuthGuard>
      <AuthPage />
    </ReverseAuthGuard>
  )
}