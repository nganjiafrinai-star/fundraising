import { MOCK_VOLUNTEERS, MOCK_DONORS, MOCK_SPONSORS, MOCK_SPONSOR_DONATIONS } from './mock-data';
import { Volunteer, Donor, AdminStats, DashboardStats, Sponsor, SponsorDonation } from '../types';

// System Simulation for persistence (using localStorage)
const getStoredDonors = (): Donor[] => {
  if (typeof window === 'undefined') return MOCK_DONORS;
  const stored = localStorage.getItem('donors');
  return stored ? JSON.parse(stored) : MOCK_DONORS;
};

const setStoredDonors = (donors: Donor[]) => {
  localStorage.setItem('donors', JSON.stringify(donors));
};

const getStoredVolunteers = (): Volunteer[] => {
  if (typeof window === 'undefined') return MOCK_VOLUNTEERS;
  const stored = localStorage.getItem('volunteers');
  return stored ? JSON.parse(stored) : MOCK_VOLUNTEERS;
};

const setStoredVolunteers = (volunteers: Volunteer[]) => {
  localStorage.setItem('volunteers', JSON.stringify(volunteers));
};

const getStoredSponsors = (): Sponsor[] => {
  if (typeof window === 'undefined') return MOCK_SPONSORS;
  const stored = localStorage.getItem('sponsors');
  return stored ? JSON.parse(stored) : MOCK_SPONSORS;
};

const getStoredSponsorDonations = (): SponsorDonation[] => {
  if (typeof window === 'undefined') return MOCK_SPONSOR_DONATIONS;
  const stored = localStorage.getItem('sponsorDonations');
  return stored ? JSON.parse(stored) : MOCK_SPONSOR_DONATIONS;
};

const setStoredSponsorDonations = (donations: SponsorDonation[]) => {
  localStorage.setItem('sponsorDonations', JSON.stringify(donations));
};

export const signupVolunteer = async (data: Omit<Volunteer, 'id' | 'role'>): Promise<Volunteer> => {
  // TODO: remplacer par appel API Express (POST /api/auth/signup)
  const newVolunteer: Volunteer = {
    ...data,
    id: `v${Date.now()}`,
    role: 'volunteer'
  };
  const volunteers = getStoredVolunteers();
  setStoredVolunteers([...volunteers, newVolunteer]);
  return newVolunteer;
};

export const loginVolunteer = async (email: string): Promise<Volunteer | null> => {
  // TODO: remplacer par appel API Express (POST /api/auth/login)
  const volunteers = getStoredVolunteers();
  return volunteers.find(v => v.email === email) || null;
};

export const loginSponsor = async (email: string): Promise<Sponsor | null> => {
  // TODO: remplacer par appel API Express (POST /api/auth/sponsor-login)
  const sponsors = getStoredSponsors();
  return sponsors.find(s => s.email === email) || null;
};

export const loginAdmin = async (password: string): Promise<boolean> => {
  // TODO: remplacer par appel API Express (POST /api/auth/admin-login)
  const ADMIN_PASSWORD = "amiel2007";
  return password === ADMIN_PASSWORD;
};

export const getVolunteers = async (): Promise<Volunteer[]> => {
  // TODO: remplacer par appel API Express (GET /api/volunteers)
  return getStoredVolunteers();
};

export const getDonors = async (volunteerId?: string): Promise<Donor[]> => {
  // TODO: remplacer par appel API Express (GET /api/donors)
  const donors = getStoredDonors();
  if (volunteerId) {
    return donors.filter(d => d.volunteerId === volunteerId);
  }
  return donors;
};

export const createDonor = async (data: Omit<Donor, 'id' | 'date'>): Promise<Donor> => {
  // TODO: remplacer par appel API Express (POST /api/donors)
  const newDonor: Donor = {
    ...data,
    id: `d${Date.now()}`,
    date: new Date().toISOString().split('T')[0]
  };
  const donors = getStoredDonors();
  setStoredDonors([...donors, newDonor]);
  return newDonor;
};

