import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// ============================================================
// PROXY — kod, który działa przed każdą stroną i każdym endpointem.
// 1. Odświeża sesję Supabase (ciasteczka), żeby logowanie nie wygasało w trakcie pracy.
// 2. Niezalogowaną osobę przenosi ze stron aplikacji na /login.
// To pierwsza bramka. Każda strona i każdy endpoint i tak sprawdza użytkownika sam
// (getAuth() z lib/supabase-server.ts) — na samym proxy nie wolno polegać.
// ============================================================

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  let signedIn = false;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        // Odświeżoną sesję zapisujemy w zapytaniu (dla strony) i w odpowiedzi (dla przeglądarki).
        setAll: (cookiesToSet, headers) => {
          for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
          for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
        },
      },
    });
    // getClaims() sprawdza podpis sesji i w razie potrzeby ją odświeża.
    const { data } = await supabase.auth.getClaims();
    signedIn = Boolean(data?.claims?.sub);
  }

  const { pathname } = request.nextUrl;
  // Endpointy same odpowiadają 401, a powrót z Google (/auth/…) musi zawsze dojść do skutku.
  if (pathname.startsWith("/api/") || pathname.startsWith("/auth/")) return response;

  // Niezalogowany na stronie aplikacji → /login. Zalogowany na /login → czat.
  const onLogin = pathname === "/login";
  if (signedIn !== onLogin) return response;

  const target = request.nextUrl.clone();
  target.pathname = signedIn ? "/" : "/login";
  target.search = "";
  const redirect = NextResponse.redirect(target);
  for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
  return redirect;
}

export const config = {
  // Proxy pomija pliki statyczne i obrazki.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
