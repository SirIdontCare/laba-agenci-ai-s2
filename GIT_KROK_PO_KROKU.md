# Git krok po kroku — zapis i wysyłanie kodu

**Git zapisuje wersje na komputerze. GitHub przechowuje je w internecie.**

Komendy wykonuj w terminalu, w **folderze swojej aplikacji**, nie w folderze materiałów kursu. W PowerShell i na Macu komendy Git są takie same.

## 1. Co robi każda komenda?

| Komenda | Co robi | Co powinno się pojawić |
|---|---|---|
| `git --version` | Sprawdza instalację | Numer wersji Git |
| `git status` | Pokazuje zmiany | Lista plików lub informacja o braku zmian |
| `git init` | Rozpoczyna historię w obecnym folderze | Informacja o repo; wykonaj tylko, jeśli go jeszcze nie ma |
| `git add NAZWA_PLIKU` | Wybiera plik do następnego zapisu | Zwykle brak komunikatu; sprawdź git status |
| `git add .` | Wybiera zmiany pod bieżącym katalogiem | Najpierw sprawdź folder, .gitignore i pliki |
| `git diff --staged --stat` | Pokazuje podsumowanie przygotowanych zmian | Nazwy plików i liczba zmian |
| `git commit -m "Opis zmiany"` | Zapisuje przygotowane zmiany lokalnie | Identyfikator zapisu i podsumowanie |
| `git log --oneline -5` | Pokazuje pięć ostatnich zapisów | Identyfikatory i opisy |
| `git remote -v` | Pokazuje adres repo online | Wiersze origin dla fetch i push |
| `git remote add origin ADRES` | Łączy lokalne repo z adresem online | Przy powodzeniu zwykle cisza |
| `git branch --show-current` | Pokazuje obecną gałąź | Np. main |
| `git branch -m main` | Zmienia nazwę obecnej gałęzi na main | Tylko jeśli potrzebujesz tej nazwy i nie koliduje z inną |
| `git push -u origin main` | Wysyła main i zapamiętuje połączenie | Potwierdzenie wysłania albo błąd logowania |
| `git push` | Wysyła kolejne commity po ustawieniu połączenia | Wynik synchronizacji |
| `git clone ADRES` | Pobiera repo do nowego podfolderu | Powstaje folder repo wraz z historią |

Nie wklejaj całej tabeli. Wybierz krok, który wykonujesz.

## 2. Najpierw sprawdź folder

Windows: `Get-Location`. Mac: `pwd`.

Następnie:

```bash
git status
```

- Jeśli widzisz stan repo — historia już istnieje.
- Jeśli widzisz „not a git repository”, sprawdź, czy jesteś w aplikacji.
- Jeśli to poprawny folder nowego projektu, dopiero wtedy wykonaj `git init`.
- Jeśli pojawiają się pliki z wielu innych projektów lub całego folderu użytkownika, zatrzymaj się: prawdopodobnie jesteś za wysoko.

## 3. Ustaw autora commitów

W poniższych poleceniach zastąp przykładowe dane swoimi. Możesz użyć adresu noreply z ustawień e-mail GitHub. Ustawienia bez --global dotyczą tego repozytorium:

```bash
git config user.name "Twoje imię i nazwisko"
git config user.email "twoj-adres@example.com"
```

To dane autora w historii, **nie logowanie do GitHub**. Błąd „Please tell me who you are” dotyczy właśnie tych ustawień.

## 4. Sprawdź .gitignore przed pierwszym zapisem

Poproś asystenta:

```text
Sprawdź reguły .gitignore i nazwy plików śledzonych przez Git.
Pliki .env, .env.local, node_modules i .next nie mogą trafić do commita.
.env.example ma zawierać tylko puste pola lub jawne przykłady.
Nie odczytuj ani nie wypisuj wartości sekretów.
Jeśli sekret jest już śledzony, zatrzymaj publikację i opisz dalsze kroki.
```

Samo dopisanie .env.local do .gitignore **nie usuwa** pliku, który był już śledzony. Jeśli klucz został opublikowany, zgłoś to prowadzącemu i poproś o unieważnienie klucza — samo usunięcie pliku nie odbiera dostępu osobie, która go skopiowała.

## 5. Pierwszy commit

Po poprawnym sprawdzeniu plików:

```bash
git status
git add .
git diff --staged --stat
git status
```

Przeczytaj listę. Nie powinno być na niej .env.local, katalogu node_modules ani cudzych projektów.

Dopiero wtedy:

```bash
git commit -m "Pierwszy działający chatbot"
git log --oneline -5
```

