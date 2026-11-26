"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

// Zalogowana osoba w nagłówku: zdjęcie i imię z konta Google (gdy są) albo sam e-mail,
// oraz przycisk „Wyloguj”. Dane przychodzą z serwera — z sesji sprawdzonej przez getAuth().
export type HeaderUser = {
  email: string;
  name: string | null;
  avatarUrl: string | null;
};

export default function UserMenu({ user }: { user: HeaderUser }) {
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    // Wylogowanie kasuje ciasteczka sesji. Potem wczytujemy /login od zera,
    // żeby na ekranie nie zostały dane poprzedniej osoby.
    await supabaseBrowser()
      .auth.signOut()
      .catch(() => null);
    window.location.assign("/login");
  }

  return (
    <div className="user">
      {user.avatarUrl && (
        // Zwykły znacznik img: zdjęcie pochodzi z serwerów Google.
        <img className="avatar" src={user.avatarUrl} alt="" width={28} height={28} referrerPolicy="no-referrer" />
      )}
      <span className="user-name" title={user.email}>
        {user.name ?? user.email}
      </span>
      <button type="button" className="ghost" onClick={logout} disabled={busy}>
        Wyloguj
      </button>
    </div>
  );
}
