import { z } from 'zod';

export const goalsSchema = z.object({
  amountGoal: z.coerce.number().min(1000, "L'objectif doit être d'au moins 1 000 BIF"),
  donorsGoal: z.coerce.number().min(1, "L'objectif doit être d'au moins 1 donateur"),
});

export type GoalsFormData = z.infer<typeof goalsSchema>;
