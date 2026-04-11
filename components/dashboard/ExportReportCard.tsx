'use client';

import React from 'react';
import { AdminStats } from '@/types';
import { TrendingUp, Users, Heart, Share2, Award, PieChart } from 'lucide-react';

interface ExportReportCardProps {
  stats: AdminStats;
  date: string;
}

export const ExportReportCard = React.forwardRef<HTMLDivElement, ExportReportCardProps>(({ stats, date }, ref) => {
  const goalPercent = stats?.globalGoal ? Math.round((stats.totalGlobalCollected / stats.globalGoal) * 100) : 0;
  
  // Standard Hex Colors for html2canvas compatibility
  const colors = {
    slate900: '#0f172a',
    slate800: '#1e293b',
    slate700: '#334155',
    slate500: '#64748b',
    slate400: '#94a3b8',
    slate200: '#e2e8f0',
    slate100: '#f1f5f9',
    slate50: '#f8fafc',
    blue600: '#2563eb',
    blue100: '#dbeafe',
    blue50: '#eff6ff',
    indigo600: '#4f46e5',
    indigo100: '#e0e7ff',
    indigo50: '#eef2ff',
    purple600: '#9333ea',
    purple100: '#f3e8ff',
    purple50: '#faf5ff',
    amber600: '#d97706',
    amber100: '#fef3c7',
    emerald500: '#10b981',
  };

  return (
    <div 
      ref={ref}
      style={{ 
        backgroundColor: '#ffffff', 
        color: colors.slate900, 
        borderColor: colors.slate100,
        boxSizing: 'border-box',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}
      className="w-[600px] p-10 rounded-lg border font-sans flex flex-col gap-10 overflow-hidden export-container"
    >
      {/* Header & Branding */}
      <div style={{ borderBottomColor: colors.slate50 }} className="flex justify-between items-start border-b pb-8">
        <div>
          <h1 style={{ color: colors.slate900 }} className="text-2xl font-black tracking-tight">Rapport de Fundraising</h1>
          <p style={{ color: colors.slate400 }} className="text-sm font-bold uppercase tracking-widest mt-1">Généré le {date}</p>
        </div>
        <div style={{ backgroundColor: colors.blue600 }} className="text-white px-4 py-2 rounded-lg font-black text-sm uppercase tracking-tighter">
          TTN Connect
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-3 gap-6">
        <div style={{ backgroundColor: colors.blue50, borderColor: colors.blue100 }} className="p-6 rounded-lg border flex flex-col gap-3">
          <div style={{ backgroundColor: colors.blue100, color: colors.blue600 }} className="w-10 h-10 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div style={{ color: colors.slate400 }} className="text-[10px] font-black uppercase tracking-widest">Total Collecté</div>
            <div style={{ color: colors.slate900 }} className="text-xl font-black">{stats.totalGlobalCollected.toLocaleString()} <span className="text-[10px] opacity-50">BIF</span></div>
          </div>
        </div>
        
        <div style={{ backgroundColor: colors.indigo50, borderColor: colors.indigo100 }} className="p-6 rounded-lg border flex flex-col gap-3">
          <div style={{ backgroundColor: colors.indigo100, color: colors.indigo600 }} className="w-10 h-10 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div style={{ color: colors.slate400 }} className="text-[10px] font-black uppercase tracking-widest">Donateurs</div>
            <div style={{ color: colors.slate900 }} className="text-xl font-black">{stats.totalDonors} <span className="text-[10px] opacity-50">ACTIFS</span></div>
          </div>
        </div>

        <div style={{ backgroundColor: colors.purple50, borderColor: colors.purple100 }} className="p-6 rounded-lg border flex flex-col gap-3">
          <div style={{ backgroundColor: colors.purple100, color: colors.purple600 }} className="w-10 h-10 rounded-full flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div style={{ color: colors.slate400 }} className="text-[10px] font-black uppercase tracking-widest">Volontaires</div>
            <div style={{ color: colors.slate900 }} className="text-xl font-black">{stats.totalVolunteers} <span className="text-[10px] opacity-50">MEMBRES</span></div>
          </div>
        </div>
      </div>

      {/* Progression */}
      <div className="space-y-4 px-2">
        <div className="flex justify-between items-end">
          <span style={{ color: colors.slate500 }} className="text-xs font-black uppercase tracking-[0.2em]">Progression Objectif (32M)</span>
          <span style={{ color: colors.blue600 }} className="text-xl font-black">{goalPercent}%</span>
        </div>
        <div style={{ backgroundColor: colors.slate50, borderColor: colors.slate100 }} className="h-5 rounded-lg border overflow-hidden p-0.5">
          <div 
            style={{ 
              width: `${Math.min(goalPercent, 100)}%`, 
              backgroundColor: colors.blue600,
              background: `linear-gradient(to right, ${colors.blue600}, ${colors.indigo600})` 
            }}
            className="h-full rounded-lg transition-all duration-1000" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10 mt-2 px-2">
        {/* Top Volontaires */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Award style={{ color: '#f59e0b' }} className="w-4 h-4" />
            <h3 style={{ color: colors.slate800 }} className="text-xs font-black uppercase tracking-widest">Top Performance</h3>
          </div>
          <div className="space-y-3">
            {(stats.rankings || []).slice(0, 3).map((v, i) => (
              <div key={`${v.id}-${i}`} style={{ borderColor: colors.slate100, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }} className="flex items-center justify-between p-4 bg-white border rounded-lg">
                <div className="flex items-center gap-3">
                  <span style={{ 
                    backgroundColor: i === 0 ? colors.amber100 : colors.slate50,
                    color: i === 0 ? colors.amber600 : colors.slate400 
                  }} className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black">
                    {i+1}
                  </span>
                  <span style={{ color: colors.slate700 }} className="text-sm font-bold">{v.name}</span>
                </div>
                <span style={{ color: colors.blue600 }} className="text-xs font-black">{v.amount.toLocaleString()} BIF</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canaux */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <PieChart style={{ color: colors.emerald500 }} className="w-4 h-4" />
            <h3 style={{ color: colors.slate800 }} className="text-xs font-black uppercase tracking-widest">Canaux de Don</h3>
          </div>
          <div className="space-y-3">
            {stats.byChannel.map((c) => (
              <div key={c.name} style={{ borderColor: colors.slate100, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }} className="flex items-center justify-between p-4 bg-white border rounded-lg">
                <span style={{ color: colors.slate700 }} className="text-sm font-bold">{c.name}</span>
                <span style={{ color: colors.indigo600 }} className="text-xs font-black">{c.value} dons</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Branding */}
      <div style={{ borderTopColor: colors.slate50, color: colors.slate400 }} className="mt-4 pt-6 border-t flex items-center justify-center gap-2">
        <Share2 className="w-3 h-3" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Partagé via TTN Mission Connect</span>
      </div>
    </div>
  );
});

ExportReportCard.displayName = 'ExportReportCard';
