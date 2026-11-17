// ============================================================
// ŹRÓDŁA DANYCH — zwykłe funkcje pobierające dane z darmowych API (bez kluczy).
// Korzystają z nich narzędzia agenta (lib/tools.ts) i strona /dashboard (lib/trip.ts).
//
// Zasada: funkcja nigdy nie „wywala” aplikacji. Gdy coś pójdzie nie tak,
// zwraca { blad: "czytelny komunikat po polsku" }.
// Udany wynik ma zawsze pola: opis (jedno zdanie dla człowieka), zrodlo i pobrano.
// ============================================================

const TIMEOUT_MS = 10_000; // tyle najdłużej czekamy na odpowiedź jednego API

export type Blad = { blad: string; pobrano: string };

// Godzina pobrania danych — pokazujemy ją przy każdym wyniku.
export function teraz(): string {
  return new Date().toLocaleString("pl-PL", {
    timeZone: "Europe/Warsaw",
    dateStyle: "short",
    timeStyle: "medium",
  });
}

function blad(komunikat: string): Blad {
  return { blad: komunikat, pobrano: teraz() };
}

// Pobiera JSON z adresu. Zwraca kod odpowiedzi i dane albo null, gdy API nie odpowiada.
async function pobierzJson(url: string): Promise<{ status: number; dane: any } | null> {
  try {
    const odpowiedz = await fetch(url, {
      headers: { "User-Agent": "agent-kursowy/1.0 (projekt edukacyjny)", Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const dane = await odpowiedz.json().catch(() => null);
    return { status: odpowiedz.status, dane };
  } catch {
    return null;
  }
}

// Dzisiejsza data w podanej strefie, w formacie RRRR-MM-DD.
export function dzisiaj(strefa = "Europe/Warsaw"): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: strefa }).format(new Date());
}

// ---------- 1. POGODA (Open-Meteo) ----------

export type Miejsce = {
  nazwa: string;
  kraj: string;
  kodKraju: string; // np. "PT"
  szerokosc: number;
  dlugosc: number;
  strefa: string; // np. "Europe/Lisbon"
};

// Zamienia nazwę miasta na współrzędne, kraj i strefę czasową.
export async function znajdzMiasto(nazwa: string): Promise<Miejsce | Blad> {
  const wynik = await pobierzJson(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nazwa)}&count=1&language=pl&format=json`,
  );
  if (!wynik || wynik.status !== 200) return blad("Źródło Open-Meteo nie odpowiada. Spróbuj za chwilę.");

  const miasto = wynik.dane?.results?.[0];
  if (!miasto) return blad(`Nie znalazłem miasta „${nazwa}”. Sprawdź pisownię.`);

  return {
    nazwa: miasto.name,
    kraj: miasto.country ?? "",
    kodKraju: miasto.country_code ?? "",
    szerokosc: miasto.latitude,
    dlugosc: miasto.longitude,
    strefa: miasto.timezone ?? "UTC",
  };
}

// Kody pogody WMO używane przez Open-Meteo.
const OPISY_POGODY: Record<number, string> = {
  0: "bezchmurnie",
  1: "prawie bezchmurnie",
  2: "częściowe zachmurzenie",
  3: "pochmurno",
  45: "mgła",
  48: "mgła osadzająca szadź",
  51: "lekka mżawka",
  53: "mżawka",
  55: "gęsta mżawka",
  56: "marznąca mżawka",
  57: "gęsta marznąca mżawka",
  61: "słaby deszcz",
  63: "deszcz",
  65: "silny deszcz",
  66: "marznący deszcz",
  67: "silny marznący deszcz",
  71: "słaby śnieg",
  73: "śnieg",
  75: "silny śnieg",
  77: "ziarna śnieżne",
  80: "przelotny deszcz",
  81: "przelotne opady deszczu",
  82: "gwałtowne ulewy",
  85: "przelotny śnieg",
  86: "silne opady śniegu",
  95: "burza",
  96: "burza z gradem",
  99: "silna burza z gradem",
};

export type Pogoda = {
  miasto: string;
  kraj: string;
  data: string;
  pogoda: string;
  temperaturaMin: number; // °C
  temperaturaMax: number; // °C
  szansaOpadow: number | null; // %
  wiatrMaks: number; // km/h
  opis: string;
  zrodlo: string;
  pobrano: string;
};

// Prognoza dla znalezionego już miejsca.
export async function prognozaDlaMiejsca(miejsce: Miejsce, data?: string): Promise<Pogoda | Blad> {
  const dzien = data || dzisiaj(miejsce.strefa);
  const wynik = await pobierzJson(
    "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${miejsce.szerokosc}&longitude=${miejsce.dlugosc}` +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max" +
      `&timezone=auto&start_date=${dzien}&end_date=${dzien}`,
  );
  if (!wynik) return blad("Źródło Open-Meteo nie odpowiada. Spróbuj za chwilę.");

  const dzienne = wynik.dane?.daily;
  if (wynik.status !== 200 || !dzienne?.time?.length || dzienne.temperature_2m_max[0] == null) {
    return blad(`Brak prognozy na dzień ${dzien}. Open-Meteo podaje prognozę najwyżej na 16 dni naprzód.`);
  }

  const pogoda = OPISY_POGODY[dzienne.weather_code[0]] ?? "brak opisu";
  const min = dzienne.temperature_2m_min[0];
  const max = dzienne.temperature_2m_max[0];
  const opady = dzienne.precipitation_probability_max[0] ?? null;
  const wiatr = dzienne.wind_speed_10m_max[0];

  return {
    miasto: miejsce.nazwa,
    kraj: miejsce.kraj,
    data: dzien,
    pogoda,
    temperaturaMin: min,
    temperaturaMax: max,
    szansaOpadow: opady,
    wiatrMaks: wiatr,
    opis:
      `${miejsce.nazwa}, ${dzien}: ${pogoda}, od ${min} do ${max} °C` +
      (opady == null ? "" : `, szansa opadów ${opady}%`) +
      `, wiatr do ${wiatr} km/h`,
    zrodlo: "Open-Meteo",
    pobrano: teraz(),
  };
}

