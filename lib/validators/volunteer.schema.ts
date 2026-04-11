import { z } from 'zod';

export const volunteerSchema = z.object({
  name: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .min(1, "Le nom est requis"),
  phone: z.string()
    .min(1, "Le téléphone est requis"),
  email: z.string()
    .email("Format email invalide")
    .min(1, "L'email est requis"),
  amountGoal: z.coerce.number().min(660000, "L'objectif minimum est de 660,000 BIF"),
  donorsGoal: z.coerce.number().positive("L'objectif de donateurs doit être positif"),
  country: z.string().min(1, "Le pays est requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères")
});

export type VolunteerFormData = z.infer<typeof volunteerSchema>;

