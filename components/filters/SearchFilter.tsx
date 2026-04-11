'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchFilter = ({ value, onChange, placeholder = "Rechercher..." }: SearchFilterProps) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500/50 transition-all text-slate-900 font-medium placeholder:text-slate-400"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button 
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <X className="h-4 w-4 text-slate-300 hover:text-slate-500 transition-colors" />
        </button>
      )}
    </div>
  );
};
