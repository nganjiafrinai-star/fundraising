'use client';

import React, { useState, useEffect } from 'react';
import { Note } from '@/types';
import { NoteItem } from './NoteItem';
import { NoteForm } from './NoteForm';
import { Search, Plus, StickyNote } from 'lucide-react';
import { Button } from '../ui';
import { getNotes, createNote, updateNote, deleteNote } from '@/lib/api';
import toast from 'react-hot-toast';

export const NotesPanel = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  // Load notes from API
  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error(error);
      toast.error('Impossible de charger les notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async (data: Partial<Note>) => {
    try {
      await createNote({
        title: data.title || '',
        content: data.content || '',
        isPinned: false
      });
      fetchNotes();
      setIsFormOpen(false);
      toast.success('Note enregistrée !');
    } catch (error) {
       toast.error('Erreur lors de la création');
    }
  };

  const handleUpdateNote = async (data: Partial<Note>) => {
    if (!editingNote) return;
    
    try {
      await updateNote(editingNote.id, data);
      fetchNotes();
      setEditingNote(null);
      setIsFormOpen(false);
      toast.success('Note mise à jour !');
    } catch (error) {
        toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette note ?')) {
      try {
        await deleteNote(id);
        setNotes(notes.filter(n => n.id !== id));
        toast.success('Note supprimée');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleTogglePin = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    try {
      await updateNote(id, { isPinned: !note.isPinned });
      setNotes(notes.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
    } catch (error) {
        toast.error('Erreur lors de l’épinglage');
    }
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
