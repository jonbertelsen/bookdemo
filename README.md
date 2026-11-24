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

## Forslag til undervisningsrækkefølge

1. Vis et statisk katalog og udtræk komponenter. Tal om props og `key`.
2. Tilføj søgning med `useState` og afledte søgeresultater.
3. Erstat statiske data med `useEffect`, `fetch`, loading og fejlbeskeder.
4. Byg bogformularen med kontrollerede inputs og `POST`.
5. Indfør lån som relation mellem bog og medlem. Beregn tilgængelighed og opret lån.
6. Vis egne lån, og registrér aflevering med `PATCH`.
7. Udvid senere med routing: katalog og egne lån kan blive separate sider, mens fælles state bliver over begge sider.

## Afgrænsninger

Aktuelt medlem er Alex Jensen (`memberId: "1"`). Lånetiden er valgt til 14 kalenderdage. Medlems- og bibliotekarfunktioner er samlet i samme skærmbillede; login og rollekontrol er uden for opgaven. De to illustrationer i opgaven ligger ikke i dette projekt, så layoutet er et selvstændigt forslag.

Løsningen henter lån igen før et udlån og blokerer gentagne klik under igangværende kald. JSON Server har ingen transaktion, der atomisk kontrollerer og opretter et lån: to samtidige klienter kan stadig låne samme bog. Den regel skal håndhæves i en rigtig backend ved videreudvikling.

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
