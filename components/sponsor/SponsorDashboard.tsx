'use client';

import React, { useState, useEffect } from 'react';
import { getSponsorDonations, createSponsorDonation } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Sponsor, SponsorDonation } from '@/types';
import { Button, Input, Card } from '../ui';
import toast from 'react-hot-toast';
import { LogOut, Briefcase, TrendingUp, Users } from 'lucide-react';

export const SponsorDashboard = () => {
  const router = useRouter();
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [donations, setDonations] = useState<SponsorDonation[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Virement');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === 'sponsor') {
        setSponsor(user);
        fetchDonations(user.id);
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/login');
    toast.success('Déconnexion réussie');
  };


  const fetchDonations = async (id: string) => {
    try {
      const data = await getSponsorDonations(id);
      setDonations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsor || !amount || !companyName || !companyEmail) return;

    setIsSubmitting(true);
    try {
      await createSponsorDonation({
        sponsorId: sponsor.id,
        companyName,
        companyEmail,
        amount: Number(amount),
        paymentMethod,
        note: note || undefined
      });

      toast.success('Don enregistré avec succès ! Merci pour votre soutien.');
      setCompanyName('');
      setCompanyEmail('');
      setAmount('');
      setNote('');
      fetchDonations(sponsor.id);
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!sponsor) return null;

  const totalDonated = donations.reduce((acc, d) => acc + d.amount, 0);
  const impactCount = Math.floor(totalDonated / 100000); // 1 impact every 100k BIF

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
      {/* Header section with impact badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-lg text-white">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bienvenue, {sponsor.name}</h1>
            <p className="text-gray-500 mt-1">Espace de gestion des contributions professionnelles</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-indigo-700 font-semibold text-sm">Badge Sponsor Premium</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Déconnexion"
          >
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <TrendingUp className="h-16 w-16" />
          </div>
          <p className="text-indigo-100 text-sm font-medium">Total des Contributions</p>
          <p className="text-3xl font-bold mt-2">{totalDonated.toLocaleString()} BIF</p>
          <div className="mt-4 pt-4 border-t border-indigo-400/30 text-xs text-indigo-100">
            Calculé sur {donations.length} versements
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
             <Briefcase className="h-16 w-16 text-indigo-900" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Nombre de Dons</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{donations.length}</p>
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
             Dernier don le {donations.length > 0 ? donations[donations.length-1].date : 'N/A'}
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
             <Users className="h-16 w-16 text-indigo-900" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Impact Généré</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{impactCount} Donateurs</p>
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-green-500 font-medium flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Soutien actif vérifié
          </div>
        </Card>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form to add donation */}
        <Card className="p-8 bg-white border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Users className="w-5 h-5" />
             </div>
             <h2 className="text-xl font-bold text-gray-900">Enregistrer un Partenaire</h2>
          </div>
          <form onSubmit={handleAddDonation} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nom de l'entreprise"
                placeholder="Ex: Lumière Tech"
                required
                value={companyName}
                onChange={(e: any) => setCompanyName(e.target.value)}
              />
              <Input
                label="Email de l'entreprise"
                placeholder="Ex: contact@lumieretech.com"
                required
                value={companyEmail}
                onChange={(e: any) => setCompanyEmail(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Montant du don (BIF)"
                type="number"
                placeholder="Ex: 500000"
                required
                value={amount}
                onChange={(e: any) => setAmount(e.target.value)}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Mode de paiement</label>
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm h-[46px]"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="Carte Bancaire">Carte Bancaire</option>
                  <option value="EcoCash">EcoCash</option>
                  <option value="Lumicash">Lumicash</option>
                  <option value="Paypal">Paypal</option>
                  <option value="eNoti">eNoti</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Stripe">Stripe</option>
                  <option value="Virement">Virement</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Note ou Référence (Optionnel)</label>
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm min-h-[100px]"
                placeholder="Ex: Soutien trimestriel Q2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <Button 
               type="submit" 
               disabled={isSubmitting} 
               className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all mt-2 shadow-lg shadow-indigo-100"
            >
              {isSubmitting ? 'Enregistrement...' : 'Confirmer la contribution'}
            </Button>
          </form>
        </Card>

        {/* List of donations */}
        <Card className="bg-white border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Vos enregistrements récents</h2>
          </div>
          <div className="p-0 flex-1 overflow-auto max-h-[500px]">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Chargement...</div>
            ) : donations.length === 0 ? (
              <div className="p-8 text-center text-gray-400 italic">Aucune contribution enregistrée.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold sticky top-0">
                  <tr>
                    <th className="px-6 py-3">Mode</th>
                    <th className="px-6 py-3">Montant</th>
                    <th className="px-6 py-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 uppercase text-xs tracking-tight">{d.companyName}</div>
                        <div className="text-[10px] text-gray-400 italic">{d.companyEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                          {d.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-indigo-600">{d.amount.toLocaleString()} BIF</td>
                      <td className="px-6 py-4 text-xs text-gray-400 text-right">{d.date}</td>
                    </tr>
                  ))}

                </tbody>
              </table>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
};
