export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};


export const calculateProgress = (current: number, goal: number): number => {
  if (goal <= 0) return 0;
  return Math.min(100, (current / goal) * 100);
};


export const getChartColor = (index: number): string => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  return colors[index % colors.length];
};
