'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui';
import { getAdminStats, getVolunteers, getDonors, getSponsors, getAllSponsorDonations } from '@/lib/api';
import { AdminStats, Volunteer, Donor, Sponsor, SponsorDonation } from '@/types';
import { 
  LayoutDashboard, Users, Heart, Briefcase
} from 'lucide-react';
import { DonorList } from '@/components/dashboard/DonorList';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AdminOverview } from '@/components/dashboard/AdminOverview';
import { VolunteerList } from '@/components/dashboard/VolunteerList';
import { SponsorList } from '@/components/dashboard/SponsorList';
import { SearchFilter } from '@/components/filters/SearchFilter';
import { DateFilter } from '@/components/filters/DateFilter';
import { AdvancedFilters } from '@/components/filters/AdvancedFilters';
import { ExportOptions } from '@/components/export/ExportOptions';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sponsorDonations, setSponsorDonations] = useState<SponsorDonation[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'overview' | 'volunteers' | 'donors' | 'sponsors'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activePeriod, setActivePeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [filters, setFilters] = useState({
    channel: '',
    minAmount: '',
    maxAmount: '',
  });

  const exportRef = useRef<HTMLDivElement>(null);

  const fetchData = async (period: any = 'all') => {
    try {
      const [s, v, d, sp, sd] = await Promise.all([
        getAdminStats(period),
        getVolunteers(),
        getDonors(),
        getSponsors(),
        getAllSponsorDonations()
      ]);
      setStats(s);
      setVolunteers(v);
      setDonors(d);
      setFilteredDonors(d);
      setSponsors(sp);
      setSponsorDonations(sd);
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
    if (u.role !== 'admin') {
      router.push('/dashboard/volunteer');
      return;
    }
    fetchData(activePeriod);
  }, [router, activePeriod]);

  // Apply Filters & Search
  useEffect(() => {
    let result = donors;

    if (searchQuery) {
      result = result.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.channel) {
      result = result.filter(d => d.channel === filters.channel);
    }

    if (filters.minAmount) {
      result = result.filter(d => d.amount >= Number(filters.minAmount));
    }

    if (filters.maxAmount) {
      result = result.filter(d => d.amount <= Number(filters.maxAmount));
    }

    setFilteredDonors(result);
  }, [searchQuery, filters, donors]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  if (loading || !stats) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-lg h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const sidebarLinks = [
    { 
      id: 'overview', 
      label: 'Vue globale', 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      onClick: () => { setCurrentView('overview'); setMobileMenuOpen(false); },
      isActive: currentView === 'overview'
    },
    { 
      id: 'volunteers', 
      label: 'Volontaires', 
      icon: <Users className="w-5 h-5" />, 
      onClick: () => { setCurrentView('volunteers'); setMobileMenuOpen(false); },
      isActive: currentView === 'volunteers'
    },
    { 
      id: 'donors', 
      label: 'Donateurs', 
      icon: <Heart className="w-5 h-5" />, 
      onClick: () => { setCurrentView('donors'); setMobileMenuOpen(false); },
      isActive: currentView === 'donors'
    },
    { 
      id: 'sponsors', 
      label: 'Partenaires', 
      icon: <Briefcase className="w-5 h-5" />, 
      onClick: () => { setCurrentView('sponsors'); setMobileMenuOpen(false); },
      isActive: currentView === 'sponsors'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      <DashboardSidebar 
        user={{ name: 'Administrateur', role: 'Global Admin' }}
        links={sidebarLinks}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        variant="admin"
      />

      <main className="flex-1 overflow-x-hidden">
        <DashboardHeader 
          title={currentView === 'overview' ? 'Analyses Globales' : currentView === 'volunteers' ? 'Gestion Volontaires' : 'Registre Donateurs'}
          subtitle="Plateforme TTN Mission"
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          actions={<ExportOptions elementRef={exportRef} title="Rapport-Admin" />}
        />

        <div ref={exportRef} className="p-4 md:p-8 space-y-8 bg-[#F8FAFC]">
          {currentView === 'overview' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <DateFilter activePeriod={activePeriod} onFilterChange={setActivePeriod} />
              </div>
              <AdminOverview stats={stats} />
            </div>
          )}
          
          {currentView === 'volunteers' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <VolunteerList volunteers={volunteers} donors={donors} />
            </div>
          )}

          {currentView === 'donors' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SearchFilter value={searchQuery} onChange={setSearchQuery} placeholder="Rechercher un donateur..." />
                <AdvancedFilters 
                  filters={filters} 
                  setFilters={setFilters} 
                  onReset={() => {
                    setSearchQuery('');
                    setFilters({ channel: '', minAmount: '', maxAmount: '' });
                  }} 
                />
              </div>
              <Card title={`Registre des Donateurs (${filteredDonors.length})`}>
                <DonorList donors={filteredDonors} />
              </Card>
            </div>
          )}

          {currentView === 'sponsors' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Partenaires Corporate</h2>
                <p className="text-slate-500">Liste des entreprises et sponsors enregistrés.</p>
              </div>
              <SponsorList sponsors={sponsors} donations={sponsorDonations} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
