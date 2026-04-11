'use client';

import React, { useState, useEffect } from 'react';
import { Note } from '@/types';
import { NoteItem } from './NoteItem';
import { NoteForm } from './NoteForm';
import { Search, Plus, StickyNote } from 'lucide-react';
import { Button } from '../ui';
import toast from 'react-hot-toast';

export const NotesPanel = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [volunteerId, setVolunteerId] = useState<string>('');

  // Load notes from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setVolunteerId(user.id);
      
      const storedNotes = localStorage.getItem(`notes_${user.id}`);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    }
  }, []);

  // Save notes to localStorage
  const saveToStorage = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    if (volunteerId) {
      localStorage.setItem(`notes_${volunteerId}`, JSON.stringify(updatedNotes));
    }
  };

  const handleAddNote = (data: Partial<Note>) => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      volunteerId,
      title: data.title || '',
      content: data.content || '',
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // TODO: POST /api/notes
    saveToStorage([newNote, ...notes]);
    setIsFormOpen(false);
    toast.success('Note enregistrée !');
  };

  const handleUpdateNote = (data: Partial<Note>) => {
    if (!editingNote) return;
    
    const updatedNotes = notes.map(n => 
      n.id === editingNote.id 
        ? { ...n, ...data, updatedAt: new Date().toISOString() } 
        : n
    );
    
    // TODO: PUT /api/notes/:id
    saveToStorage(updatedNotes);
    setEditingNote(null);
    setIsFormOpen(false);
    toast.success('Note mise à jour !');
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette note ?')) {
      const updatedNotes = notes.filter(n => n.id !== id);
      // TODO: DELETE /api/notes/:id
      saveToStorage(updatedNotes);
    }
  };

  const handleTogglePin = (id: string) => {
    const updatedNotes = notes.map(n => 
      n.id === id ? { ...n, isPinned: !n.isPinned } : n
    );
    saveToStorage(updatedNotes);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    // Pin logic: pinned notes first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // Then sort by date
    return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Rechercher une note..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={() => { setEditingNote(null); setIsFormOpen(true); }} className="w-full md:w-auto gap-2">
          <Plus size={18} />
          Nouvelle Note
        </Button>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="p-4 bg-white rounded-full shadow-sm mb-4">
            <StickyNote size={40} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">
            {searchTerm ? 'Aucune note ne correspond à votre recherche.' : 'Vous n’avez pas encore de notes.'}
          </p>
          {!searchTerm && (
            <button 
              onClick={() => setIsFormOpen(true)}
              className="mt-4 text-indigo-600 font-bold hover:underline"
            >
              Créer votre première note
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <NoteItem 
              key={note.id} 
              note={note} 
              onDelete={handleDeleteNote}
              onTogglePin={handleTogglePin}
              onEdit={(n) => { setEditingNote(n); setIsFormOpen(true); }}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <NoteForm 
          noteToEdit={editingNote}
          onSave={editingNote ? handleUpdateNote : handleAddNote}
          onClose={() => { setIsFormOpen(false); setEditingNote(null); }}
        />
      )}
    </div>
  );
};
