import {
  dzisiaj,
  najblizszeSwieta,
  pobierzCzas,
  pobierzKurs,
  pobierzWikipedie,
  prognozaDlaMiejsca,
  teraz,
  znajdzMiasto,
  type Miejsce,
} from "@/lib/sources";

// ============================================================
// ASYSTENT PODRÓŻY — dane dla strony /dashboard.
// Pięć kart z pięciu źródeł. Używamy tych samych funkcji co narzędzia agenta
// (lib/sources.ts). Tu nie ma modelu AI — same dane.
// ============================================================

export type Karta = {
  tytul: string;
  wartosc: string; // najważniejsza informacja, z jednostką
  szczegoly?: string;
  link?: string;
  zrodlo: string;
  pobrano: string;
  ok: boolean; // false = źródło nie podało danych
};

export type Podroz = { miejsce: Miejsce; data: string; karty: Karta[] } | { blad: string };

// Waluta kraju docelowego (kod kraju -> kod waluty). Dopisz kraj, jeśli go brakuje.
const STREFA_EURO = ["AT", "BE", "BG", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK"];

const WALUTY_KRAJOW: Record<string, string> = {
  ...Object.fromEntries(STREFA_EURO.map((kraj) => [kraj, "EUR"])),
  PL: "PLN",
  GB: "GBP",
  US: "USD",
  CH: "CHF",
  CZ: "CZK",
  HU: "HUF",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  IS: "ISK",
  RO: "RON",
  UA: "UAH",
  TR: "TRY",
  JP: "JPY",
  CN: "CNY",
  KR: "KRW",
  TH: "THB",
  IN: "INR",
  AU: "AUD",
  NZ: "NZD",
  CA: "CAD",
  MX: "MXN",
  BR: "BRL",
  ZA: "ZAR",
  IL: "ILS",
  SG: "SGD",
  HK: "HKD",
};

function brakDanych(tytul: string, zrodlo: string, komunikat: string): Karta {
  return { tytul, wartosc: komunikat, zrodlo, pobrano: teraz(), ok: false };
}

// Pierwsze dwa zdania tekstu.
function dwaZdania(tekst: string): string {
  const zdania = tekst.match(/[^.!?]+[.!?]+(\s|$)/g);
  return zdania ? zdania.slice(0, 2).join("").trim() : tekst;
}

async function kartaPogody(miejsce: Miejsce, data: string): Promise<Karta> {
  const pogoda = await prognozaDlaMiejsca(miejsce, data);
  if ("blad" in pogoda) return brakDanych("Pogoda", "Open-Meteo", pogoda.blad);
  return {
    tytul: "Pogoda",
    wartosc: `${pogoda.temperaturaMin}–${pogoda.temperaturaMax} °C, ${pogoda.pogoda}`,
    szczegoly:
      `Prognoza na ${pogoda.data}. ` +
      (pogoda.szansaOpadow == null ? "" : `Szansa opadów: ${pogoda.szansaOpadow}%. `) +
      `Wiatr do ${pogoda.wiatrMaks} km/h.`,
    zrodlo: pogoda.zrodlo,
    pobrano: pogoda.pobrano,
    ok: true,
  };
}

async function kartaWalut(miejsce: Miejsce): Promise<Karta> {
  const waluta = WALUTY_KRAJOW[miejsce.kodKraju];
  if (!waluta) return brakDanych("Waluty", "NBP", `Nie znam waluty kraju: ${miejsce.kraj}.`);
  if (waluta === "PLN") {
    return { tytul: "Waluty", wartosc: "Płacisz w złotych (PLN)", zrodlo: "NBP", pobrano: teraz(), ok: true };
  }
  const kurs = await pobierzKurs(waluta);
  if ("blad" in kurs) return brakDanych("Waluty", "NBP", kurs.blad);
  return {
    tytul: "Waluty",
    wartosc: `1 ${kurs.waluta} = ${kurs.kurs} zł`,
    szczegoly: `Waluta: ${kurs.nazwa}. Kurs średni z dnia ${kurs.dataKursu}.`,
    zrodlo: kurs.zrodlo,
    pobrano: kurs.pobrano,
    ok: true,
  };
}

async function kartaSwiat(miejsce: Miejsce, data: string): Promise<Karta> {
  const swieta = await najblizszeSwieta(miejsce.kodKraju, data);
  if ("blad" in swieta) return brakDanych("Święta", "Nager.Date", swieta.blad);
  const najblizsze = swieta.swieta[0];
  return {
    tytul: "Święta",
    wartosc: najblizsze ? `${najblizsze.data} — ${najblizsze.nazwaLokalna}` : "Brak dni wolnych w najbliższym czasie",
    szczegoly: `Najbliższe dni wolne (${miejsce.kraj}), licząc od ${data}: ${swieta.opis}.`,
    zrodlo: swieta.zrodlo,
    pobrano: swieta.pobrano,
    ok: true,
  };
}

async function kartaWikipedii(miejsce: Miejsce): Promise<Karta> {
  const artykul = await pobierzWikipedie(miejsce.nazwa);
  if ("blad" in artykul) return brakDanych("Wikipedia", "Wikipedia", artykul.blad);
  return {
    tytul: "Wikipedia",
    wartosc: artykul.tytul,
    szczegoly: dwaZdania(artykul.streszczenie),
    link: artykul.link,
    zrodlo: artykul.zrodlo,
    pobrano: artykul.pobrano,
    ok: true,
  };
}

function kartaCzasu(miejsce: Miejsce): Karta {
  const czas = pobierzCzas(miejsce.strefa);
  if ("blad" in czas) return brakDanych("Czas", "zegar serwera", czas.blad);
  return {
    tytul: "Czas",
    wartosc: `${czas.godzina} (${czas.roznicaWzgledemPolski})`,
    szczegoly: `Teraz na miejscu: ${czas.dzienTygodnia}, ${czas.data}. Strefa czasowa: ${czas.strefa}.`,
    zrodlo: czas.zrodlo,
    pobrano: czas.pobrano,
    ok: true,
  };
}

// Zbiera pięć kart dla miasta i daty (RRRR-MM-DD). Źródła pytamy równocześnie.
export async function zbierzKarty(miasto: string, data: string): Promise<Podroz> {
  const nazwa = miasto.trim();
  if (!nazwa || nazwa.length > 80) return { blad: "Wpisz nazwę miasta." };

  const dzien = /^\d{4}-\d{2}-\d{2}$/.test(data) ? data : dzisiaj();

  const miejsce = await znajdzMiasto(nazwa);
  if ("blad" in miejsce) return { blad: miejsce.blad };

  const karty = await Promise.all([
    kartaPogody(miejsce, dzien),
    kartaWalut(miejsce),
    kartaSwiat(miejsce, dzien),
    kartaWikipedii(miejsce),
    kartaCzasu(miejsce),
  ]);

  return { miejsce, data: dzien, karty };
}
