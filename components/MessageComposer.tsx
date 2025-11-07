'use client';

import { ChangeEvent } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const snippets = [
  { label: 'Name', token: '{{name}}' },
  { label: 'Phone', token: '{{phone}}' },
  { label: 'Product', token: '{{product}}' },
  { label: 'City', token: '{{city}}' }
];

type Props = {
  template: string;
  onTemplateChange: (value: string) => void;
  scheduledAt: string;
  onScheduleChange: (value: string) => void;
};

export function MessageComposer({ template, onTemplateChange, scheduledAt, onScheduleChange }: Props) {
  const handleSnippetClick = (token: string) => {
    const textarea = document.getElementById('campaign-template') as HTMLTextAreaElement | null;
    if (!textarea) return;
    const { selectionStart = template.length, selectionEnd = template.length } = textarea;
    const before = template.slice(0, selectionStart);
    const after = template.slice(selectionEnd);
    const next = `${before}${token}${after}`;
    onTemplateChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = selectionStart + token.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const handleTemplateChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onTemplateChange(event.target.value);
  };

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-slate-900">Message</h2>
        <p className="text-sm text-slate-500">Personalize with merge fields to auto-fill contact details in WhatsApp.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {snippets.map((snippet) => (
          <button
            key={snippet.token}
            onClick={() => handleSnippetClick(snippet.token)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase text-slate-500 transition hover:border-brand-200 hover:text-brand-600"
          >
            {snippet.label}
          </button>
        ))}
      </div>
      <textarea
        id="campaign-template"
        value={template}
        onChange={handleTemplateChange}
        rows={8}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        <div className="flex items-start gap-2">
          <InformationCircleIcon className="mt-0.5 h-5 w-5 text-brand-500" />
          <p>
            WhatsApp web will open for each recipient. Review the message preview inside WhatsApp before hitting Send to stay compliant with WhatsApp&apos;s terms.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase text-slate-500">Schedule reminder (optional)</label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(event) => onScheduleChange(event.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </div>
    </section>
  );
}
