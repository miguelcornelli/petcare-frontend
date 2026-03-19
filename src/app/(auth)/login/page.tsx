import { LoginForm } from '@/components/forms/LoginForm'
import { PawPrint } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl shadow-lg mb-4">
            <PawPrint size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PetCare</h1>
          <p className="text-gray-500 text-sm mt-1">Saúde do seu pet, na palma da mão</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Entrar na conta</h2>
          <LoginForm />
          <p className="text-center text-sm text-gray-500 mt-4">
            Não tem conta?{' '}
            <a href="/register" className="text-emerald-600 font-medium hover:underline">Cadastre-se</a>
          </p>
        </div>
      </div>
    </div>
  )
}