// Prognoza dla miasta podanego nazwą (najpierw szukamy miasta, potem prognozy).
export async function pobierzPogode(miasto: string, data?: string): Promise<Pogoda | Blad> {
  const miejsce = await znajdzMiasto(miasto);
  if ("blad" in miejsce) return miejsce;
  return prognozaDlaMiejsca(miejsce, data);
}

// ---------- 2. WALUTY (NBP) ----------

export type Kurs = {
  waluta: string; // kod, np. "EUR"
  nazwa: string;
  kurs: number; // ile złotych kosztuje 1 jednostka waluty
  dataKursu: string; // NBP publikuje kursy w dni robocze — to data ostatniego kursu
  kwota?: number;
  wZlotych?: number;
  opis: string;
  zrodlo: string;
  pobrano: string;
};

// Średni kurs waluty wobec złotego (tabela A NBP) i opcjonalne przeliczenie kwoty na złote.
export async function pobierzKurs(waluta: string, kwota?: number): Promise<Kurs | Blad> {
  const kod = waluta.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(kod)) return blad("Podaj trzyliterowy kod waluty, np. EUR, USD albo GBP.");
  if (kod === "PLN") return blad("Złoty to waluta bazowa — kurs złotego do złotego to zawsze 1.");

  const wynik = await pobierzJson(`https://api.nbp.pl/api/exchangerates/rates/a/${kod.toLowerCase()}/?format=json`);
  if (!wynik) return blad("Źródło NBP nie odpowiada. Spróbuj za chwilę.");

  const ostatni = wynik.dane?.rates?.[0];
  if (wynik.status !== 200 || !ostatni) return blad(`NBP nie podaje kursu waluty „${kod}”. Sprawdź kod waluty.`);

  const kurs: number = ostatni.mid;
  const wZlotych = kwota == null ? undefined : Math.round(kwota * kurs * 100) / 100;

  return {
    waluta: kod,
    nazwa: wynik.dane.currency,
    kurs,
    dataKursu: ostatni.effectiveDate,
    kwota,
    wZlotych,
    opis:
      `1 ${kod} = ${kurs} zł (kurs średni NBP z ${ostatni.effectiveDate})` +
      (wZlotych == null ? "" : `; ${kwota} ${kod} = ${wZlotych} zł`),
    zrodlo: "NBP",
    pobrano: teraz(),
  };
}

