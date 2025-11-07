'use client';

import { useMemo, useState } from 'react';
import { CheckCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { Recipient } from '../lib/types';
import { buildWhatsappUrl, renderTemplate } from '../lib/template';

const PREVIEW_LIMIT = 5;

type Props = {
  recipients: Recipient[];
  template: string;
  scheduledAt: string;
};

export function CampaignLaunchpad({ recipients, template, scheduledAt }: Props) {
  const [launching, setLaunching] = useState(false);
  const [completed, setCompleted] = useState(false);

  const previews = useMemo(() => recipients.slice(0, PREVIEW_LIMIT).map((recipient) => ({
    ...recipient,
    message: renderTemplate(template, recipient)
  })), [recipients, template]);

  const reminder = useMemo(() => {
    if (!scheduledAt) return null;
    const date = new Date(scheduledAt);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString();
  }, [scheduledAt]);

  const canLaunch = recipients.length > 0 && template.trim().length > 0;

  const handleLaunch = () => {
    if (!canLaunch) return;
    setLaunching(true);
    setCompleted(false);

    const windows: Window[] = [];
    recipients.forEach((recipient, index) => {
      const message = renderTemplate(template, recipient);
      const url = buildWhatsappUrl(message, recipient.phone);
      setTimeout(() => {
        const handle = window.open(url, '_blank');
        if (handle) {
          windows.push(handle);
        }
        if (index === recipients.length - 1) {
          setLaunching(false);
          setCompleted(true);
        }
      }, index * 400);
    });
  };

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-slate-900">Launchpad</h2>
        <p className="text-sm text-slate-500">Review personalization, then trigger WhatsApp web tabs for each recipient.</p>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Recipients</p>
          <p className="text-2xl font-semibold text-slate-800">{recipients.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Previewed</p>
          <p className="text-2xl font-semibold text-slate-800">{Math.min(previews.length, PREVIEW_LIMIT)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Reminder</p>
          <p className="text-sm font-medium text-slate-700">{reminder ?? 'Not scheduled'}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase text-slate-500">Preview</span>
        <div className="flex flex-col gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
          {previews.length === 0 ? (
            <p className="text-sm text-slate-400">Add recipients to preview the personalized message.</p>
          ) : (
            previews.map((preview) => (
              <div key={preview.id} className="rounded-lg bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{preview.name}</span>
                  <span className="font-mono text-slate-400">{preview.phone}</span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{preview.message}</p>
              </div>
            ))
          )}
          {recipients.length > PREVIEW_LIMIT && (
            <p className="text-xs text-slate-400">+ {recipients.length - PREVIEW_LIMIT} more contacts.</p>
          )}
        </div>
      </div>
      <button
        onClick={handleLaunch}
        disabled={!canLaunch || launching}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <PaperAirplaneIcon className="h-5 w-5" />
        {launching ? 'Launching…' : 'Open WhatsApp chats'}
      </button>
      {completed && (
        <p className="inline-flex items-center gap-2 text-sm text-brand-600">
          <CheckCircleIcon className="h-5 w-5" />
          All chats opened. Confirm each message inside WhatsApp to complete delivery.
        </p>
      )}
    </section>
  );
}
