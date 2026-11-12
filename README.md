# Zbuduj swojego pierwszego chatbota

**LABA AI Agents · edycja 2 · Paweł Paruzel**

## Lekcja 4 — pętla ReAct

[Otwórz warsztaty i pracę domową](lekcja_04.md)

Twój projekt z poprzednich zajęć nie działa? Weź gotowy projekt do kontynuacji: [starter_lekcja_04](starter_lekcja_04). Przed każdymi zajęciami pojawi się tu aktualny projekt, od którego można zacząć.

## Lekcja 3 — narzędzia agenta

[Otwórz warsztaty i pracę domową](lekcja_03.md)

Twój projekt z poprzednich zajęć nie działa? Weź gotowy projekt do kontynuacji: [starter_lekcja_03](starter_lekcja_03).

## Lekcja 2 — inżynieria promptów

[Otwórz warsztaty i pracę domową](lekcja_02.md)

Wszystkie prompty, przykłady i dane testowe są w treści lekcji. Otwierasz ją na tej stronie, bez pobierania plików.


## Lekcja 1 — działający chatbot za hasłem

[Otwórz warsztaty](lekcja_01.md)

Poniżej znajdziesz pełną trasę pierwszej lekcji — etapy 1–8.

Zaczynasz od zera. Kończysz z własnym linkiem: wpisujesz hasło, wysyłasz wiadomość i AI odpowiada.

Nie musisz wcześniej programować ani znać komend. Ta strona prowadzi Cię po kolei. Codex lub Claude Code pomoże pisać kod, a Ty będziesz sprawdzać efekty.

**To jest główna trasa: etapy 1–8.** W instrukcjach pomocniczych zobaczysz też numery punktów, np. punkt 3 instalacji. To mniejsze czynności wewnątrz etapu, a nie kolejna lista zadań. W zgłoszeniu pomocy podaj etap z tej strony i nazwę pliku, który czytasz.

| Miejsce | Co tam robisz |
|---|---|
| Rozmowa z Codex / Claude Code | Wklejasz prompty, czyli zadania dla AI |
| Terminal, np. PowerShell | Wpisujesz komendy i uruchamiasz stronę |
| Przeglądarka | Czytasz tę instrukcję i oglądasz swoją stronę |

Na razie zostaw tę stronę otwartą. Instrukcję z linku możesz otworzyć w drugiej karcie: prawy przycisk myszy → „Otwórz link w nowej karcie”. Po wykonaniu zadania wracasz tutaj.

## Pierwszy raz tutaj? Zacznij od tego

### [→ Otwórz pierwszą instrukcję: jak uruchomić terminal](TERMINAL_I_PLIKI.md#1-otwórz-terminal)

Przeczytaj w niej **punkty 1–2**, wybierając swój system: Windows albo macOS. Kiedy zobaczysz ścieżkę swojego folderu, wróć tutaj do etapu 2.

**Nie musisz czytać wszystkich plików z listy powyżej.** Poniżej masz jedną trasę. W każdym kroku otwierasz wskazaną instrukcję, robisz zadanie i sprawdzasz wynik.

---

<a id="krok-1"></a>
## 1. Otwierasz swoje miejsce pracy

Pierwsze zadanie jest małe: otworzyć terminal i sprawdzić, w jakim folderze jesteś.

