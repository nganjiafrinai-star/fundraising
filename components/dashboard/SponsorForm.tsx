'use client';

import React, { useState } from 'react';
import { Button, Input, Modal } from '../ui';
import { registerUser } from '@/lib/api';
import toast from 'react-hot-toast';
import { Building2, Mail, Lock } from 'lucide-react';

interface SponsorFormProps {
  onSponsorAdded: () => void;
}

export const SponsorForm = ({ onSponsorAdded }: SponsorFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await registerUser({
        ...formData,
        role: 'sponsor'
      });
      toast.success('Compte sponsor créé avec succès !');
      setIsOpen(false);
      setFormData({ name: '', email: '', password: '' });
      onSponsorAdded();
    } catch (error) {
      toast.error('Erreur lors de la création du compte');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Building2 className="w-4 h-4" />
        Ajouter un Sponsor
      </Button>

      {isOpen && (
        <Modal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          title="Nouveau Partenaire Corporate"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="Nom de l'entreprise"
              placeholder="Ex: NovaSoft Ltd"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input 
              label="Email de contact"
              type="email"
              placeholder="contact@entreprise.com"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}
              required
            />
            <Input 
              label="Mot de passe temporaire"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, password: e.target.value})}
              required
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
                {isSubmitting ? 'Création...' : 'Créer le compte'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};
