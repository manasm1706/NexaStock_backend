import { randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

export function createId(prefix: string): string {
  return `${prefix}_${randomUUID().replaceAll("-", "")}`;
}

export function hashPassword(password: string): string {
  const salt = randomUUID().replaceAll("-", "");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  const [salt, derivedKey] = hash.split(":");
  if (!salt || !derivedKey) {
    return false;
  }

  const computed = scryptSync(password, salt, 64);
  const expected = Buffer.from(derivedKey, "hex");
  return expected.length === computed.length && timingSafeEqual(expected, computed);
}
