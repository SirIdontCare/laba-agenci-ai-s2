# Lekcja 1. Od czatu do agenta

**Cel:** uruchomisz własny chatbot AI i opublikujesz go w internecie.

Na początek prowadzący pokaże gotowego agenta korzystającego z narzędzia. Omówimy, czym różni się od zwykłego czatu i z góry ustalonej sekwencji działań oraz które decyzje podejmuje sam, a które zostawia człowiekowi.

## Przed startem

Wykonaj [instrukcję instalacji](INSTALACJA_I_KONTA.md). Przygotuj folder swojej aplikacji i Codex lub Claude Code. Klucz do modeli dostaniesz od LABA.

## Ćwiczenie 1. Pierwsza zmiana z asystentem

Otwórz folder własnego projektu w asystencie. Poproś o przygotowanie aplikacji i zmianę tytułu strony. Uruchom ją. Następnie, w kopii roboczej, przećwicz z prowadzącym wywołanie prostego błędu i jego naprawę.

Wklej asystentowi:

> Przygotuj w tym folderze projekt Next.js z TypeScript. Prowadź mnie prostym językiem. Sprawdź Node i Git. Zmień tytuł strony na „Mój agent AI”, uruchom projekt i pokaż, jak sprawdzić zmianę w przeglądarce. Potem pomóż mi odtworzyć kontrolowany błąd importu i go naprawić. Nie odczytuj ani nie pokazuj wartości sekretów.

**Sprawdź:**
- Node i Git wypisują numery wersji.
- Strona wyświetla nowy tytuł.
- Wiesz, który folder zawiera Twoją aplikację.
- Kontrolowany błąd został odtworzony i naprawiony.

## Ćwiczenie 2. Chatbot, który naprawdę odpowiada

Dodamy pole wiadomości, historię bieżącej rozmowy i odpowiedź pojawiającą się stopniowo. Asystent pomoże z kodem. Ty sprawdzisz działanie.

Wklej asystentowi:

> Rozwijaj ten sam projekt. Zbuduj chatbot Next.js przez Vercel AI SDK i @openrouter/ai-sdk-provider. Użyj modelu Gemini z listy dopuszczonej przez LABA, jeśli jest dostępny. Zastosuj streamText i rzeczywisty streaming odpowiedzi. Dodaj historię bieżącej sesji, pole wiadomości, stan oczekiwania i czytelne błędy. Klucz OpenRouter ma działać wyłącznie na serwerze. Dodaj kontrolę dostępu i limity przed płatnym wywołaniem. Ustal zgodne wersje bibliotek i zapisz je w lockfile. Wyjaśniaj kolejne kroki prostym językiem i pomagaj je sprawdzać. Nie wypisuj sekretów.

Klucz umieść w .env.local zgodnie z nazwą zmiennej używaną przez projekt. Nie wklejaj jego wartości do rozmowy z asystentem.

**Sprawdź:**
- Wysyłasz wiadomość i otrzymujesz odpowiedź modelu.
- Odpowiedź pojawia się w miarę odbierania fragmentów.
- Pusta wiadomość, brak dostępu i problem z modelem mają czytelny komunikat.
- Klucz nie znajduje się w kodzie strony ani w repozytorium.

Jeśli model nie działa na przydzielonym kluczu, zgłoś to prowadzącemu. Nie oznaczaj tego kroku jako wykonanego na podstawie samego wyglądu czatu.

## Ćwiczenie 3. Własny link w internecie

Zapisz aplikację w swoim repozytorium GitHub, a następnie zaimportuj je do Vercel. Zmienne środowiskowe ustaw także w panelu hostingu.

Wklej asystentowi:

> Pomóż mi zapisać własny projekt na GitHub i opublikować go na Vercel. Najpierw sprawdź build, .gitignore oraz pliki przygotowane do commita. Nie publikuj plików .env ani sekretów. Wyjaśnij, gdzie samodzielnie dodać zmienne serwerowe na hostingu. Zachowaj kontrolę dostępu do płatnych wywołań. Po publikacji pomóż mi sprawdzić wysłanie wiadomości, streaming oraz kontrolowany błąd. Zapisz link i wersję kodu.

**Sprawdź:**
- Aplikacja buduje się poprawnie.
- Link działa również po wyłączeniu lokalnego serwera.
- Czat pod tym linkiem naprawdę odpowiada.
- Brak dostępu nie uruchamia płatnego modelu.
- Repozytorium nie zawiera klucza.

## Na koniec

Zapisz działającą wersję oraz to, co udało się sprawdzić. Jeżeli coś nie działa, zapisz dokładny błąd i zgłoś go na czacie kursu.

Praca domowa pojawi się po zajęciach w [tym pliku](PRACE_DOMOWE.md).

[Plan kursu](README.md) · [Jak pracujemy](START.md)
