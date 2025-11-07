'use client';

import { useMemo, useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Recipient } from '../lib/types';
import { MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

type Props = {
  recipients: Recipient[];
  onDelete: (id: string) => void;
};

export function RecipientTable({ recipients, onDelete }: Props) {
  const [query, setQuery] = useState('');

  const columns = useMemo<ColumnDef<Recipient>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => <span className="font-medium text-slate-800">{info.getValue<string>()}</span>
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: (info) => <span className="font-mono text-slate-600">{info.getValue<string>()}</span>
      },
      {
        header: 'Variables',
        cell: ({ row }) => {
          const entries = Object.entries(row.original.variables ?? {});
          if (!entries.length) return <span className="text-slate-400">—</span>;
          return (
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              {entries.map(([key, value]) => (
                <span key={key} className="rounded-full bg-slate-100 px-2 py-1">
                  {key}: <span className="font-medium text-slate-600">{value || '—'}</span>
                </span>
              ))}
            </div>
          );
        }
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button
            onClick={() => onDelete(row.original.id)}
            className="inline-flex items-center gap-1 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:border-rose-200"
          >
            <TrashIcon className="h-4 w-4" />
            Remove
          </button>
        )
      }
    ],
    [onDelete]
  );

  const filteredRecipients = useMemo(() => {
    if (!query) return recipients;
    const normalizedQuery = query.toLowerCase();
    return recipients.filter((recipient) => {
      const values = [recipient.name, recipient.phone, ...Object.values(recipient.variables ?? {})];
      return values.some((value) => value?.toLowerCase().includes(normalizedQuery));
    });
  }, [query, recipients]);

  const table = useReactTable({
    data: filteredRecipients,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Audience Preview</h3>
          <p className="text-xs text-slate-500">{recipients.length} recipients total</p>
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 focus-within:border-brand-300 focus-within:text-brand-600">
          <MagnifyingGlassIcon className="h-4 w-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="w-32 bg-transparent text-sm text-slate-700 focus:outline-none"
          />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr key={row.id} className={clsx(rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/50')}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-slate-400">
                  No recipients match your filters yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
