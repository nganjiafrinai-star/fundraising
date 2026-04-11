'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { StatCard, Card } from '@/components/ui';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { VolunteerHero } from '@/components/dashboard/VolunteerHero';
import { VolunteerGoals } from '@/components/dashboard/VolunteerGoals';
import { 
  LayoutDashboard, Heart, Target, Zap, Plus, X, StickyNote
} from 'lucide-react';
import { DonorList } from '@/components/dashboard/DonorList';
import { DonorForm } from '@/components/forms/DonorForm';
import { NotesPanel } from '@/components/notes/NotesPanel';
import { getDashboardStats, getDonors } from '@/lib/api';
import { Volunteer, DashboardStats, Donor } from '@/types';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SearchFilter } from '@/components/filters/SearchFilter';
import { DateFilter } from '@/components/filters/DateFilter';
import { ExportOptions } from '@/components/export/ExportOptions';

export default function VolunteerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<Volunteer | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [activeTab, setActiveTab] = useState<'mission' | 'goals' | 'notes'>('mission');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [activePeriod, setActivePeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');
  
  const exportRef = useRef<HTMLDivElement>(null);

  const fetchData = async (userId: string, period: any = 'all') => {
    try {
      const [s, d] = await Promise.all([
        getDashboardStats(userId, period),
        getDonors(userId)
      ]);
      setStats(s);
      setDonors(d);
      setFilteredDonors(d);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/auth/login');
      return;
    }
    const u = JSON.parse(storedUser);
    if (u.role !== 'volunteer') {
      router.push('/dashboard/admin');
      return;
    }
    setUser(u);
    fetchData(u.id, activePeriod);
  }, [router, activePeriod]);

  // Handle Filtering
  useEffect(() => {
    let result = donors;

    if (searchQuery) {
      result = result.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (activePeriod !== 'all') {
      const now = new Date();
      result = result.filter(d => {
        const dDate = new Date(d.date);
        if (activePeriod === 'today') return dDate.toDateString() === now.toDateString();
        if (activePeriod === 'week') {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return dDate >= weekAgo;
        }
        if (activePeriod === 'month') {
          return dDate.getMonth() === now.getMonth() && dDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    setFilteredDonors(result);
  }, [searchQuery, activePeriod, donors]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const sidebarLinks = [
    { 
      id: 'mission', 
      label: 'Ma Mission', 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      onClick: () => { setActiveTab('mission'); setMobileMenuOpen(false); },
      isActive: activeTab === 'mission'
    },
    { 
      id: 'notes', 
      label: 'Bloc-notes', 
      icon: <StickyNote className="w-5 h-5" />, 
      onClick: () => { setActiveTab('notes'); setMobileMenuOpen(false); },
      isActive: activeTab === 'notes'
    },
    { 
      id: 'goals', 
      label: 'Objectifs', 
      icon: <Target className="w-5 h-5" />, 
      onClick: () => { setActiveTab('goals'); setMobileMenuOpen(false); },
      isActive: activeTab === 'goals'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-900">
      <DashboardSidebar 
        user={{ name: user.name, role: 'Volontaire TTN' }}
        links={sidebarLinks}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        variant="volunteer"
      />

      <main className="flex-1 overflow-x-hidden">
        <DashboardHeader 
          title={
            activeTab === 'mission' ? `Salut, ${user.name.split(' ')[0]}` : 
            activeTab === 'notes' ? 'Mon Bloc-notes' : 'Mes Objectifs'
          }
          subtitle="Tableau de bord Volontaire"
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          actions={<ExportOptions elementRef={exportRef} title={`Rapport-${user.name}`} />}
        />

        <div ref={exportRef} className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-10 pb-24 bg-[#F8FAFC]">
          {activeTab === 'mission' && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <VolunteerHero stats={stats} />

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 px-2">
                <DateFilter activePeriod={activePeriod} onFilterChange={setActivePeriod} />
                <div className="flex items-center gap-4 text-slate-400 font-bold text-xs uppercase bg-white p-2 px-4 rounded-lg border border-slate-100">
                  <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
                  Impact du mois : <span className="text-slate-900 font-black">+{stats?.totalCollected.toLocaleString()} BIF</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard label="Donateurs" value={stats?.donorCount || 0} icon={<Heart className="w-6 h-6" />} color="blue" trend="Actifs" />
                <StatCard label="Objectif" value={`${(stats?.goalAmount || 0).toLocaleString()} BIF`} icon={<Target className="w-6 h-6" />} color="purple" trend={`${Math.round(stats?.progressPercentage || 0)}% atteint`} />
                
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-lg text-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-indigo-200 fill-current" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Conseil Pro</span>
                    </div>
                    <p className="text-xl font-bold leading-tight">"Un message personnalisé augmente vos chances de 40%."</p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/10 text-[10px] text-indigo-300 font-bold uppercase tracking-widest leading-relaxed">
                    Personnalisez vos appels aux dons
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                <div className="xl:col-span-3 space-y-6">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight px-2">Historique des Dons</h2>
                    <div className="px-2">
                      <SearchFilter value={searchQuery} onChange={setSearchQuery} />
                    </div>
                  </div>
                  <Card className="p-2 md:p-6">
                    <DonorList donors={filteredDonors} />
                  </Card>
                </div>

                <div className="xl:col-span-2 space-y-6">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight px-2">Nouveau Don</h2>
                  <Card className="p-8">
                    <DonorForm 
                      volunteerId={user.id} 
                      onSuccess={() => {
                        fetchData(user.id);
                        setShowAddForm(false);
                      }} 
                    />
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <NotesPanel />
            </div>
          )}

          {activeTab === 'goals' && (
            <VolunteerGoals 
              stats={stats} 
              onUpdate={() => fetchData(user.id)} 
            />
          )}
        </div>
      </main>

      <button 
        onClick={() => setShowAddForm(true)}
        className="md:hidden fixed bottom-8 right-6 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white z-40 active:scale-90 transition-transform"
      >
        <Plus className="w-8 h-8" />
      </button>

      {showAddForm && (
        <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full rounded-lg p-8 max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setShowAddForm(false)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
            <h3 className="text-2xl font-black text-slate-800 mb-8">Ajouter un Don</h3>
            <DonorForm 
              volunteerId={user.id} 
              onSuccess={() => {
                fetchData(user.id);
                setShowAddForm(false);
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
