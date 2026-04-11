'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { Volunteer, Donor } from '@/types';

interface VolunteerListProps {
  volunteers: Volunteer[];
  donors: Donor[];
}

export const VolunteerList = ({ volunteers, donors }: VolunteerListProps) => {
  return (
    <Card title="Gestion des Volontaires">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[10px] md:text-xs">
              <th className="pb-4 px-4 font-black uppercase tracking-[0.2em]">Nom</th>
              <th className="pb-4 px-4 font-black uppercase tracking-[0.2em] hidden md:table-cell">Contact</th>
              <th className="pb-4 px-4 font-black uppercase tracking-[0.2em] text-right">Collecté</th>
              <th className="pb-4 px-4 font-black uppercase tracking-[0.2em] text-right">Objectif</th>
              <th className="pb-4 px-4 font-black uppercase tracking-[0.2em] text-center">Progression</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {volunteers.map(v => {
              const collected = donors.filter(d => d.volunteerId === v.id).reduce((acc, d) => acc + d.amount, 0);
              const progress = v.amountGoal > 0 ? (collected / v.amountGoal) * 100 : 0;
              
              return (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-5 px-4 font-bold text-slate-900">{v.name}</td>
                  <td className="py-5 px-4 text-sm text-slate-500 hidden md:table-cell">
                    <div className="flex flex-col">
                      <span className="font-medium">{v.email}</span>
                      <span className="text-[10px] text-slate-400 font-bold tracking-wider">{v.phone}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-right font-black text-emerald-600">{collected.toLocaleString()} BIF</td>
                  <td className="py-5 px-4 text-right font-bold text-slate-400">{v.amountGoal.toLocaleString()} BIF</td>
                  <td className="py-5 px-4">
                    <div className="flex flex-col gap-2 items-center min-w-[140px]">
                    <div className="w-full bg-slate-100 rounded-lg h-3 overflow-hidden p-[2px] border border-slate-200/30">
                      <div 
                        className={`h-full rounded-[4px] transition-all duration-700 ${progress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{width: `${Math.min(progress, 100)}%`}}
                      />
                    </div>
                      <span className={`text-[10px] font-black ${progress >= 100 ? 'text-emerald-600' : 'text-blue-600'}`}>
                        {progress.toFixed(1)}% COMPLETÉ
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
