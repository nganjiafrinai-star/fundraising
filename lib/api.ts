import { Volunteer, Donor, AdminStats, DashboardStats, Sponsor, SponsorDonation } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fundraising-backend-9f6t.onrender.com/api';

// Helper to get token from localStorage
const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  const userJson = localStorage.getItem('user');
  if (!userJson) return {};
  try {
    const user = JSON.parse(userJson);
    return user.token ? { 'Authorization': `Bearer ${user.token}` } : {};
  } catch (e) {
    return {};
  }
};

// Generic fetcher
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...(options.headers || {}),
  } as any;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // Map _id to id if necessary
  if (Array.isArray(data)) {
    return data.map(item => ({ ...item, id: item._id || item.id })) as unknown as T;
  } else if (data && typeof data === 'object') {
    return { ...data, id: data._id || data.id } as unknown as T;
  }

  return data as T;
}

export const registerUser = async (data: any): Promise<any> => {
  return apiFetch<any>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const signupVolunteer = async (data: any): Promise<Volunteer> => {
  return registerUser({ ...data, role: 'volunteer' });
};

export const loginVolunteer = async (email: string, password?: string): Promise<Volunteer & { token: string }> => {
  return apiFetch<Volunteer & { token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password: password || 'password123' }),
  });
};

export const loginSponsor = async (email: string, password?: string): Promise<Sponsor & { token: string }> => {
  return apiFetch<Sponsor & { token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password: password || 'password123' }),
  });
};

export const loginAdmin = async (password: string): Promise<any> => {
  // We use common login route
  return apiFetch<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'ttnmission@contact.com', password }),
  });
};

export const getVolunteers = async (): Promise<Volunteer[]> => {
  return apiFetch<Volunteer[]>('/users?role=volunteer');
};

export const getDonors = async (volunteerId?: string): Promise<Donor[]> => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  if (user?.role === 'admin') {
    return apiFetch<Donor[]>('/donors/all');
  }
  return apiFetch<Donor[]>('/donors');
};

export const createDonor = async (data: Omit<Donor, 'id' | 'date'>): Promise<Donor> => {
  return apiFetch<Donor>('/donors', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getDashboardStats = async (volunteerId: string, period: string = 'all'): Promise<DashboardStats> => {
  return apiFetch<DashboardStats>(`/stats/dashboard?period=${period}`);
};

export const getAdminStats = async (period: string = 'all'): Promise<AdminStats> => {
  return apiFetch<AdminStats>(`/stats/admin?period=${period}`);
};

export const updateVolunteerGoals = async (volunteerId: string, data: { amountGoal: number, donorsGoal: number }): Promise<void> => {
  // Note: Backend might restrict this to admin only currently.
  return apiFetch<void>(`/users/${volunteerId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getSponsors = async (): Promise<Sponsor[]> => {
  return apiFetch<Sponsor[]>('/users?role=sponsor');
};

export const getAllSponsorDonations = async (): Promise<SponsorDonation[]> => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  if (user?.role === 'admin') {
    return apiFetch<SponsorDonation[]>('/sponsor-donations/all');
  }
  return apiFetch<SponsorDonation[]>('/sponsor-donations');
};

export const getSponsorDonations = async (sponsorId: string): Promise<SponsorDonation[]> => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  if (user?.role === 'admin') {
    return apiFetch<SponsorDonation[]>('/sponsor-donations/all');
  }
  return apiFetch<SponsorDonation[]>('/sponsor-donations');
};

export const createSponsorDonation = async (data: Omit<SponsorDonation, 'id' | 'date'>): Promise<SponsorDonation> => {
  return apiFetch<SponsorDonation>('/sponsor-donations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Note functions
export const getNotes = async (): Promise<any[]> => {
  return apiFetch<any[]>('/notes');
};

export const createNote = async (data: { title: string, content: string, isPinned?: boolean }): Promise<any> => {
  return apiFetch<any>('/notes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateNote = async (id: string, data: { title?: string, content?: string, isPinned?: boolean }): Promise<any> => {
  return apiFetch<any>(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteNote = async (id: string): Promise<void> => {
  return apiFetch<void>(`/notes/${id}`, {
    method: 'DELETE',
  });
};

export const updateDonor = async (id: string, data: Partial<Donor>): Promise<Donor> => {
  return apiFetch<Donor>(`/donors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const updateSponsorDonation = async (id: string, data: Partial<SponsorDonation>): Promise<SponsorDonation> => {
  return apiFetch<SponsorDonation>(`/sponsor-donations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Settings functions
export const getSettings = async (): Promise<any> => {
  return apiFetch<any>('/settings');
};

export const updateSettings = async (data: { globalGoal?: number, campaignName?: string }): Promise<any> => {
  return apiFetch<any>('/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

