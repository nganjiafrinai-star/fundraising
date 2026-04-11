'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

interface BarChartVolunteersProps {
  data: { id: string; name: string; amount: number }[];
}

export const BarChartVolunteers = ({ data }: BarChartVolunteersProps) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis 
            type="number"
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <YAxis 
            dataKey="name" 
            type="category"
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#475569', fontSize: 11, fontWeight: 800}}
            width={70}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
            cursor={{fill: '#f8fafc'}}
            formatter={(value: any) => [`${value.toLocaleString()} BIF`, 'Collecté']}
          />
          <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={24}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

