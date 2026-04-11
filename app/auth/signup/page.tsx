import { SignupForm } from '@/components/forms/AuthForms';
import { Card } from '@/components/ui';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-4">
            <img src="/logo.png" alt="" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Devenir Volontaire</h1>
          <p className="text-gray-500 mt-2 font-medium">Rejoignez la mission et commencez à collecter</p>
        </div>
        
        <Card className="">
          <SignupForm />
        </Card>
        
        <p className="text-center mt-6 text-sm text-gray-500 font-medium">
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-all">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
