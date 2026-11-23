import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  createSessionValue,
  passwordMatches,
  sessionCookieOptions,
} from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!process.env.CHAT_PASSWORD || !process.env.SESSION_SECRET) {
    return Response.json(
      { error: "Brak CHAT_PASSWORD albo SESSION_SECRET w konfiguracji." },
      { status: 500 },
    );
  }

  if (!passwordMatches(password)) {
    return Response.json({ error: "Błędne hasło." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionValue(), sessionCookieOptions);
  return Response.json({ ok: true });
}
