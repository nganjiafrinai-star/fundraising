import React, { useState } from 'react';
import { Sponsor, SponsorDonation } from '@/types';
import { Card, Modal, Input, Button } from '../ui';
import { Briefcase, Calendar, Banknote, Mail, Users, Edit3 } from 'lucide-react';
import { updateSponsorDonation } from '@/lib/api';
import toast from 'react-hot-toast';

interface SponsorListProps {
  sponsors: Sponsor[];
  donations: SponsorDonation[];
  onUpdate?: () => void;
}

export const SponsorList = ({ sponsors, donations, onUpdate }: SponsorListProps) => {
  const [editingDonation, setEditingDonation] = useState<SponsorDonation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sort donations by date (most recent first)
  const sortedDonations = [...donations].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonation) return;
    setIsSubmitting(true);
    try {
      await updateSponsorDonation(editingDonation.id, {
        companyName: editingDonation.companyName,
        companyEmail: editingDonation.companyEmail,
        amount: editingDonation.amount,
        paymentMethod: editingDonation.paymentMethod,
        note: editingDonation.note,
      });
      toast.success('Donation sponsor mise à jour !');
      setEditingDonation(null);
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Donations List Section */}
      <Card title="Historique des Dons Corporate">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Entreprise</th>
                <th className="px-6 py-4">Mode</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4 text-right">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {sortedDonations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Aucun don enregistré.
                  </td>
                </tr>
              ) : (
                sortedDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{donation.companyName}</div>
                      <div className="text-[10px] text-gray-400">{donation.companyEmail || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                         {donation.paymentMethod}
                       </span>
                    </td>
                    <td className="px-6 py-4 font-black text-emerald-600">
                      {donation.amount.toLocaleString()} BIF
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400 text-xs">
                      {new Date(donation.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                        onClick={() => setEditingDonation(donation)}
                        className="p-2 hover:bg-emerald-50 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
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
        </div>
      </Card>

      {editingDonation && (
        <Modal 
          isOpen={!!editingDonation} 
          onClose={() => setEditingDonation(null)} 
          title="Modifier le Don Corporate"
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input 
              label="Entreprise"
              value={editingDonation.companyName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingDonation({...editingDonation, companyName: e.target.value})}
              required
            />
            <Input 
              label="Email"
              value={editingDonation.companyEmail || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingDonation({...editingDonation, companyEmail: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Montant (BIF)"
                type="number"
                value={editingDonation.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingDonation({...editingDonation, amount: Number(e.target.value)})}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mode</label>
                <select 
                  className="h-11 w-full bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={editingDonation.paymentMethod}
                  onChange={(e) => setEditingDonation({...editingDonation, paymentMethod: e.target.value})}
                >
                  <option>Virement Bancaire</option>
                  <option>Chèque</option>
                  <option>Lumicash</option>
                  <option>EcoCash</option>
                  <option>Espèces</option>
                </select>
              </div>
            </div>
            <Input 
              label="Note"
              value={editingDonation.note || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingDonation({...editingDonation, note: e.target.value})}
            />
            <div className="flex gap-4 pt-4">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => setEditingDonation(null)}
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


