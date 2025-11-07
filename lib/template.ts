import { Recipient } from './types';

const templateRegExp = /{{\s*([a-zA-Z0-9_\.]+)\s*}}/g;

const getValue = (recipient: Recipient, key: string): string => {
  if (key === 'name') return recipient.name;
  if (key === 'phone') return recipient.phone;
  return recipient.variables[key] ?? '';
};

export function renderTemplate(template: string, recipient: Recipient): string {
  return template.replace(templateRegExp, (_, key: string) => getValue(recipient, key));
}

export function buildWhatsappUrl(message: string, phone: string): string {
  const normalized = phone.startsWith('+') ? phone.slice(1) : phone;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${encodedMessage}`;
}
