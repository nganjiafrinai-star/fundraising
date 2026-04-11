'use client';

import React from 'react';
import { DashboardStats } from '@/types';

interface VolunteerHeroProps {
  stats: DashboardStats | null;
}

export const VolunteerHero = ({ stats }: VolunteerHeroProps) => {
  return (
    <section className="relative overflow-hidden bg-indigo-900 rounded-lg p-8 md:p-12 text-white">
      <div className="absolute top-0 right-0 -m-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -m-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl opacity-50"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="space-y-4 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Propulsez votre <br/><span className="text-indigo-300">collecte de fonds.</span>
          </h1>
          <p className="text-indigo-100/70 font-medium text-lg leading-relaxed">
            Chaque donateur compte. Continuez sur votre lancée et dépassez vos objectifs personnels pour la cause de TTN Mission.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-lg border border-white/20 w-full lg:w-96">
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Impact Actuel</div>
              <div className="text-4xl font-black">{stats?.totalCollected.toLocaleString()} <span className="text-sm font-bold opacity-50">BIF</span></div>
            </div>
            <div className="text-right">
              <div className="text-indigo-300 text-3xl font-black">{Math.round(stats?.progressPercentage || 0)}%</div>
              <div className="text-[10px] text-white/40 font-black uppercase tracking-widest">objectif</div>
            </div>
          </div>
          <div className="w-full bg-black/20 rounded-lg h-4 overflow-hidden p-[2px] border border-white/10">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-indigo-300 h-full rounded-[4px] transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(100, stats?.progressPercentage || 0)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