// ---------- 3. ŚWIĘTA (Nager.Date) ----------

export type Swieto = { data: string; nazwa: string; nazwaLokalna: string; tylkoRegionalne: boolean };

export type Swieta = {
  kodKraju: string;
  rok: number;
  swieta: Swieto[];
  opis: string;
  zrodlo: string;
  pobrano: string;
};

// Dni wolne od pracy w kraju (dwuliterowy kod, np. "PT") i roku.
export async function pobierzSwieta(kodKraju: string, rok: number): Promise<Swieta | Blad> {
  const kod = kodKraju.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(kod)) return blad("Podaj dwuliterowy kod kraju, np. PL, PT albo DE.");

  const wynik = await pobierzJson(`https://date.nager.at/api/v3/PublicHolidays/${rok}/${kod}`);
  if (!wynik) return blad("Źródło Nager.Date nie odpowiada. Spróbuj za chwilę.");
  if (wynik.status !== 200 || !Array.isArray(wynik.dane)) {
    return blad(`Nie mam listy świąt dla kraju „${kod}” w roku ${rok}. Sprawdź kod kraju.`);
  }

  const swieta: Swieto[] = wynik.dane
    .filter((swieto: any) => swieto.types?.includes("Public"))
    .map((swieto: any) => ({
      data: swieto.date,
      nazwa: swieto.name,
      nazwaLokalna: swieto.localName,
      tylkoRegionalne: !swieto.global,
    }));

  return {
    kodKraju: kod,
    rok,
    swieta,
    opis: `${kod}, rok ${rok}: ${swieta.length} dni wolnych od pracy`,
    zrodlo: "Nager.Date",
    pobrano: teraz(),
  };
}

// Kilka najbliższych dni wolnych, licząc od podanej daty (RRRR-MM-DD).
export async function najblizszeSwieta(kodKraju: string, odDaty: string, ile = 3): Promise<Swieta | Blad> {
  const rok = Number(odDaty.slice(0, 4));
  const tenRok = await pobierzSwieta(kodKraju, rok);
  if ("blad" in tenRok) return tenRok;

  let lista = tenRok.swieta.filter((swieto) => swieto.data >= odDaty);
  if (lista.length < ile) {
    // Pod koniec roku dobieramy święta z początku następnego.
    const nastepnyRok = await pobierzSwieta(kodKraju, rok + 1);
    if (!("blad" in nastepnyRok)) lista = [...lista, ...nastepnyRok.swieta];
  }
  lista = lista.slice(0, ile);

  return {
    ...tenRok,
    swieta: lista,
    opis: lista.length
      ? lista.map((swieto) => `${swieto.data} — ${swieto.nazwaLokalna}`).join("; ")
      : "Brak dni wolnych w najbliższym czasie",
    pobrano: teraz(),
  };
}

// ---------- 4. WIKIPEDIA (polska) ----------

export type Artykul = {
  tytul: string;
  streszczenie: string;
  link: string;
  opis: string;
  zrodlo: string;
  pobrano: string;
};

const WIKI = "https://pl.wikipedia.org";

function streszczenieStrony(tytul: string) {
  return pobierzJson(`${WIKI}/api/rest_v1/page/summary/${encodeURIComponent(tytul.replaceAll(" ", "_"))}`);
}

// Krótkie streszczenie hasła z polskiej Wikipedii i link do artykułu.
export async function pobierzWikipedie(haslo: string): Promise<Artykul | Blad> {
  let wynik = await streszczenieStrony(haslo.trim());
  if (!wynik) return blad("Wikipedia nie odpowiada. Spróbuj za chwilę.");

  // Nie ma strony o dokładnie takim tytule — szukamy najbliższego hasła.
  if (wynik.status === 404) {
    const szukanie = await pobierzJson(
      `${WIKI}/w/api.php?action=query&list=search&srlimit=1&format=json&srsearch=${encodeURIComponent(haslo)}`,
    );
    const znaleziony = szukanie?.dane?.query?.search?.[0]?.title;
    if (!znaleziony) return blad(`Nie znalazłem w polskiej Wikipedii hasła „${haslo}”.`);
    wynik = await streszczenieStrony(znaleziony);
  }

  const streszczenie: string = wynik?.dane?.extract ?? "";
  if (!wynik || wynik.status !== 200 || !streszczenie) {
    return blad(`Nie znalazłem w polskiej Wikipedii hasła „${haslo}”.`);
  }

  const krotkie = streszczenie.length > 700 ? `${streszczenie.slice(0, 700)}…` : streszczenie;
  return {
    tytul: wynik.dane.title,
    streszczenie: krotkie,
    link: wynik.dane.content_urls?.desktop?.page ?? `${WIKI}/wiki/${encodeURIComponent(wynik.dane.title)}`,
    opis: `${wynik.dane.title}: ${krotkie}`,
    zrodlo: "Wikipedia",
    pobrano: teraz(),
  };
}

