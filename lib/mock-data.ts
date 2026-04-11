import { Volunteer, Donor, Sponsor, SponsorDonation } from '../types';

export const MOCK_VOLUNTEERS: Volunteer[] = [
  {
    id: 'v1',
    name: 'Amiel',
    phone: '0123456789',
    email: 'amiel@example.com',
    amountGoal: 5000,
    donorsGoal: 50,
    country: "Burundi",
    role: 'volunteer'
  },
  {
    id: 'v2',
    name: 'Sarah',
    phone: '0987654321',
    email: 'sarah@example.com',
    amountGoal: 3000,
    donorsGoal: 30,
    country: "Burundi",
    role: 'volunteer'
  },
  {
    id: 'v3',
    name: 'Thomas',
    phone: '0654321987',
    email: 'thomas@example.com',
    amountGoal: 4500,
    donorsGoal: 40,
    country: "Burundi",
    role: 'volunteer'
  },
  {
    id: 'v4',
    name: 'Julie',
    phone: '0789456123',
    email: 'julie@example.com',
    amountGoal: 2000,
    donorsGoal: 20,
    country: "Burundi",
    role: 'volunteer'
  },
  {
    id: 'v5',
    name: 'Luc',
    phone: '0612345678',
    email: 'luc@example.com',
    amountGoal: 6000,
    donorsGoal: 60,
    country: "Burundi",
    role: 'volunteer'
  }
];

export const MOCK_DONORS: Donor[] = [
  {
    id: 'd1',
    volunteerId: 'v1',
    name: 'Jean Dupont',
    phone: '0611223344',
    amount: 150,
    paymentMethod: 'Carte Bancaire',
    channel: 'Réseaux Sociaux',
    date: '2024-03-20',
    country: 'Burundi',
    note: 'Premier don'
  },
  {
    id: 'd2',
    volunteerId: 'v1',
    name: 'Marie Curie',
    phone: '0622334455',
    amount: 500,
    paymentMethod: 'Virement',
    channel: 'Email',
    country: 'Burundi',
    date: '2024-03-22'
  },
  {
    id: 'd3',
    volunteerId: 'v2',
    name: 'Albert Einstein',
    phone: '0633445566',
    amount: 50,
    paymentMethod: 'Espèces',
    channel: 'Direct',
    country: 'Burundi',
    date: '2024-03-25'
  },
  {
    id: 'd4',
    volunteerId: 'v3',
    name: 'Isaac Newton',
    phone: '0644556677',
    amount: 1000,
    paymentMethod: 'Virement',
    channel: 'Téléphone',
    country: 'Burundi',
    date: '2024-03-26'
  },
  {
    id: 'd5',
    volunteerId: 'v1',
    name: 'Ada Lovelace',
    phone: '0655667788',
    amount: 250,
    paymentMethod: 'Carte Bancaire',
    channel: 'Réseaux Sociaux',
    country: 'France',
    date: '2024-03-27'
  },
  {
    id: 'd6',
    volunteerId: 'v4',
    name: 'Alan Turing',
    phone: '0666778899',
    amount: 300,
    paymentMethod: 'Chèque',
    channel: 'Direct',
    country: 'Belgique',
    date: '2024-03-28'
  },
  {
    id: 'd7',
    volunteerId: 'v5',
    name: 'Nikola Tesla',
    phone: '0677889900',
    amount: 75,
    paymentMethod: 'Carte Bancaire',
    channel: 'Email',
    country: 'Canada',
    date: '2024-03-29'
  },
  {
    id: 'd8',
    volunteerId: 'v2',
    name: 'Grace Hopper',
    phone: '0688990011',
    amount: 120,
    paymentMethod: 'Espèces',
    channel: 'Direct',
    country: 'Burundi',
    date: '2024-03-30'
  },
  {
    id: 'd9',
    volunteerId: 'v3',
    name: 'Katherine Johnson',
    phone: '0699001122',
    amount: 400,
    paymentMethod: 'Virement',
    channel: 'Email',
    country: 'Suisse',
    date: '2024-03-31'
  },
  {
    id: 'd10',
    volunteerId: 'v1',
    name: 'Margaret Hamilton',
    phone: '0612349876',
    amount: 200,
    paymentMethod: 'Carte Bancaire',
    channel: 'Téléphone',
    country: 'Burundi',
    date: '2024-04-01'
  }
];

export const MOCK_SPONSORS: Sponsor[] = [
  {
    id: 's2',
    name: "Nova Soft",
    email: "contact@novasoft.net",
    role: 'sponsor'
  },
  {
    id: 's3',
    name: "Eco Bank",
    email: "partnership@ecobank.bi",
    role: 'sponsor'
  }
];

export const MOCK_SPONSOR_DONATIONS: SponsorDonation[] = [
  {
    id: 'sd2',
    sponsorId: 's2',
    companyName: 'Lumière Tech',
    companyEmail: 'info@lumieretech.com',
    amount: 5000000,
    paymentMethod: 'Stripe',
    date: '2024-04-05',
    note: 'Digital transformation support'
  },
  {
    id: 'sd3',
    sponsorId: 's3',
    companyName: 'Bralima',
    companyEmail: 'contact@bralima.bi',
    amount: 10000000,
    paymentMethod: 'Paypal',
    date: '2024-04-08',
    note: 'Main sponsorship 2024'
  }


];




