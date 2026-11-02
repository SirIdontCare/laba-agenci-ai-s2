# Zaczynamy — co zrobić i w jakiej kolejności

**Efekt lekcji 1: własny chatbot pod linkiem, dostępny po wpisaniu hasła.**

Jeżeli robisz to pierwszy raz, nie musisz od razu rozumieć wszystkich nazw. Otwórz etap, wykonaj instrukcję i sprawdź wynik. [Słowniczek](SLOWNICZEK.md) jest pod ręką.

## Twoja kolejność pracy

| Etap | Co robisz | Oczekiwany efekt | Instrukcja |
|---|---|---|---|
| 1 | Instalujesz Node.js, npm i Git; zakładasz konta | Komendy pokazują wersje, konta działają | [Instalacja](INSTALACJA_I_KONTA.md) |
| 2 | Tworzysz folder aplikacji | Znasz jego ścieżkę | [Terminal i pliki](TERMINAL_I_PLIKI.md) |
| 3 | Uruchamiasz Codex lub Claude Code | Asystent tworzy lokalny plik testowy | [Asystent od zera](ASYSTENT_OD_ZERA.md) |
| 4 | Budujesz stronę i czat | Strona lokalna odpowiada przez model | [Lekcja 1, kroki 1–2](lekcja_01.md) |
| 5 | Wpisujesz konfigurację i ustawiasz hasło | Bez hasła czat jest zablokowany | [Klucz i hasło](KONFIGURACJA_I_HASLO.md) |
| 6 | Zapisujesz kod w swoim repo | Commit widać na Twoim GitHub | [Git](GIT_KROK_PO_KROKU.md) |
| 7 | Publikujesz projekt | Link działa bez lokalnego serwera | [GitHub i Vercel](GITHUB_I_VERCEL.md) |
| 8 | Testujesz hasło i odpowiedź | Błędne hasło blokuje, poprawne wpuszcza | [Test po wdrożeniu](GITHUB_I_VERCEL.md#9-test-wyniku) |

## Dwa foldery

- **Materiały LABA** — instrukcje pobrane z repo kursu.
- **moj-agent** — Twoja aplikacja i jej własne repo.

Nie twórz aplikacji w folderze materiałów. Nie uruchamiaj npm install w katalogu, w którym są tylko instrukcje.

## Jak wydawać polecenia

Prompty z lekcji wklejaj do rozmowy Codex / Claude Code. Komendy z bloków terminala wpisuj w terminalu. Adresy stron otwieraj w przeglądarce.

Pracuj nad jednym krokiem. Jeżeli asystent napisał „gotowe”, sprawdź plik lub stronę. Brak możliwości sprawdzenia oznacza „niesprawdzone”, a nie automatyczne zaliczenie.

## Klucz i hasło

Wartości wpisujesz sam w .env.local oraz osobno w panelu Vercel. [Dokładna instrukcja](KONFIGURACJA_I_HASLO.md) pokazuje miejsce i format. Nie publikuj sekretów w repo ani na czacie.

## Coś nie działa?

Otwórz [listę problemów](PROBLEMY.md) i znajdź komunikat. Jeżeli nie ma podobnego, użyj [szablonu zgłoszenia](POMOC.md#zgloszenie).

Nowe lekcje udostępniamy per spotkanie. Na dziś wystarczy chatbot i hasło.

[Plan kursu](README.md) · [Cała pomoc](POMOC.md) · [Punktacja](PRACE_DOMOWE.md)
