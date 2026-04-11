'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select } from '../ui';
import { createDonor } from '@/lib/api';
import { donorSchema, DonorFormData } from '@/lib/validators/donor.schema';
import { countries } from '@/lib/countries';
import toast from 'react-hot-toast';

export const DonorForm = ({ volunteerId, onSuccess }: { volunteerId: string, onSuccess: () => void }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid }
  } = useForm<DonorFormData>({
    resolver: zodResolver(donorSchema) as any,
    defaultValues: {
      name: '',
      phone: '',
      paymentMethod: 'Carte Bancaire',
      channel: 'Direct',
      country: 'Burundi',
      note: ''
    }
  });

  const onSubmit: SubmitHandler<DonorFormData> = async (data) => {
    try {
      await createDonor({
        volunteerId,
        ...data
      });
      toast.success('🎉 Nouveau don enregistré !');
      reset();
      onSuccess();
    } catch (error) {
      toast.error('❌ Erreur lors de l’ajout');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Nom complet"
        placeholder="Amiel"
        error={errors.name?.message}
        {...register('name')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Téléphone"
          placeholder="+257..."
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label="Montant (BIF)"
          type="number"
          placeholder="50"
          error={errors.amount?.message}
          {...register('amount')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Moyen de paiement"
          error={errors.paymentMethod?.message}
          options={[
            { label: 'Carte Bancaire', value: 'Carte Bancaire' },
            { label: 'EcoCash', value: 'EcoCash' },
            { label: 'Lumicash', value: 'Lumicash' },
            { label: 'Paypal', value: 'Paypal' },
            { label: 'eNoti', value: 'eNoti' },
            { label: 'Chèque', value: 'Chèque' },
            { label: 'Stripe', value: 'Stripe' },
          ]}
          {...register('paymentMethod')}
        />
        <Select
          label="Canal"
          error={errors.channel?.message}
          options={[
            { label: 'Direct', value: 'Direct' },
            { label: 'Réseaux Sociaux', value: 'Réseaux Sociaux' },
            { label: 'Email', value: 'Email' },
            { label: 'Téléphone', value: 'Téléphone' },
          ]}
          {...register('channel')}
        />
      </div>
      
      <Select
        label="Pays du donateur"
        options={countries}
        error={errors.country?.message}
        {...register('country')}
      />

      <Input
        label="Note (facultatif)"
        placeholder="Informations supplémentaires..."
        error={errors.note?.message}
        {...register('note')}
      />
      <Button type="submit" disabled={isSubmitting || !isValid} className="w-full mt-2 transition-all">
        {isSubmitting ? 'Ajout en cours...' : 'Ajouter le donateur'}
      </Button>
    </form>
  );
};
