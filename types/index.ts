export type Role = 'volunteer' | 'admin' | 'sponsor';

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  email: string;
  amountGoal: number;
  donorsGoal: number;
  country: string;
  role: 'volunteer';
}

export interface Sponsor {
  id: string;
  name: string;
  email: string;
  role: 'sponsor';
}

export interface SponsorDonation {
  id: string;
  sponsorId: string;
  companyName: string;
  companyEmail: string;
  amount: number;
  paymentMethod: string;
  date: string;
  note?: string;
}




export interface Donor {
  id: string;
  volunteerId: string;
  name: string;
  phone: string;
  amount: number;
  paymentMethod: string;
  channel: string;
  note?: string;
  country: string;
  date: string;
}

export interface UserSession {
  user: Volunteer | Sponsor | { role: 'admin'; email: string };
  isLoggedIn: boolean;
}

export interface DashboardStats {
  totalCollected: number;
  donorCount: number;
  goalAmount: number;
  progressPercentage: number;
}

export interface AdminStats {
  totalGlobalCollected: number;
  totalDonors: number;
  totalVolunteers: number;
  rankings: { id: string; name: string; amount: number }[];
  byChannel: { name: string; value: number }[];
  byPaymentMethod: { name: string; value: number }[];
  globalGoal: number;
  campaignTotal: number;
}

export interface Note {
  id: string;
  volunteerId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isPinned?: boolean;
}



