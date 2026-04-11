'use client';

import React, { useState, useEffect } from 'react';
import { Note } from '@/types';
import { Button, Input } from '../ui';
import { X, Save } from 'lucide-react';

interface NoteFormProps {
  noteToEdit?: Note | null;
  onSave: (note: Partial<Note>) => void;
  onClose: () => void;
}

export const NoteForm = ({ noteToEdit, onSave, onClose }: NoteFormProps) => {
  const [title, setTitle] = useState(noteToEdit?.title || '');
  const [content, setContent] = useState(noteToEdit?.content || '');

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
    }
  }, [noteToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSave({ title, content });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-black text-slate-800 tracking-tight">
            {noteToEdit ? 'Modifier la note' : 'Nouvelle note'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Titre"
            autoFocus
            placeholder="Le titre de votre idée..."
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider ml-1">Contenu</label>
            <textarea
              className="w-full h-48 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-700 resize-none"
              placeholder="Écrivez vos pensées ici..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <div className="text-[10px] text-right text-slate-400 font-bold uppercase mr-1 mt-1">
              {content.length} caractères
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
            <Button variant="outline" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="gap-2">
              <Save size={18} />
              {noteToEdit ? 'Mettre à jour' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
