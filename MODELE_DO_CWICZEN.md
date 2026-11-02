# Modele do ćwiczeń — wybierz AI dla swojego chatbota

**Jesteś w [etapie 5 naszej drogi](README.md#krok-5): strona już działa, teraz ma zacząć odpowiadać.** Ten poradnik pokazuje, jaki model wybrać i gdzie wpisać jego nazwę.

Na pierwsze uruchomienie użyj modelu wskazanego przez prowadzącego. Jeśli możesz wybrać samodzielnie, **GPT-6 Luna to najtańszy punkt startu z poniższej czwórki**. Najpierw uzyskaj jedną działającą odpowiedź. Porównania możesz zrobić później.

## 1. Dwa różne miejsca, w których korzystasz z AI

| Miejsce | Co robi AI | Gdzie wybierasz model |
|---|---|---|
| Codex / Claude Code | Pomaga Ci tworzyć aplikację | W ustawieniach lub poleceniach tego asystenta |
| Twój chatbot na localhost lub Vercel | Odpowiada osobie piszącej na Twojej stronie | W zmiennej `OPENROUTER_MODEL` aplikacji |

**Tutaj zmieniamy model Twojego chatbota.** Zmiana pliku aplikacji nie przełącza modelu w Codex ani Claude Code.

Modele z tabeli wywołujemy przez **OpenRouter, używając klucza od LABA**. Do tego ćwiczenia nie potrzebujesz osobnych kont ani kluczy u każdego producenta modelu. Dostęp do wybranego modelu musi jednak być dopuszczony na kluczu kursowym.

## 2. Cztery modele do wyboru

Zestawienie sprawdzone **2 listopada 2026 r.** Nazwy w drugiej kolumnie są dokładnymi identyfikatorami OpenRouter. Kopiuj całość, razem z częścią przed ukośnikiem.

| Model | Wartość do `OPENROUTER_MODEL` | Propozycja użycia na kursie | Wejście / wyjście, USD za 1 mln tokenów |
|---|---|---|---|
| [GPT-6 Luna](https://openrouter.ai/openai/gpt-6-luna) | `openai/gpt-6-luna` | Tani start, prosty czat i częste krótkie próby | 0,10 / 0,50 |
| [Gemini 3.8 Flash](https://openrouter.ai/google/gemini-3.8-flash) | `google/gemini-3.8-flash` | Alternatywa do codziennych rozmów i porównania odpowiedzi | 0,75 / 3,75 |
| [GPT-6.1 Terra](https://openrouter.ai/openai/gpt-6.1-terra) | `openai/gpt-6.1-terra` | Pisanie, wyjaśnienia i zadania wymagające więcej pracy | 1,00 / 5,00 |
| [Claude Sonnet 5.5](https://openrouter.ai/anthropic/claude-sonnet-5.5) | `anthropic/claude-sonnet-5.5` | Porównanie jakości przy bardziej złożonej instrukcji | 2,00 / 10,00 |

To propozycje do ćwiczeń. **Luna jest opcją budżetową, Terra i Sonnet są droższe.** Sonnet może być przydatny, ale do sprawdzenia, czy pierwszy chatbot działa, wystarczy tańszy model.

**Jak czytać cenę?** Wejście to tekst wysyłany do modelu, w tym przekazywana historia rozmowy. Wyjście to wygenerowane tokeny. Token jest fragmentem tekstu, nie całą wiadomością ani zawsze jednym słowem. Cena w tabeli dotyczy miliona tokenów, a nie pojedynczego pytania. Modele rozumujące mogą zużywać także rozliczane tokeny rozumowania.

Podajemy stawki widoczne na kartach modeli w dniu sprawdzenia; Gemini Flash był wtedy oznaczony promocją. Ceny, dostępność i stawki poszczególnych dostawców mogą się zmieniać. Przed dłuższymi próbami sprawdź kartę modelu i zasady wykorzystania klucza LABA.

## 3. Znajdź właściwy plik

Pracujesz w folderze **swojej aplikacji**, np. `moj-agent`. Znajdź plik `package.json`. Obok niego powinien leżeć **`.env.local`**.

Jeśli nie masz jeszcze pliku ani klucza, wykonaj najpierw [instrukcję wpisywania konfiguracji](KONFIGURACJA_I_HASLO.md). Sam wybór modelu bez klucza nie uruchomi czatu.

**Windows — w PowerShell, w folderze aplikacji:**

```powershell
notepad .env.local
```

**macOS — w Terminalu, w folderze aplikacji:**

```bash
open -a TextEdit .env.local
```

Na Macu edytuj jako zwykły tekst. Jeśli plik jest niewidoczny albo nie wiesz, jak wejść do folderu, wróć do [terminala i plików](TERMINAL_I_PLIKI.md).

**Gotowe, gdy:** widzisz lokalny plik z ustawieniami aplikacji. Nie wklejaj jego zawartości do rozmowy.

## 4. Wybierz jedną linijkę i zapisz

Znajdź w pliku wiersz zaczynający się od `OPENROUTER_MODEL=`. Zastąp jego wartość identyfikatorem wybranego modelu z tabeli.

Przykład dla Luny:

```dotenv
OPENROUTER_MODEL=openai/gpt-6-luna
```

Chcesz sprawdzić Gemini? **Zamień ten sam wiersz** na:

```dotenv
OPENROUTER_MODEL=google/gemini-3.8-flash
```

Dla Terry lub Sonneta postępujesz tak samo — po znaku `=` wklejasz ich pełny identyfikator z tabeli.

- W pliku zostaw **tylko jeden aktywny wiersz `OPENROUTER_MODEL`**.
- Nie wpisuj kilku nazw po przecinku.
- Nie wpisuj samego `Sonnet`, `Luna` ani adresu strony modelu.
- Zachowaj istniejące `OPENROUTER_API_KEY`, `CHAT_PASSWORD` i `SESSION_SECRET`. Przy zmianie modelu nie trzeba ich zmieniać.
- Tę linijkę zapisujesz w pliku; nie uruchamiasz jej jako komendy terminala.

Zapisz przez **Ctrl+S** na Windows albo **Cmd+S** na Macu. Nazwa pliku ma pozostać `.env.local`, bez dodatkowego `.txt`.

**Gotowe, gdy:** w zapisanym pliku jest jeden wybrany model oraz dotychczasowa konfiguracja.

## 5. Uruchom ponownie i wyślij wiadomość

1. Przejdź do terminala, w którym działa serwer strony.
2. Naciśnij **Ctrl+C**. Jeśli pojawi się pytanie o zakończenie, potwierdź.
3. Uruchom serwer ponownie odpowiednią komendą.

**Windows PowerShell:**

```powershell
npm.cmd run dev
```

**macOS lub CMD:**

```bash
npm run dev
```

4. Otwórz adres podany przez serwer.
5. Rozpocznij nową rozmowę, a jeśli nie ma takiej opcji — odśwież stronę.
6. Jeśli masz już ekran hasła, wpisz swoje hasło.
7. Wyślij jedno krótkie pytanie, np. „Wyjaśnij w dwóch zdaniach, czym jest chatbot”.

**Gotowe, gdy:** otrzymujesz odpowiedź bez błędu. Wygląd strony może pozostać taki sam po zmianie modelu.

Pytanie „Jakim jesteś modelem?” nie jest wiarygodnym testem konfiguracji. Model może podać błędną nazwę. Sprawdzamy ustawienie używane przez kod serwera.

## 6. Zmień model także na Vercel

**Plik na komputerze i ustawienia opublikowanej aplikacji to dwa osobne miejsca.** Zmiana `.env.local` działa lokalnie. Dla strony w internecie ustaw wartość również w panelu Vercel.

1. Otwórz [panel Vercel](https://vercel.com/dashboard).
2. Wejdź w projekt swojego chatbota.
3. Znajdź **Settings → Environment Variables** lub sekcję **Environment Variables** w menu projektu.
4. Odszukaj `OPENROUTER_MODEL` i edytuj. Jeśli tej zmiennej nie ma, dodaj ją.
5. Wpisz nazwę i wartość w osobnych polach:

| Pole | Co wpisać — przykład dla Luny |
|---|---|
| Name / Key | `OPENROUTER_MODEL` |
| Value | `openai/gpt-6-luna` |
| Type, jeśli panel pyta | Config — identyfikator modelu jest zwykłym ustawieniem |

W polu Value wpisujesz **sam identyfikator**, bez `OPENROUTER_MODEL=`, cudzysłowów ani znaków z formatowania tekstu.

6. Wybierz **Production**, jeśli zmieniasz model pod głównym linkiem aplikacji. Dla wdrożeń podglądowych ustaw także **Preview**, jeśli z nich korzystasz.
7. Kliknij **Save**.
8. Przejdź do **Deployments** i wykonaj **Redeploy** właściwego wdrożenia.
9. Poczekaj na status gotowości. Otwórz aktualny link, wpisz hasło i wyślij jedno pytanie.

Klucz API, hasło i sekret sesji mają pozostać prywatnymi wartościami. Nie dodawaj do ich nazw prefiksu `NEXT_PUBLIC_`.

**Gotowe, gdy:** po nowym wdrożeniu czat online odpowiada. Jeśli to pierwsza publikacja i nie ustawiłeś jeszcze pozostałych zmiennych, wykonaj [całą instrukcję GitHub i Vercel](GITHUB_I_VERCEL.md).

## 7. Zmieniłem model i coś nie działa

| Objaw | Co zrobić teraz |
|---|---|
| Brakuje konfiguracji | Sprawdź nazwę pliku i zmiennej, zapisz i uruchom serwer ponownie. [P12](PROBLEMY.md#p12) |
| Model niedostępny, błędne ID lub 403 od dostawcy | Porównaj ID z tabelą. Jeśli jest poprawne, poproś LABA o potwierdzenie dostępu na kluczu kursowym. [P14](PROBLEMY.md#p14) |
| 401 | Sprawdź, czy dotyczy hasła do aplikacji, czy klucza OpenRouter. [P13](PROBLEMY.md#p13) |
| Brak środków, limit lub 429 | Przeczytaj komunikat i zatrzymaj ponawianie prób. Zgłoś problem z przydziałem LABA. [P15](PROBLEMY.md#p15) |
| Lokalnie działa, a na stronie internetowej nie | Ustaw zmienną w odpowiednim środowisku Vercel i wykonaj Redeploy. [P27](PROBLEMY.md#p27) |
| Kod nadal używa starej nazwy modelu | Wklej asystentowi poniższy prompt |

**Wklej do Codex / Claude Code, jeśli potrzebujesz sprawdzić kod:**

```text
Sprawdź wybór modelu w moim chatbocie.
Konfiguracja ma używać OPENROUTER_MODEL po stronie serwera
oraz istniejącego adaptera OpenRouter.

Sprawdź kod /api/chat i miejsca tworzenia modelu.
Jeśli identyfikator jest wpisany na stałe, zmień kod tak, żeby używał
process.env.OPENROUTER_MODEL. Gdy zmienna jest pusta, pokaż
czytelny błąd zamiast wybierać model automatycznie.

Nie odczytuj ani nie wypisuj zawartości .env.local, klucza API,
hasła ani sekretu sesji. Wartość modelu wpiszę sam zgodnie z poradnikiem.
Nie zmieniaj zabezpieczeń czatu i nie dodawaj nowych funkcji.
Sprawdź zgodność kodu z wersją SDK zainstalowaną w tym projekcie.
Nie wykonuj płatnych wywołań. Podaj, jak uruchomić serwer
i jak wykonać jeden test w przeglądarce.
```

Dostępność w publicznym katalogu nie potwierdza uprawnień klucza LABA. To zestawienie identyfikatorów i konfiguracji; pierwszy test odpowiedzi wykonujesz na swoim koncie w przeglądarce.

## Wracasz na szlak

Jeśli chatbot już odpowiada, wróć do [etapu 6: dodaj hasło](README.md#krok-6). Jeśli hasło i publikację masz za sobą, możesz zakończyć na działającym czacie — porównanie modeli jest opcjonalne.

Źródła: karty modeli podlinkowane w tabeli, [wybór modelu w OpenRouter](https://openrouter.ai/docs/quickstart), [pliki środowiskowe Next.js](https://nextjs.org/docs/app/guides/environment-variables), [zmienne środowiskowe Vercel](https://vercel.com/docs/environment-variables/managing-environment-variables).

[Plan drogi](README.md) · [Lekcja 1](lekcja_01.md) · [Konfiguracja i hasło](KONFIGURACJA_I_HASLO.md) · [Pomoc](POMOC.md)
