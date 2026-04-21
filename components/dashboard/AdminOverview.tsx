'use client';

import React, { useState } from 'react';
import { StatCard, Card } from '@/components/ui';
import { AdminStats } from '@/types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Heart, Users, Settings as SettingsIcon, Edit3 } from 'lucide-react';
import { Button, Modal, Input } from '@/components/ui';
import { updateSettings } from '@/lib/api';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981'];

import { LineChartDonations } from './charts/LineChartDonations';
import { BarChartVolunteers } from './charts/BarChartVolunteers';
import { PieChartChannels } from './charts/PieChartChannels';
import { Leaderboard } from './Leaderboard';

interface AdminOverviewProps {
  stats: AdminStats;
  onUpdate: () => void;
}

export const AdminOverview = ({ stats, onUpdate }: AdminOverviewProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState(stats.globalGoal.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateGoal = async () => {
    setIsSubmitting(true);
    try {
      await updateSettings({ globalGoal: Number(newGoal) });
      toast.success('Objectif global mis à jour !');
      setIsModalOpen(false);
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative group">
          <StatCard 
            label="Objectif Global" 
            value={`${((stats?.globalGoal || 0) / 1000000).toFixed(1)}M BIF`} 
            color="blue"
            trend={`${stats?.globalGoal ? ((stats.totalGlobalCollected / stats.globalGoal) * 100).toFixed(1) : '0.0'}%`}
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm border border-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-300"
            title="Modifier l'objectif global"
          >
            <Edit3 className="w-4 h-4 text-indigo-600" />
          </button>
        </div>
        <StatCard 
          label="Total Global" 
          value={`${stats.totalGlobalCollected.toLocaleString()} BIF`} 
          color="green"
          icon={<Heart className="w-6 h-6" />}
        />
        <StatCard 
          label="Volontaires" 
          value={stats.totalVolunteers} 
          color="purple"
          icon={<Users className="w-5 h-5 font-bold" />}
        />
      </div>

      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Paramètres de Campagne"
        >
          <div className="space-y-6">
            <Input 
              label="Objectif Global de Collecte (BIF)" 
              type="number"
              value={newGoal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGoal(e.target.value)}
              placeholder="Ex: 32000000"
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
                className="flex-1"
                disabled={isSubmitting}
                onClick={handleUpdateGoal}
              >
                {isSubmitting ? 'Mise à jour...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card title="Évolution des Dons">
            <LineChartDonations data={stats.evolution} />
          </Card>
          
          <Card title="Progression Finale">
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Mission Accumulé</span>
                  <span className="text-3xl font-black text-indigo-600">
                    {(stats.campaignTotal ?? 0).toLocaleString()}
                  </span>
                </div>
                <span className="text-slate-400 font-bold">/ {(stats.globalGoal || 0).toLocaleString()} BIF</span>
              </div>
              <div className="w-full bg-slate-100 rounded-lg h-6 overflow-hidden p-1 border border-slate-200/50">
                <div 
                   className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-[4px] transition-all duration-1000 ease-out" 
                   style={{width: `${stats?.globalGoal ? Math.min(((stats.campaignTotal ?? 0) / stats.globalGoal) * 100, 100) : 0}%`}}
                />
              </div>
            </div>
          </Card>


        </div>

        {/* Channels Column */}
        <div className="lg:col-span-1">
          <Card title="Sources des Dons">
            <PieChartChannels data={stats.byChannel} />
          </Card>
        </div>
      </div>

      <Card title="Montants par Mode de Paiement">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
           {stats.byPaymentMethod.map((method, idx) => (
             <div key={`${idx}`} className="flex flex-col p-4 bg-slate-50 rounded-lg border border-slate-100 group hover:border-indigo-100 transition-all">
                <span className="text-xs font-bold uppercase tracking-wider mb-1 text-indigo-600 transition-colors">

                  {method.name}
                </span>
                <span className="text-xl font-black text-slate-800">
                  {method.value.toLocaleString()} BIF
                </span>
             </div>
           ))}
         </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <Card title="Comparaison Collecte">
          <BarChartVolunteers data={stats.rankings} />
        </Card>
        <Leaderboard rankings={stats.rankings} />
      </div>
    </div>
  );
};
