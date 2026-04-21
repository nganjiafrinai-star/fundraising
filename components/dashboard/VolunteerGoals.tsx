'use client';

import React, { useState } from 'react';
import { Card, ProgressBar, Button, Modal, Input } from '@/components/ui';
import { DashboardStats } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { goalsSchema, GoalsFormData } from '@/lib/validators/goals.schema';
import { updateVolunteerGoals } from '@/lib/api';
import toast from 'react-hot-toast';

interface VolunteerGoalsProps {
  stats: DashboardStats | null;
  onUpdate: () => void;
}

export const VolunteerGoals = ({ stats, onUpdate }: VolunteerGoalsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<GoalsFormData>({
    resolver: zodResolver(goalsSchema) as any,
    defaultValues: {
      amountGoal: stats?.goalAmount || 0,
      donorsGoal: stats?.donorsGoal || 0,
    }
  });

  const onSubmit = async (data: GoalsFormData) => {
    setIsSubmitting(true);
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      
      await updateVolunteerGoals(user.id, data);
      toast.success('Objectifs mis à jour !');
      setIsModalOpen(false);
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2 px-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Objectifs & Performance</h2>
        <p className="text-slate-500 font-medium">Analyse détaillée de votre impact et progression personnelle.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Progression de Collecte">
          <div className="space-y-10">
            <ProgressBar label="Collecte de fonds globale" progress={stats?.progressPercentage || 0} />
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50/50 rounded-lg border border-slate-100 flex flex-col gap-1">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Montant Restant</div>
                <div className="text-2xl font-black text-slate-900">
                  {Math.max(0, (stats?.goalAmount || 0) - (stats?.totalCollected || 0)).toLocaleString()} BIF
                </div>
                <div className="text-[10px] text-blue-600 font-bold uppercase">À collecter</div>
              </div>
              <div className="p-6 bg-slate-50/50 rounded-lg border border-slate-100 flex flex-col gap-1">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Moyenne / Don</div>
                <div className="text-2xl font-black text-slate-900">
                  {Math.round((stats?.totalCollected || 0) / (stats?.donorCount || 1)).toLocaleString()} BIF
                </div>
                <div className="text-[10px] text-emerald-600 font-bold uppercase">Générosité moyenne</div>
              </div>
            </div>
            
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="w-full h-14 rounded-lg"
            >
              Personnaliser mes objectifs
            </Button>
          </div>
        </Card>
        
        <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-lg border border-indigo-100 flex flex-col justify-between h-full">
          <div>
            <div className="text-indigo-600 font-black text-sm uppercase tracking-widest mb-6">Prochains Défis</div>
            <ul className="space-y-6">
              {[
                { 
                  label: 'Prochain Palier', 
                  meta: (stats?.totalCollected || 0) < (stats?.goalAmount || 0) 
                    ? `Encore ${(Math.ceil(((stats?.totalCollected || 0) + 1) / 1000000) * 1000000 - (stats?.totalCollected || 0)).toLocaleString()} BIF pour le prochain million`
                    : 'Objectif financier atteint !',
                  iconColor: 'bg-emerald-500'
                },
                { 
                  label: 'Badge Ambassadeur', 
                  meta: (stats?.donorCount || 0) < 10 
                    ? `Convaincre ${10 - (stats?.donorCount || 0)} donateurs de plus`
                    : 'Badge Ambassadeur débloqué !',
                  iconColor: 'bg-amber-500'
                },
                { 
                  label: 'Efficacité Locale', 
                  meta: `Moyenne actuelle : ${Math.round((stats?.totalCollected || 0) / (stats?.donorCount || 1)).toLocaleString()} BIF / don`,
                  iconColor: 'bg-indigo-500'
                }
              ].map((challenge) => (
                <li key={challenge.label} className="flex items-start gap-4 p-4 bg-white/60 rounded-lg border border-white/40 group hover:border-indigo-200 transition-colors">
                  <div className={`w-5 h-5 rounded-lg ${challenge.iconColor} flex items-center justify-center mt-1`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </div>
                  <div>
                    <div className="font-black text-slate-800 text-sm">{challenge.label}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{challenge.meta}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8 p-4 bg-indigo-600 rounded-lg text-white text-center">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">Maître de Mission</div>
            <div className="text-sm font-bold">Niveau 2 : Partageur Actif</div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Personnaliser mes objectifs"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input 
            label="Objectif financier (BIF)" 
            type="number"
            placeholder="Ex: 10 000 000"
            {...register('amountGoal')}
            error={errors.amountGoal?.message}
          />
          <Input 
            label="Nombre de donateurs visé" 
            type="number"
            placeholder="Ex: 50"
            {...register('donorsGoal')}
            error={errors.donorsGoal?.message}
          />
          <div className="flex gap-4 pt-4">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
