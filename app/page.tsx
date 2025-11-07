'use client';

import { useMemo, useState } from 'react';
import { differenceInMinutes } from 'date-fns';
import { Recipient } from '../lib/types';
import { PageHeader } from '../components/PageHeader';
import { RecipientManager } from '../components/RecipientManager';
import { MessageComposer } from '../components/MessageComposer';
import { CampaignLaunchpad } from '../components/CampaignLaunchpad';

const defaultTemplate = `Hi {{name}}, this is {{sender}} from Nova Growth.

Thanks for showing interest in {{product}}. I have an update for you—can we chat today?`;

export default function Page() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [template, setTemplate] = useState(defaultTemplate);
  const [scheduledAt, setScheduledAt] = useState('');
  const [senderName, setSenderName] = useState('Isabella');

  const hydratedTemplate = useMemo(() => template.replace(/{{\s*sender\s*}}/g, senderName || 'Agent'), [template, senderName]);

  const nextReminder = useMemo(() => {
    if (!scheduledAt) return null;
    const reminderDate = new Date(scheduledAt);
    if (Number.isNaN(reminderDate.getTime())) return null;
    const minutesAway = differenceInMinutes(reminderDate, new Date());
    if (minutesAway < 1) return 'Due now';
    if (minutesAway < 60) return `${minutesAway} min left`;
    const hours = Math.round(minutesAway / 60);
    return `${hours} hour${hours === 1 ? '' : 's'} left`;
  }, [scheduledAt]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-10">
      <PageHeader />
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-8">
          <RecipientManager recipients={recipients} onRecipientsChange={setRecipients} />
          <MessageComposer
            template={template}
            onTemplateChange={setTemplate}
            scheduledAt={scheduledAt}
            onScheduleChange={setScheduledAt}
          />
        </div>
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-slate-900">Sender profile</h2>
              <p className="text-sm text-slate-500">Personalize the sender name to appear in your template.</p>
            </div>
            <input
              value={senderName}
              onChange={(event) => setSenderName(event.target.value)}
              placeholder="Your name"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            {nextReminder && <p className="text-xs text-slate-500">Reminder: {nextReminder}</p>}
          </section>
          <CampaignLaunchpad recipients={recipients} template={hydratedTemplate} scheduledAt={scheduledAt} />
        </div>
      </section>
    </main>
  );
}
