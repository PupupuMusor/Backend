export type CodeType =
  | 'email_confirm'
  | 'email_link'
  | 'password_reset'
  | 'password_reset_confirmed';

import * as bcrypt from 'bcrypt';

interface CodeEntry {
  codeHash: string;
  expires: number;
  type: CodeType;
  attempts: number;
}

const codeStore = new Map<string, CodeEntry>();

function makeKey(userId: string, type: CodeType, target: string) {
  return `${userId}:${type}:${target}`;
}

export async function setCode(
  userId: string,
  type: CodeType,
  target: string,
  code: string,
  ttlMs: number,
) {
  const codeHash = await bcrypt.hash(code, 10);
  const key = makeKey(userId, type, target);
  const expires = Date.now() + ttlMs;
  codeStore.set(key, { codeHash, expires, type, attempts: 0 });
  setTimeout(() => {
    codeStore.delete(key);
  }, ttlMs);
}

export async function verifyCode(
  userId: string,
  type: CodeType,
  target: string,
  code: string,
  maxAttempts = 5,
) {
  const key = makeKey(userId, type, target);
  const entry = codeStore.get(key);
  if (!entry) return false;
  if (Date.now() > entry.expires) {
    codeStore.delete(key);
    return false;
  }
  if (entry.attempts >= maxAttempts) {
    codeStore.delete(key);
    return false;
  }

  const match = await bcrypt.compare(code, entry.codeHash);
  if (!match) {
    entry.attempts++;
    return false;
  }

  codeStore.delete(key);
  return true;
}

export function deleteCode(userId: string, type: CodeType, target: string) {
  codeStore.delete(makeKey(userId, type, target));
}
