import React from 'react';
import { SponsorLoginForm } from '@/components/forms/AuthForms';
import Link from 'next/link';

export default function SponsorLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Espace Sponsor</h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous pour gérer vos contributions d'impact
          </p>
        </div>

        <SponsorLoginForm />

        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Retour à la connexion standard
          </Link>
        </div>
      </div>
    </div>
  );
}