export const getDashboardStats = async (volunteerId: string, period: 'today' | 'week' | 'month' | 'all' = 'all'): Promise<DashboardStats> => {
  // TODO: remplacer par appel API Express (GET /api/stats/volunteer/:id?period=...)
  const volunteers = getStoredVolunteers();
  const volunteer = volunteers.find(v => v.id === volunteerId);
  let donors = getStoredDonors().filter(d => d.volunteerId === volunteerId);

  if (period !== 'all') {
    const now = new Date();
    donors = donors.filter(d => {
      const dDate = new Date(d.date);
      if (period === 'today') return dDate.toDateString() === now.toDateString();
      if (period === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return dDate >= weekAgo;
      }
      if (period === 'month') {
        return dDate.getMonth() === now.getMonth() && dDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }

  const totalCollected = donors.reduce((acc, d) => acc + d.amount, 0);
  const goalAmount = volunteer?.amountGoal || 0;

  return {
    totalCollected,
    donorCount: donors.length,
    goalAmount,
    progressPercentage: goalAmount > 0 ? (totalCollected / goalAmount) * 100 : 0
  };
};

export const getAdminStats = async (period: 'today' | 'week' | 'month' | 'all' = 'all'): Promise<AdminStats> => {
  // TODO: remplacer par appel API Express (GET /api/stats/admin?period=...)
  const allDonors = getStoredDonors();
  const allSponsorDonations = getStoredSponsorDonations();
  const volunteers = getStoredVolunteers();

  let donors = [...allDonors];
  let sponsorDonations = [...allSponsorDonations];

  if (period !== 'all') {
    const now = new Date();
    const filterByPeriod = (item: { date: string }) => {
      const dDate = new Date(item.date);
      if (period === 'today') return dDate.toDateString() === now.toDateString();
      if (period === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return dDate >= weekAgo;
      }
      if (period === 'month') {
        return dDate.getMonth() === now.getMonth() && dDate.getFullYear() === now.getFullYear();
      }
      return true;
    };

    donors = donors.filter(filterByPeriod);
    sponsorDonations = sponsorDonations.filter(filterByPeriod);
  }

  const totalGlobalCollected = donors.reduce((acc, d) => acc + d.amount, 0) + 
                             sponsorDonations.reduce((acc, sd) => acc + sd.amount, 0);

  const campaignTotal = allDonors.reduce((acc, d) => acc + d.amount, 0) + 
                      allSponsorDonations.reduce((acc, sd) => acc + sd.amount, 0);
  
  const rankings = volunteers.map((v, idx) => ({
    id: v.id || `v-rank-${idx}`,
    name: v.name,
    amount: allDonors.filter(d => d.volunteerId === v.id).reduce((acc, d) => acc + d.amount, 0)
  })).sort((a, b) => b.amount - a.amount);



  const methods = [...new Set([
    ...allDonors.map(d => d.paymentMethod),
    ...allSponsorDonations.map(sd => sd.paymentMethod)
  ])];
  const byPaymentMethod = methods.map(m => ({
    name: m,
    value: allDonors.filter(d => d.paymentMethod === m).reduce((acc, d) => acc + d.amount, 0) +
           allSponsorDonations.filter(sd => sd.paymentMethod === m).reduce((acc, sd) => acc + sd.amount, 0)
  })).sort((a, b) => b.value - a.value);

  const channels = [...new Set(donors.map(d => d.channel))];
  const byChannel = channels.map(c => ({
    name: c,
    value: donors.filter(d => d.channel === c).length
  }));

  return {
    totalGlobalCollected,
    campaignTotal,
    totalDonors: donors.length,
    totalVolunteers: volunteers.length,
    rankings,
    byChannel,
    byPaymentMethod,
    globalGoal: 32000000 // Goal of 32M BIF
  };
};


export const updateVolunteerGoals = async (volunteerId: string, data: { amountGoal: number, donorsGoal: number }): Promise<void> => {
  // TODO: remplacer par appel API Express (PATCH /api/volunteers/:id)
  const volunteers = getStoredVolunteers();
  const updatedVolunteers = volunteers.map(v =>
    v.id === volunteerId ? { ...v, amountGoal: data.amountGoal, donorsGoal: data.donorsGoal } : v
  );
  setStoredVolunteers(updatedVolunteers);

  // Update local session if needed
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const u = JSON.parse(storedUser);
    if (u.id === volunteerId) {
      localStorage.setItem('user', JSON.stringify({ ...u, ...data }));
    }
  }
};

export const getSponsors = async (): Promise<Sponsor[]> => {
  // TODO: remplacer par appel API Express (GET /api/sponsors)
  return getStoredSponsors();
};

export const getAllSponsorDonations = async (): Promise<SponsorDonation[]> => {
  // TODO: remplacer par appel API Express (GET /api/sponsor-donations)
  return getStoredSponsorDonations();
};

export const getSponsorDonations = async (sponsorId: string): Promise<SponsorDonation[]> => {
  // TODO: remplacer par appel API Express (GET /api/sponsor/:id/donations)
  const donations = getStoredSponsorDonations();
  return donations.filter(d => d.sponsorId === sponsorId);
};

export const createSponsorDonation = async (data: Omit<SponsorDonation, 'id' | 'date'>): Promise<SponsorDonation> => {
  // TODO: remplacer par appel API Express (POST /api/sponsor-donations)
  const newDonation: SponsorDonation = {
    ...data,
    id: `sd${Date.now()}`,
    date: new Date().toISOString().split('T')[0]
  };
  const donations = getStoredSponsorDonations();
  setStoredSponsorDonations([...donations, newDonation]);
  return newDonation;
};