**Gotowe, gdy:** widzisz swój opis w historii. To nadal zapis lokalny.

Jeśli Git pisze „nothing to commit”, zmiany mogły już zostać zapisane przez asystenta. Sprawdź `git log --oneline -5` zamiast dopisywać losową zmianę.

## 6. Utwórz repo na GitHub

1. Zaloguj się do GitHub na swoje konto.
2. Wybierz **New repository**.
3. Wpisz nazwę, np. **moj-chatbot-laba**.
4. Dla własnej aplikacji możesz wybrać **Private**.
5. Jeśli masz już kod i lokalny commit, utwórz repo **bez** dodatkowego README, licencji i .gitignore.
6. Skopiuj adres **HTTPS** swojego repo.

Materiały kursu i Twój kod mają osobne repozytoria. **Nie wysyłaj aplikacji do SirIdontCare/laba-agenci-ai-s2.**

## 7. Połącz i wyślij

Najpierw sprawdź:

```bash
git remote -v
git branch --show-current
```

Jeśli nie ma origin, dodaj go, zastępując CAŁY adres swoim:

```bash
git remote add origin https://github.com/TWOJ_LOGIN/TWOJE_REPO.git
```

Nie wpisuj dosłownie TWOJ_LOGIN i TWOJE_REPO. Nie dodawaj hasła ani tokenu do adresu.

Jeśli Twoja nowa gałąź ma nazwę inną niż main, możesz ją nazwać main:

```bash
git branch -m main
```

Jeśli main już istnieje lub nie wiesz, na jakiej gałęzi pracujesz, poproś asystenta o wyjaśnienie. Nie wymuszaj zmiany.

Sprawdź adres jeszcze raz i wyślij:

```bash
git remote -v
git push -u origin main
```

Dokończ logowanie przez oficjalny mechanizm wyświetlony przez Git lub menedżer poświadczeń. Hasło do strony GitHub nie zastępuje tokenu przy uwierzytelnianiu Git przez HTTPS. Nie wklejaj sekretów do rozmowy z AI.

**Gotowe, gdy:** otwierasz swoje repo w przeglądarce i widzisz kod oraz opis commita.

## 8. Kolejna zmiana w projekcie

Po sprawdzeniu działania i plików:

```bash
git status
git add .
git diff --staged --stat
git commit -m "Dodaj hasło do chatbota"
git push
```

Nie musisz ponownie robić git init ani remote add. Gdy repo jest połączone z Vercel, push może uruchomić nowe wdrożenie — sprawdź jego wynik w panelu.

## 9. Wybrałem nie ten plik do commita

Jeżeli masz już przynajmniej jeden commit, możesz cofnąć samo przygotowanie konkretnego pliku, zachowując go na dysku:

```bash
git restore --staged NAZWA_PLIKU
```

Uzupełnij nazwę i sprawdź git status. Jeśli nie masz jeszcze żadnego commita albo chodzi o sekret, poproś asystenta o pomoc dopasowaną do stanu repo.

Nie używaj w ciemno poleceń usuwających pliki, czyszczących katalog albo wymuszających nadpisanie zdalnej historii.

## 10. Pobieranie materiałów kursu

Na stronie repo wybierz **Code → Download ZIP** i rozpakuj plik. Nowy ZIP nie aktualizuje automatycznie wcześniej pobranego folderu.

Jeżeli materiały zostały pobrane przez Git i nic w nich nie zmieniałeś, w folderze **materiałów** możesz sprawdzić:

```bash
git status
git pull --ff-only
```

Jeśli pojawi się konflikt albo odmowa, zatrzymaj się i poproś o pomoc. Nie wykonuj tej komendy w swojej aplikacji, żeby „pobrać kolejną lekcję”.

## 11. Najczęstsze komunikaty

| Komunikat | Pomoc |
|---|---|
| not a git repository | [P17](PROBLEMY.md#p17) |
| Please tell me who you are | [P18](PROBLEMY.md#p18) |
| remote origin already exists | [P19](PROBLEMY.md#p19) |
| src refspec main does not match any | [P20](PROBLEMY.md#p20) |
| Authentication failed / Permission denied | [P21](PROBLEMY.md#p21) |
| rejected / non-fast-forward | [P22](PROBLEMY.md#p22) |
| Sekret w repo | [P23](PROBLEMY.md#p23) |

Źródła: [zapis zmian](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository.html), [pierwsze kroki](https://git-scm.com/docs/gittutorial), [wysyłanie commitów](https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository).

[Pomoc](POMOC.md) · [Publikacja na Vercel](GITHUB_I_VERCEL.md)
