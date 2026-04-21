'use client';

import React, { useState } from 'react';
import { Button, Input, Modal } from '../ui';
import { createSponsorDonation } from '@/lib/api';
import toast from 'react-hot-toast';
import { Banknote, Building2, Calendar, CreditCard } from 'lucide-react';

interface SponsorPaymentFormProps {
  onPaymentAdded: () => void;
}

export const SponsorPaymentForm = ({ onPaymentAdded }: SponsorPaymentFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    amount: '',
    paymentMethod: 'Virement Bancaire',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createSponsorDonation({
        ...formData,
        amount: Number(formData.amount),
      });
      toast.success('Paiement sponsor enregistré !');
      setIsOpen(false);
      setFormData({
        companyName: '',
        companyEmail: '',
        amount: '',
        paymentMethod: 'Virement Bancaire',
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
      onPaymentAdded();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Banknote className="w-4 h-4" />
        Enregistrer un Paiement Sponsor
      </Button>

      {isOpen && (
        <Modal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          title="Nouveau Paiement Partenaire"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Nom de l'entreprise"
                placeholder="Ex: NovaSoft Ltd"
                value={formData.companyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, companyName: e.target.value})}
                required
              />
              <Input 
                label="Email (facultatif)"
                type="email"
                placeholder="contact@entreprise.com"
                value={formData.companyEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, companyEmail: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Montant (BIF)"
                type="number"
                placeholder="Ex: 500000"
                value={formData.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, amount: e.target.value})}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mode de paiement</label>
                <select 
                  className="h-11 w-full bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
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
              label="Date du paiement"
              type="date"
              value={formData.date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, date: e.target.value})}
              required
            />

            <Input 
              label="Note / Observation"
              placeholder="Ex: Soutien annuel 2026..."
              value={formData.note}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, note: e.target.value})}
            />

            <div className="flex gap-4 pt-4">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enregistrement...' : 'Confirmer le paiement'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};
