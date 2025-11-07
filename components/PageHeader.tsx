'use client';

import { useState } from 'react';
import { ArrowUpOnSquareIcon, PhoneArrowUpRightIcon } from '@heroicons/react/24/outline';

const copyTemplate = `name,phone,city,product
Jane Doe,+15555550123,San Francisco,Advisory Call
John Smith,+442079460000,London,Demo Request`;

export function PageHeader() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <header className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-3">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
          <PhoneArrowUpRightIcon className="h-4 w-4" />
          WhatsApp Campaigns
        </span>
        <h1 className="text-3xl font-semibold text-slate-900">WhatsApp Mass Messenger</h1>
        <p className="max-w-2xl text-base text-slate-600">
          Import contacts, personalize outreach with merge fields, and launch WhatsApp conversations in one click.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
        >
          <ArrowUpOnSquareIcon className="h-4 w-4" />
          {copied ? 'Template copied!' : 'Copy CSV template'}
        </button>
        <span>Need a quick start? Paste your leads into the template & import.</span>
      </div>
    </header>
  );
}
