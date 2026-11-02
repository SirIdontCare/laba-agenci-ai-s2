# Zaczynamy — co zrobić i w jakiej kolejności

**Efekt lekcji 1: własny chatbot pod linkiem, dostępny po wpisaniu hasła.**

**Pierwszy raz? Otwórz [stronę startową i zacznij od etapu 1](README.md#krok-1).** Ten plik jest skrótem tej samej trasy, nie dodatkowym zadaniem.

Jeżeli robisz to pierwszy raz, nie musisz od razu rozumieć wszystkich nazw. Otwórz etap, wykonaj instrukcję i sprawdź wynik. [Słowniczek](SLOWNICZEK.md) jest pod ręką.

## Twoja kolejność pracy

| Etap z README | Co robisz | Oczekiwany efekt | Instrukcja |
|---|---|---|---|
| 1 | Otwierasz terminal i sprawdzasz folder | Widzisz ścieżkę swojego folderu | [Terminal i pliki](TERMINAL_I_PLIKI.md) |
| 2 | Instalujesz Node.js, npm i Git oraz tworzysz moj-agent | Narzędzia pokazują wersje, znasz folder aplikacji | [Instalacja](INSTALACJA_I_KONTA.md) |
| 3 | Uruchamiasz jednego asystenta | W moj-agent powstaje gotowosc.txt | [Asystent od zera](ASYSTENT_OD_ZERA.md) |
| 4 | Budujesz pierwszą stronę | Widzisz tytuł i pole wiadomości; AI jeszcze nie odpowiada | [Lekcja 1 — etap 4](lekcja_01.md) |
| 5 | Podłączasz model | Chatbot odpowiada i pamięta imię w bieżącej rozmowie | [Lekcja 1 — etap 5](lekcja_01.md#2-podłącz-model) |
| 6 | Dodajesz hasło | Błędne hasło blokuje, poprawne wpuszcza | [Klucz i hasło — etap 6](KONFIGURACJA_I_HASLO.md#env-haslo) |
| 7 | Zapisujesz kod i publikujesz aplikację | Masz własny adres z Vercel | [Git](GIT_KROK_PO_KROKU.md) i [GitHub / Vercel](GITHUB_I_VERCEL.md) |
| 8 | Testujesz opublikowany czat | Link działa po wyłączeniu lokalnego serwera | [Test po wdrożeniu](GITHUB_I_VERCEL.md#9-test-wyniku) |

[Konfiguracja i format pliku .env.local](KONFIGURACJA_I_HASLO.md) przyda się w etapach 5–6.

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
