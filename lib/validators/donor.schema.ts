import { z } from 'zod';

export const donorSchema = z.object({
  name: z.string().min(1, "Le nom du donateur est requis"),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  amount: z.coerce.number().positive("Le montant doit être supérieur à zéro"),
  paymentMethod: z.string().min(1, "Veuillez choisir un moyen de paiement"),
  channel: z.string().min(1, "Veuillez choisir un canal d'acquisition"),
  country: z.string().min(1, "Le pays est requis"),
  note: z.string().optional()
});

export type DonorFormData = z.infer<typeof donorSchema>;

// TODO: valider aussi côté backend (Express)
