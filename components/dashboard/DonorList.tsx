import React, { useState } from 'react';
import { Donor } from '@/types';
import { Edit3, Check, X } from 'lucide-react';
import { updateDonor } from '@/lib/api';
import toast from 'react-hot-toast';
import { Modal, Input, Button, Select } from '../ui';
import { countries } from '@/lib/countries';

export const DonorList = ({ donors, onUpdate }: { donors: Donor[], onUpdate?: () => void }) => {
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonor) return;
    setIsSubmitting(true);
    try {
      await updateDonor(editingDonor.id, {
        name: editingDonor.name,
        amount: editingDonor.amount,
        country: editingDonor.country,
        phone: editingDonor.phone,
        paymentMethod: editingDonor.paymentMethod,
      });
      toast.success('Donateur mis à jour !');
      setEditingDonor(null);
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-x-auto relative">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400 text-[10px] md:text-xs">
            <th className="py-4 px-2 md:px-4 font-black uppercase tracking-[0.2em]">Donateur</th>
            <th className="py-4 px-2 md:px-4 font-black uppercase tracking-[0.2em] text-right">Montant</th>
            <th className="py-4 px-2 md:px-4 font-black uppercase tracking-[0.2em] text-right">Pays</th>
            <th className="py-4 px-2 md:px-4 font-black uppercase tracking-[0.2em] text-right hidden sm:table-cell">Date</th>
            <th className="py-4 px-2 md:px-4 font-black uppercase tracking-[0.2em] text-right hidden md:table-cell">Source</th>
            <th className="py-4 px-2 md:px-4 font-black uppercase tracking-[0.2em] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {donors.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun don enregistré</td>
            </tr>
          ) : (
            donors.map((donor) => (
              <tr key={donor.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="py-5 px-2 md:px-4">
                  <div className="font-bold text-slate-900 text-sm md:text-base">{donor.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 tracking-wider flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                    {donor.phone}
                  </div>
                </td>
                <td className="py-5 px-2 md:px-4 text-right">
                  <div className="font-black text-blue-600 text-sm md:text-base">{donor.amount.toLocaleString()} BIF</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest sm:hidden">{new Date(donor.date).toLocaleDateString('fr-FR')}</div>
                </td>
                <td className="py-5 px-4 text-right">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">{donor.country}</span>
                </td>
                <td className="py-5 px-4 text-right hidden sm:table-cell">
                  <span className="text-sm font-bold text-slate-500">{new Date(donor.date).toLocaleDateString('fr-FR')}</span>
                </td>
                <td className="py-5 px-4 text-right hidden md:table-cell">
                  <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    donor.channel === 'Direct' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    donor.channel === 'Email' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                    donor.channel === 'Réseaux Sociaux' ? 'bg-pink-50 text-pink-600 border border-pink-100' :
                    'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {donor.channel}
                  </span>
                </td>
                <td className="py-5 px-4 text-right">
                   <button 
                    onClick={() => setEditingDonor(donor)}
                    className="p-2 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                    title="Modifier"
                   >
                     <Edit3 className="w-4 h-4" />
                   </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editingDonor && (
        <Modal 
          isOpen={!!editingDonor} 
          onClose={() => setEditingDonor(null)} 
          title="Modifier le Don"
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input 
              label="Nom du Donateur"
              value={editingDonor.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingDonor({...editingDonor, name: e.target.value})}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Montant (BIF)"
                type="number"
                value={editingDonor.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingDonor({...editingDonor, amount: Number(e.target.value)})}
                required
              />
              <Select 
                label="Pays"
                options={countries}
                value={editingDonor.country}
                onChange={(e: any) => setEditingDonor({...editingDonor, country: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Téléphone"
                value={editingDonor.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingDonor({...editingDonor, phone: e.target.value})}
              />
              <Select 
                label="Moyen de paiement"
                value={editingDonor.paymentMethod}
                options={[
                  { label: 'Carte Bancaire', value: 'Carte Bancaire' },
                  { label: 'EcoCash', value: 'EcoCash' },
                  { label: 'Lumicash', value: 'Lumicash' },
                  { label: 'Paypal', value: 'Paypal' },
                  { label: 'eNoti', value: 'eNoti' },
                  { label: 'Chèque', value: 'Chèque' },
                  { label: 'Stripe', value: 'Stripe' },
                ]}
                onChange={(e: any) => setEditingDonor({...editingDonor, paymentMethod: e.target.value})}
                required
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => setEditingDonor(null)}
                type="button"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enregistrement...' : 'Sauvegarder'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