// ---------- 5. KALKULATOR ----------

export type Dzialanie = "dodaj" | "odejmij" | "pomnoz" | "podziel";

const ZNAKI: Record<Dzialanie, string> = { dodaj: "+", odejmij: "−", pomnoz: "×", podziel: "÷" };

export type Obliczenie = { dzialanie: Dzialanie; a: number; b: number; wynik: number; opis: string; pobrano: string };

// Liczymy sami na dwóch liczbach — nie wykonujemy żadnego kodu wpisanego przez użytkownika.
export function policz(dzialanie: Dzialanie, a: number, b: number): Obliczenie | Blad {
  if (dzialanie === "podziel" && b === 0) return blad("Nie można dzielić przez zero.");

  let wynik = 0;
  if (dzialanie === "dodaj") wynik = a + b;
  if (dzialanie === "odejmij") wynik = a - b;
  if (dzialanie === "pomnoz") wynik = a * b;
  if (dzialanie === "podziel") wynik = a / b;

  wynik = Math.round(wynik * 1e8) / 1e8; // ucinamy „ogonki” typu 0.30000000000000004
  return { dzialanie, a, b, wynik, opis: `${a} ${ZNAKI[dzialanie]} ${b} = ${wynik}`, pobrano: teraz() };
}

// ---------- 6. CZAS ----------

export type Czas = {
  strefa: string;
  data: string; // np. "18 listopada 2026"
  dataIso: string; // RRRR-MM-DD — w tym formacie datę przyjmuje narzędzie pogoda
  dzienTygodnia: string;
  godzina: string;
  roznicaWzgledemPolski: string; // np. "−1 godz."
  opis: string;
  zrodlo: string;
  pobrano: string;
};

// O ile minut strefa jest przesunięta względem czasu UTC.
function przesuniecieMinut(strefa: string, chwila: Date): number {
  const wStrefie = new Date(chwila.toLocaleString("en-US", { timeZone: strefa }));
  const wUtc = new Date(chwila.toLocaleString("en-US", { timeZone: "UTC" }));
  return Math.round((wStrefie.getTime() - wUtc.getTime()) / 60_000);
}

// Aktualna data i godzina w strefie czasowej (np. "Europe/Lisbon") oraz różnica względem Polski.
export function pobierzCzas(strefa = "Europe/Warsaw"): Czas | Blad {
  const chwila = new Date();
  try {
    const format = (opcje: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("pl-PL", { timeZone: strefa, ...opcje }).format(chwila);

    const roznicaGodzin = (przesuniecieMinut(strefa, chwila) - przesuniecieMinut("Europe/Warsaw", chwila)) / 60;
    const roznica =
      roznicaGodzin === 0 ? "ta sama godzina co w Polsce" : `${roznicaGodzin > 0 ? "+" : "−"}${Math.abs(roznicaGodzin)} godz.`;

    const data = format({ year: "numeric", month: "long", day: "numeric" });
    const dzienTygodnia = format({ weekday: "long" });
    const godzina = format({ hour: "2-digit", minute: "2-digit" });

    return {
      strefa,
      data,
      dataIso: dzisiaj(strefa),
      dzienTygodnia,
      godzina,
      roznicaWzgledemPolski: roznica,
      opis: `${strefa}: ${godzina}, ${dzienTygodnia}, ${data} (względem Polski: ${roznica})`,
      zrodlo: "zegar serwera",
      pobrano: teraz(),
    };
  } catch {
    return blad(`Nie znam strefy czasowej „${strefa}”. Podaj ją w postaci Kontynent/Miasto, np. Europe/Lisbon.`);
  }
}
