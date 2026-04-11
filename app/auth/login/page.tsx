import { LoginForm } from '@/components/forms/AuthForms';
import { Card } from '@/components/ui';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-4">
            <img src="/logo.png" alt="" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bienvenue</h1>
          <p className="text-gray-500 mt-2 font-medium">Connectez-vous à votre espace Fundraising</p>
        </div>
        
        <Card className="">
          <LoginForm />
        </Card>
        
        <p className="text-center mt-6 text-sm text-gray-500 font-medium">
          Pas encore de compte ?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-all">
            Inscrivez-vous ici
          </Link>
        </p>
      </div>
    </div>

  );
}
