import { Recipient } from './types';

const stripPhone = (value: string) => value.replace(/[^0-9+]/g, '');

export function parseCsv(content: string): Recipient[] {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return [];

  const [headerLine, ...rows] = lines;
  const headers = headerLine
    .split(',')
    .map((h) => h.trim().toLowerCase());

  const nameIndex = headers.indexOf('name');
  const phoneIndex = headers.indexOf('phone');

  return rows
    .map((row, rowIndex) => {
      const values = row.split(',').map((value) => value.trim());
      if (values.length !== headers.length) return null;

      const name = nameIndex >= 0 ? values[nameIndex] : `Recipient ${rowIndex + 1}`;
      const phone = phoneIndex >= 0 ? values[phoneIndex] : values[0];

      if (!phone) return null;

      const variables = headers.reduce<Record<string, string>>((acc, header, index) => {
        if (header !== 'name' && header !== 'phone') {
          acc[header] = values[index] ?? '';
        }
        return acc;
      }, {});

      return {
        id: crypto.randomUUID(),
        name,
        phone: stripPhone(phone),
        variables
      } satisfies Recipient;
    })
    .filter((recipient): recipient is Recipient => Boolean(recipient));
}
