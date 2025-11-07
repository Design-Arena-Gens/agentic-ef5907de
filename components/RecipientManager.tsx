'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseCsv } from '../lib/parseCsv';
import { Recipient } from '../lib/types';
import { RecipientTable } from './RecipientTable';
import { sampleRecipients } from '../lib/sampleRecipients';
import { ArrowUpTrayIcon, PlusCircleIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const manualSchema = z.object({
  name: z.string().min(1, 'Required'),
  phone: z
    .string()
    .min(6, 'Phone is required')
    .regex(/[0-9+]/, 'Phone must contain digits')
});

type ManualForm = z.infer<typeof manualSchema>;

type Props = {
  recipients: Recipient[];
  onRecipientsChange: (recipients: Recipient[]) => void;
};

export function RecipientManager({ recipients, onRecipientsChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ManualForm>({
    resolver: zodResolver(manualSchema),
    defaultValues: {
      name: '',
      phone: ''
    }
  });

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError(null);

    try {
      const text = await file.text();
      const parsed = parseCsv(text);
      if (!parsed.length) {
        setError('No records detected. Make sure your CSV includes name and phone columns.');
      } else {
        onRecipientsChange([...recipients, ...parsed]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to parse CSV file.');
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddSample = () => {
    onRecipientsChange([...recipients, ...sampleRecipients.map((recipient) => ({ ...recipient, id: crypto.randomUUID() }))]);
  };

  const onSubmitManual = (values: ManualForm) => {
    const formattedPhone = values.phone.replace(/[^0-9+]/g, '');
    const newRecipient: Recipient = {
      id: crypto.randomUUID(),
      name: values.name,
      phone: formattedPhone.startsWith('+') ? formattedPhone : `+${formattedPhone}`,
      variables: {}
    };
    onRecipientsChange([...recipients, newRecipient]);
    reset();
  };

  const handleDelete = (id: string) => {
    onRecipientsChange(recipients.filter((recipient) => recipient.id !== id));
  };

  const handleClear = () => {
    onRecipientsChange([]);
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Recipients</h2>
          <p className="text-sm text-slate-500">Upload a CSV list, add leads manually, or pull from the sample dataset.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:text-brand-600">
            <ArrowUpTrayIcon className="h-4 w-4" />
            {importing ? 'Importing…' : 'Upload CSV'}
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
          </label>
          <button
            onClick={handleAddSample}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:text-brand-600"
          >
            <UserPlusIcon className="h-4 w-4" />
            Append sample data
          </button>
          {recipients.length > 0 && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-200"
            >
              <TrashIcon className="h-4 w-4" />
              Clear all
            </button>
          )}
        </div>
        {error && <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        <form onSubmit={handleSubmit(onSubmitManual)} className="grid gap-3 sm:grid-cols-[1fr,1fr,auto]">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase text-slate-500">Name</label>
            <input
              {...register('name')}
              placeholder="Jane Doe"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            {errors.name && <span className="text-xs text-rose-500">{errors.name.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase text-slate-500">Phone</label>
            <input
              {...register('phone')}
              placeholder="+15551234567"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            {errors.phone && <span className="text-xs text-rose-500">{errors.phone.message}</span>}
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <PlusCircleIcon className="h-4 w-4" />
            Add
          </button>
        </form>
      </div>
      <RecipientTable recipients={recipients} onDelete={handleDelete} />
    </section>
  );
}
