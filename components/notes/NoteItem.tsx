'use client';

import React from 'react';
import { Note } from '@/types';
import { Trash2, Pin, PinOff, Clock } from 'lucide-react';

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onEdit: (note: Note) => void;
}

const getTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `il y a ${Math.floor(interval)} ans`;
  interval = seconds / 2592000;
  if (interval > 1) return `il y a ${Math.floor(interval)} mois`;
  interval = seconds / 86400;
  if (interval > 1) return `il y a ${Math.floor(interval)} jours`;
  interval = seconds / 3600;
  if (interval > 1) return `il y a ${Math.floor(interval)} heures`;
  interval = seconds / 60;
  if (interval > 1) return `il y a ${Math.floor(interval)} min`;
  return `à l'instant`;
};

export const NoteItem = ({ note, onDelete, onTogglePin, onEdit }: NoteItemProps) => {
  const timeAgo = getTimeAgo(note.updatedAt || note.createdAt);


  return (
    <div className={`p-4 rounded-xl border transition-all group relative ${
      note.isPinned 
        ? 'bg-amber-50 border-amber-200' 
        : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-slate-800 line-clamp-1 pr-12" onClick={() => onEdit(note)}>
          {note.title || 'Note sans titre'}
        </h3>
        
        <div className="flex items-center gap-1 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onTogglePin(note.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              note.isPinned ? 'text-amber-600 bg-amber-100' : 'text-slate-400 hover:bg-slate-100'
            }`}
          >
            {note.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
          </button>
          <button 
            onClick={() => onDelete(note.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p 
        className="text-slate-600 text-sm line-clamp-3 mb-4 cursor-pointer" 
        onClick={() => onEdit(note)}
      >
        {note.content}
      </p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100/50">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
          <Clock size={12} />
          <span>{timeAgo}</span>
        </div>
        <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
          {note.content.length} car.
        </div>
      </div>
    </div>
  );
};
