import React from 'react';
import { Sponsor, SponsorDonation } from '@/types';
import { Card } from '../ui';
import { Briefcase, Calendar, Banknote } from 'lucide-react';

interface SponsorListProps {
  sponsors: Sponsor[];
  donations: SponsorDonation[];
}

export const SponsorList = ({ sponsors, donations }: SponsorListProps) => {
  // Sort donations by date (most recent first)
  const sortedDonations = [...donations].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Entreprise Partenaire</th>
              <th className="px-6 py-4">Mode</th>
              <th className="px-6 py-4">Montant du Don</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {sortedDonations.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                  Aucun don de sponsor n'a été enregistré pour le moment.
                </td>
              </tr>
            ) : (
              sortedDonations.map((donation) => {
                const hostSponsor = sponsors.find(s => s.id === donation.sponsorId);
                return (
                  <tr key={donation.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-indigo-400" />
                        <span className="uppercase tracking-tight">{donation.companyName}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 italic ml-6">{donation.companyEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                         {donation.paymentMethod}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 font-black">
                        <Banknote className="w-4 h-4 opacity-50" />
                        {donation.amount.toLocaleString()} BIF
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-gray-400 text-xs">
                        <Calendar className="w-4 h-4" />
                        {donation.date}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>


        </table>
      </div>
    </Card>
  );
};


