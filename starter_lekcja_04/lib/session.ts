import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Sesja = podpisane ciasteczko. Przeglądarka dostaje je po podaniu poprawnego hasła.
// Bez niego serwer nie wpuści nikogo do czatu ani do modelu.

export const SESSION_COOKIE = "sesja";
const SESSION_HOURS = 12;

function sign(value: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Brak SESSION_SECRET w .env.local");
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function passwordMatches(candidate: string): boolean {
  const password = process.env.CHAT_PASSWORD;
  if (!password) return false;
  // Porównujemy skróty, żeby długość hasła nie wpływała na czas odpowiedzi.
  return safeEqual(sign(`haslo:${candidate}`), sign(`haslo:${password}`));
}

export function createSessionValue(): string {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  return `${expires}.${sign(String(expires))}`;
}

export function isValidSessionValue(value: string | undefined): boolean {
  if (!value) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature) return false;
  if (Number(expires) < Date.now()) return false;
  try {
    return safeEqual(signature, sign(expires));
  } catch {
    return false;
  }
}

export async function hasSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_HOURS * 60 * 60,
};
