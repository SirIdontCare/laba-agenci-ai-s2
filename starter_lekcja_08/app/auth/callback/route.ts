import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Powrót z logowania przez Google. Supabase odsyła tu przeglądarkę z jednorazowym kodem
// (/auth/callback?code=…). Wymieniamy kod na sesję — zapisuje się w ciasteczkach —
// i przenosimy do czatu. Gdy coś pójdzie nie tak, wracamy na /login z komunikatem.
export async function GET(request: NextRequest) {
  // Adresy budujemy z adresu, pod którym aplikacja właśnie działa — zawsze wewnątrz aplikacji.
  const home = new URL("/", request.url);
  const failed = new URL("/login?blad=google", request.url);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const code = request.nextUrl.searchParams.get("code");
  if (!url || !key || !code) return NextResponse.redirect(failed);

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("Logowanie przez Google się nie udało:", error.message);
    return NextResponse.redirect(failed);
  }
  return NextResponse.redirect(home);
}
