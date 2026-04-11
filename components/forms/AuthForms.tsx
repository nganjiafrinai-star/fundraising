'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select } from '../ui';
import { signupVolunteer } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { volunteerSchema, VolunteerFormData } from '@/lib/validators/volunteer.schema';
import { countries } from '@/lib/countries';
import toast from 'react-hot-toast';

export const SignupForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid }
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema) as any,
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      country: '',
      password: 'password123', // Default for now
      amountGoal: 660000,
      donorsGoal: 22
    }
  });


  const onSubmit: SubmitHandler<VolunteerFormData> = async (data) => {
    // TODO: valider aussi côté backend (Express)
    try {
      const user = await signupVolunteer({
        ...data,
      });
      toast.success('🎉 Inscription réussie ! Bienvenue.');
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/dashboard/volunteer');
    } catch (error) {
      toast.error('❌ Une erreur est survenue');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Nom complet"
        placeholder="Jean Dupont"
        error={errors.name?.message}
        {...register('name')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="izinaryae@gmail.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Téléphone"
          placeholder="+257..."
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>
      
      <Select
        label="Mon pays de résidence"
        options={countries}
        error={errors.country?.message}
        {...register('country')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Objectif montant (BIF)"
          type="number"
          placeholder="Min. 660,000"
          error={errors.amountGoal?.message}
          {...register('amountGoal')}
        />

        <Input
          label="Objectif donateurs"
          type="number"
          placeholder="22"
          error={errors.donorsGoal?.message}
          {...register('donorsGoal')}
        />
      </div>
      <Button type="submit" disabled={isSubmitting || !isValid} className="w-full mt-4 transition-all">
        {isSubmitting ? 'Création...' : 'Créer mon compte'}
      </Button>
    </form>
  );
};

export const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'volunteer' | 'admin' | 'sponsor'>('volunteer');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (role === 'admin') {
        const ADMIN_PASSWORD = "amiel2007";
        if (password === ADMIN_PASSWORD) {
          localStorage.setItem('user', JSON.stringify({ email: 'admin@nova.io', role: 'admin' }));
          router.push('/dashboard/admin');
        } else {
          setError('Mot de passe incorrect');
        }
      } else if (role === 'sponsor') {
        const { loginSponsor } = await import('@/lib/api');
        const user = await loginSponsor(email);
        // Simulating password check
        if (user && (password === "123456" || password === "password123")) {
          localStorage.setItem('user', JSON.stringify(user));
          router.push('/dashboard/sponsor');
        } else {
          setError('Identifiants invalides pour sponsor');
        }
      } else {
        // Volunteer login
        const { loginVolunteer } = await import('@/lib/api');
        const user = await loginVolunteer(email);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          router.push('/dashboard/volunteer');
        } else {
          setError('Email non trouvé. Veuillez vous inscrire.');
        }
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setRole('volunteer')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${role === 'volunteer' ? 'bg-white text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Volontaire
        </button>
        <button
          onClick={() => setRole('admin')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${role === 'admin' ? 'bg-white text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Administrateur
        </button>
        <button
          onClick={() => setRole('sponsor')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${role === 'sponsor' ? 'bg-white text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Sponsor
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {role === 'volunteer' ? (
          <Input
            label="Email"
            type="email"
            placeholder="jean@example.com"
            required
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
        ) : role === 'admin' ? (
          <>
            <Input
              label="Email Admin"
              type="email"
              value="admin@nova.io"
              disabled
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </>
        ) : (
          <>
            <Input
              label="Email Sponsor"
              type="email"
              placeholder="contact@novasoft.net"
              required
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </>
        )}
        
        {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}


        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </div>
  );
};

export const SponsorLoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { loginSponsor } = await import('@/lib/api');
      const sponsor = await loginSponsor(email);
      
      // Simulating password check (in a real app, this is done backend)
      if (sponsor && (password === "123456" || password === "password123")) {
        localStorage.setItem('user', JSON.stringify(sponsor));
        toast.success(`Bienvenue, ${sponsor.name} !`);
        router.push('/dashboard/sponsor');
      } else {
        setError('Identifiants invalides');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email Entreprise"
        type="email"
        placeholder="contact@novasoft.net"
        required
        value={email}
        onChange={(e: any) => setEmail(e.target.value)}
      />

      <Input
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        required
        value={password}
        onChange={(e: any) => setPassword(e.target.value)}
      />
      
      {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700">
        {loading ? 'Connexion...' : 'Se connecter en tant que Sponsor'}
      </Button>
    </form>
  );
};