**Otwórz:** [Terminal i pliki — punkty 1–2](TERMINAL_I_PLIKI.md#1-otwórz-terminal).

**Ten krok masz za sobą, gdy:** po wpisaniu polecenia widzisz ścieżkę folderu. Nie musi wyglądać identycznie jak w przykładzie — będzie w niej nazwa Twojego konta.

**[Mam to → krok 2](#krok-2)**

<a id="krok-2"></a>
## 2. Przygotowujesz narzędzia i folder

Instalujesz Node.js z npm oraz Git. Potem tworzysz folder **moj-agent** — tutaj powstanie Twoja aplikacja.

**Otwórz po kolei:**

1. [Instalacja — punkt 3: Node.js i npm](INSTALACJA_I_KONTA.md#3-nodejs-i-npm).
2. [Instalacja — punkt 4: Git](INSTALACJA_I_KONTA.md#4-git).
3. [Terminal i pliki — punkt 3: folder aplikacji](TERMINAL_I_PLIKI.md#3-utwórz-folder-aplikacji).

Na razie wykonaj tylko te części. Konta i pozostałe ustawienia pojawią się w kolejnych krokach.

**Ten krok masz za sobą, gdy:** Node, npm i Git pokazują numery wersji, a Ty wiesz, gdzie jest folder moj-agent.

Utknęło npm? [Rozwiązanie błędu PowerShell](PROBLEMY.md#p01). Program nie jest znajdowany? [Sprawdź instalację](PROBLEMY.md#p02).

**[Mam to → krok 3](#krok-3)**

<a id="krok-3"></a>
## 3. Poznajesz swojego asystenta

Uruchamiasz **Codex albo Claude Code**, wskazujesz folder moj-agent i zlecasz utworzenie pierwszego pliku.

**Otwórz:** [Asystent od zera](ASYSTENT_OD_ZERA.md). Przejdź instalację i logowanie dla jednego wybranego narzędzia, a potem wykonaj test z punktu 4.

**Ten krok masz za sobą, gdy:** w folderze widzisz plik **gotowosc.txt** z tekstem „Gotowe do LABA”. To pierwszy dowód, że AI potrafi pracować na Twoim komputerze.

Asystent tylko pokazuje kod, a pliku nie ma? [Sprawdź tryb pracy](PROBLEMY.md#p06).

**[Mam to → krok 4](#krok-4)**

<a id="krok-4"></a>
## 4. Twoja pierwsza strona zaczyna działać

Teraz przechodzisz do ćwiczeń. Wklejasz pierwszy prompt do asystenta i otwierasz wynik w przeglądarce.

**Otwórz:** [Etap 4 w lekcji 1: uruchom stronę](lekcja_01.md#1-uruchom-stronę).

**Ten krok masz za sobą, gdy:** w przeglądarce widzisz „Mój chatbot”, pole wiadomości i przycisk. Czat jeszcze nie musi odpowiadać.

Strona się nie otwiera? [Sprawdź serwer i adres](PROBLEMY.md#p09).

**[Mam to → krok 5](#krok-5)**

<a id="krok-5"></a>
## 5. Chatbot odpowiada po raz pierwszy

Podłączasz model AI kluczem otrzymanym od LABA. Asystent przygotowuje aplikację, a Ty wpisujesz klucz lokalnie.

**Otwórz:** [Etap 5 w lekcji 1: podłącz model](lekcja_01.md#2-podłącz-model).

Nie wiesz, gdzie wpisać klucz? [Tutaj pokazujemy plik, miejsce i format](KONFIGURACJA_I_HASLO.md). W tym etapie uzupełniasz tylko klucz i model. Hasło dodasz w etapie 6.

Chcesz wybrać model? [Luna, Gemini Flash, Terra i Sonnet — dokładne nazwy, koszty i zmiana w .env.local](MODELE_DO_CWICZEN.md). Na pierwszy test użyj modelu wskazanego przez prowadzącego; porównania są opcjonalne.

**Ten krok masz za sobą, gdy:** wysyłasz „Mam na imię Alex”, a po pytaniu „Jak mam na imię?” chatbot odpowiada na podstawie tej rozmowy.

Dostęp do modelu w chatbocie zapewnia LABA przez OpenRouter. To oddzielny dostęp od konta Codex / Claude Code. Klucza nie wklejasz do rozmowy z asystentem.

**[Mam to → krok 6](#krok-6)**

<a id="krok-6"></a>
## 6. Dodajesz hasło do swojego czatu

Twój chatbot ma działać dla osób, którym podasz dostęp. Ustawiasz jedno hasło i sprawdzasz je w nowym prywatnym oknie przeglądarki.

**Otwórz:** [Etap 6 w lekcji 1: dodaj hasło](lekcja_01.md#3-dodaj-hasło).

**Ten krok masz za sobą, gdy:** błędne hasło blokuje dostęp, a poprawne pozwala rozmawiać z chatbotem. Po wyjściu hasło jest potrzebne ponownie.

Hasło nie działa? [Sprawdź konfigurację i sesję](PROBLEMY.md#p16).

**[Mam to → krok 7](#krok-7)**

<a id="krok-7"></a>
## 7. Zapisujesz projekt i wysyłasz go w świat

Zakładasz konta GitHub i Vercel, jeśli jeszcze ich nie masz. Zapisujesz kod we własnym repozytorium, a potem uruchamiasz aplikację w internecie.

**Otwórz:** [GitHub i Vercel — od konta do linku](GITHUB_I_VERCEL.md). Przejdź punkty 1–8. Przy zapisie kodu masz pod ręką [komendy Git z wyjaśnieniami](GIT_KROK_PO_KROKU.md).

**Ten krok masz za sobą, gdy:** Vercel zakończył wdrożenie i masz adres swojej aplikacji. Za chwilę sprawdzisz, czy wszystko pod nim działa.

Problem z wysłaniem kodu? [Pomoc Git](GIT_KROK_PO_KROKU.md#11-najczęstsze-komunikaty). Problem z wdrożeniem? [Build failed](PROBLEMY.md#p25).

**[Mam to → ostatni krok](#krok-8)**

<a id="krok-8"></a>
## 8. Otwierasz własny link. Działa.

Wyłącz lokalny serwer. Otwórz adres z Vercel w nowym prywatnym oknie.

**Sprawdź trzy rzeczy:**

- [ ] Najpierw pojawia się ekran hasła.
- [ ] Błędne hasło nie wpuszcza, poprawne otwiera czat.
- [ ] Po wysłaniu wiadomości dostajesz prawdziwą odpowiedź AI.

**To jest efekt pierwszej lekcji: Twój działający chatbot za hasłem.**

Zapisz link do aplikacji i własnego repo. Jeżeli coś jeszcze nie działa, zanotuj dokładny błąd — wrócimy do konkretnego miejsca, zamiast zaczynać wszystko od nowa.

---

## Utknąłeś? Pomoc jest częścią procesu

[Znajdź swój komunikat w pomocy](PROBLEMY.md). Każdy problem ma opis pierwszej czynności i poprawnego wyniku.

Jeżeli potrzebujesz wsparcia na czacie kursu, napisz: **etap 1–8 z tej strony, nazwę czytanego pliku, system, co zrobiłeś i jaki komunikat widzisz**. Ukryj klucze i hasła.

Nieznane słowo? [Otwórz słowniczek](SLOWNICZEK.md). Chcesz odnaleźć konkretną instrukcję? [Otwórz spis pomocy](POMOC.md).

<details>
<summary><strong>Co dalej? Zobacz trasę całego kursu</strong></summary>

Przez 12 spotkań rozwijasz jedną aplikację. Każde kolejne spotkanie dodaje jej nową możliwość.

| Lekcja | Co zbudujesz | Materiały |
|---|---|---|
| 1 | Działający chatbot pod linkiem, zabezpieczony hasłem | [Otwórz lekcję](lekcja_01.md) |
| 2 | Instrukcje, które nadają agentowi rolę i zasady | [Otwórz lekcję](lekcja_02.md) |
| 3 | Wyszukiwanie w internecie, grafiki i analiza zdjęć | Przed lekcją |
| 4 | Agenta wykonującego zadanie w kilku krokach | Przed lekcją |
| 5 | Pamięć rozmów i preferencji | Przed lekcją |
| 6 | Odpowiedzi na podstawie Twoich dokumentów | Przed lekcją |
| 7 | Logowanie i prywatne historie użytkowników | Przed lekcją |
| 8 | Misje przydatne w pracy | Przed lekcją |
| 9 | Zadania uruchamiane automatycznie | Przed lekcją |
| 10 | Zabezpieczenia i kontrolę kosztów | Przed lekcją |
| 11 | Dopracowaną aplikację gotową do pokazania | Przed lekcją |
| 12 | Prezentację projektu i poprawkę po feedbacku | Przed lekcją |

Nową instrukcję udostępniamy przed daną lekcją. Po zajęciach dodajemy pracę domową i uzupełnienia. Poprzednie materiały zostają dostępne.

</details>

<details>
<summary><strong>Prace domowe i punkty</strong></summary>

- Prace domowe: **140 pkt**.
- Projekt końcowy: **60 pkt**.
- Łącznie: **200 pkt**.
- Wyróżnienie: **od 160 pkt**.

Korzystanie z Codex / Claude Code jest częścią kursu. Ocenimy działający rezultat i sprawdzenie go według instrukcji.

[Zadania i zasady oceniania](PRACE_DOMOWE.md)

</details>
