'use client';

import React from 'react';
import { StatCard, Card } from '@/components/ui';
import { AdminStats } from '@/types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Heart, Users } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981'];

import { LineChartDonations } from './charts/LineChartDonations';
import { BarChartVolunteers } from './charts/BarChartVolunteers';
import { PieChartChannels } from './charts/PieChartChannels';
import { Leaderboard } from './Leaderboard';

interface AdminOverviewProps {
  stats: AdminStats;
}

export const AdminOverview = ({ stats }: AdminOverviewProps) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Objectif Global" 
          value="32M BIF" 
          color="blue"
          trend={`${stats?.globalGoal ? ((stats.totalGlobalCollected / stats.globalGoal) * 100).toFixed(1) : '0.0'}%`}
          icon={<TrendingUp className="w-6 h-6" />}
        />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card title="Évolution des Dons (Mensuel)">
            <LineChartDonations />
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
                <span className="text-slate-400 font-bold">/ 32,000,000 BIF</span>
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
