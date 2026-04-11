import React from 'react';
import { Donor } from '@/types';

export const DonorList = ({ donors }: { donors: Donor[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400 text-[10px] md:text-xs">
            <th className="py-4 px-2 md:px-4 font-black uppercase tracking-[0.2em]">Donateur</th>
            <th className="py-4 px-2 md:px-4 font-black uppercase tracking-[0.2em] text-right">Montant</th>
            <th className="py-4 px-2 md:px-4 font-black uppercase tracking-[0.2em] text-right">Pays</th>
            <th className="py-4 px-2 md:px-4 font-black uppercase tracking-[0.2em] text-right hidden sm:table-cell">Date</th>
            <th className="py-4 px-2 md:px-4 font-black uppercase tracking-[0.2em] text-right hidden md:table-cell">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {donors.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun don enregistré</td>
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
