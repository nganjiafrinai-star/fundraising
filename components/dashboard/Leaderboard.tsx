'use client';

import React from 'react';
import { Card } from '../ui';
import { Trophy, Rocket, TrendingUp } from 'lucide-react';

interface LeaderboardProps {
  rankings: { id: string; name: string; amount: number }[];
}

export const Leaderboard = ({ rankings }: LeaderboardProps) => {
  return (
    <Card title="Classement des Volontaires">
      <div className="space-y-4">
        {rankings.map((v, index) => (
          <div 
            key={`${v.id}-${index}`} 
            className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:scale-[1.01] ${
              index === 0 ? 'bg-amber-50 border-amber-200' :
              index === 1 ? 'bg-slate-50 border-slate-200' :
              index === 2 ? 'bg-orange-50 border-orange-200' :
              'bg-white border-slate-100'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                index === 0 ? 'bg-amber-500 text-white' :
                index === 1 ? 'bg-slate-400 text-white' : 
                index === 2 ? 'bg-orange-400 text-white' :
                'bg-slate-100 text-slate-500'
              }`}>
                {index + 1}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900">{v.name}</span>
                  {index === 0 && <Trophy className="w-4 h-4 text-amber-500" />}
                  {index < 3 && index > 0 && <Rocket className="w-4 h-4 text-indigo-500" />}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {index === 0 ? 'Top Performer' : 'Rising Star'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-black ${index === 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                {v.amount.toLocaleString()} BIF
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
