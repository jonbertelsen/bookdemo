# Det lille bibliotek

Kørende løsningsforslag til `library-demo.md`: en lille React-app med katalog, søgning, oprettelse af bøger, udlån, egne lån og registrering af aflevering. Data gemmes i JSON Server.

## Start

```bash
npm install
npm run server
```

Åbn en anden terminal i samme mappe:

```bash
npm run dev
```

Åbn den lokale adresse, Vite viser. API'et kører på `http://localhost:4000`. JSON Server gemmer ændringer i `db.json`; tag en kopi før undervisningen, hvis startdata skal kunne gendannes.

## Fordeling af ansvar

- `src/App.jsx`: indlæser bøger, medlemmer og lån med `useEffect`; ejer fælles state og håndterer API-mutationer.
- `src/components/Catalogue.jsx`: lokal søgestate, filtrering og visning af tilgængelighed.
- `src/components/BookForm.jsx`: kontrollerede inputs, validering og submit.
- `src/components/LoanList.jsx`: aktive lån med afleveringsdato og knap til aflevering.
- `src/api.js`: fælles fetch-funktion med kontrol af HTTP-status samt datohjælpere.
- `db.json`: opgavens startdata.

En bog repræsenterer ét fysisk eksemplar. Tilgængelighed beregnes ud fra aktive lån; den gemmes ikke som et ekstra felt på bogen. Egne lån og søgeresultater er også afledte værdier frem for ekstra state.

`App` sender data ned som props og sender callbacks til handlinger. Efter et vellykket API-kald opdateres state med serverens svar. Ved fejl vises en besked, og formularens indhold bevares. Ved låneforsøg på en udlånt bog vises en fejl uden at oprette et lån.

## Forslag til analyse af applikationen

Start applikationen, og undersøg derefter koden. Besvar opgaverne med egne ord, og peg på de linjer, der underbygger jeres svar. Forudsig først, hvad der sker, og kontrollér derefter jeres forklaring i applikationen.

1. **Komponenter og props:** Find de komponenter, som `App` viser. Tegn et lille komponenttræ, og vælg én komponent: Hvilke props modtager den, og hvilke er data eller funktioner?
2. **State og afledte værdier:** Find `useState` i `App.jsx` og `Catalogue.jsx`. Hvad gemmes hvert sted? Find også `myLoans` og `visibleBooks`, og forklar, hvorfor de kan beregnes uden deres egen state.
3. **Indlæsning af data:** Følg `useEffect` i `App.jsx` og `request` i `api.js`. Hvilke endpoints kaldes, og hvad bruges `Promise.all` til? Find den kode, der bestemmer, hvad brugeren ser, mens data hentes, og hvis et kald fejler.
4. **Søgning:** Følg en indtastning fra søgefeltets `onChange` til listen i `Catalogue.jsx`. Hvad gør `trim`, `toLocaleLowerCase`, `filter` og `includes`? Forudsig resultaterne for ` CLEAN `, `martin`, `xyz` og et tomt søgefelt, og afprøv dem.
5. **Formular og validering:** Undersøg `BookForm.jsx`. Hvordan hænger inputfelterne sammen med state, og hvorfor kaldes `preventDefault`? Følg et forsøg på at gemme en titel med kun mellemrum. Hvornår ryddes felterne efter en gyldig indtastning?
6. **Fra klik til gemt bog:** Følg `onAdd` fra formularen til `addBook` i `App.jsx` og videre til API'et. Hvem opretter bogens id? Find den state-opdatering, der får den nye bog til at blive vist, og forklar brugen af `previous` og spread-syntaksen.
7. **Tilgængelighed og udlån:** Brug `db.json` til at forklare, hvordan et lån forbindes med en bog og et medlem. Find `some` i `Catalogue.jsx`: Hvornår er en bog ledig? Følg derefter `borrowBook`, og forklar, hvorfor lån hentes igen før et nyt lån oprettes. Hvad sker der ved et låneforsøg på en udlånt bog?
8. **Egne lån og aflevering:** Find filtreringen af `myLoans`. Hvilke to betingelser skal et lån opfylde? Følg en aflevering fra knappen i `LoanList.jsx` til `returnBook`. Hvad ændrer `PATCH` på serveren, og hvordan får state-opdateringen både lånelisten og kataloget til at ændre sig?
9. **Datoer og deaktiverede knapper:** Find beregningen af afleveringsdatoen i `api.js`. Hvor mange dage lægges til? Undersøg derefter `save` i `App.jsx`: Hvad bruges `try`, `catch` og `finally` til? Følg `busy` fra state i `App` til knappernes `disabled`-attribut. Hvornår deaktiveres knapperne, og hvornår bliver de aktive igen?

## Afgrænsninger

Aktuelt medlem er Alex Jensen (`memberId: "1"`). Lånetiden er valgt til 14 kalenderdage. Medlems- og bibliotekarfunktioner er samlet i samme skærmbillede; login og rollekontrol er uden for opgaven. De to illustrationer i opgaven ligger ikke i dette projekt, så layoutet er et selvstændigt forslag.

Løsningen henter lån igen før et udlån og bruger `busy` til at deaktivere knapperne, mens et API-kald er i gang. Det hjælper mod gentagne klik i samme browserfane, men låser ikke JSON Server. To samtidige klienter kan stadig låne samme bog, fordi kontrollen og oprettelsen er separate requests. Den regel skal håndhæves samlet i en rigtig backend ved videreudvikling.

REST-kaldene følger [JSON Servers officielle dokumentation](https://github.com/typicode/json-server).

## Verifikation

```bash
npm run build
npm run lint
```

Manuel gennemgang af user stories:

1. Start med opgavens data: tre bøger, hvor *The Pragmatic Programmer* er udlånt til Alex.
2. Søg på `clean` og `martin`; begge viser *Clean Code*. Søg på `xyz`; se tom-beskeden.
3. Gem med tom titel eller kun mellemrum; se validering. Tilføj titel og forfatter; bogen vises som ledig.
4. Lån en ledig bog; status skifter, og lånet vises med dato 14 dage fremme.
5. Forsøg at låne samme bog igen; se fejlbesked, og kontrollér at der ikke tilføjes et ekstra lån.
6. Registrér aflevering; lånet forsvinder fra egne lån, og bogen bliver ledig.
7. Genindlæs; ændringerne er bevaret. Stop API'et og forsøg en handling; se fejlbesked.

Build og lint er kørt. API'ets GET, POST og PATCH er afprøvet mod en midlertidig kopi af databasen. Brugergrænsefladen er ikke verificeret i en browser.
