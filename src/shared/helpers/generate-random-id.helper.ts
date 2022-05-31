import { randomBytes } from 'crypto';

export function generateRandomId(length: 8 | 16 | 32 | 64 = 32): string {
  return randomBytes(length).toString('hex');
}
