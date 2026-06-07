# BBS1 Bookmarklet

Detta repo innehåller ett bookmarklet för schackturneringar samt en lokal testvy.

Bookmarkleten laddar `sketch.js` på en turneringssida i medlemssystemet och skapar en länk till `BBS2`.

## Filer

- `bookmarklet.txt` - bookmarklet-koden.
- `sketch.js` - JavaScript för bookmarklet och lokal vy.
- `index.html` - enkel lokal vy för att visa exporterade grupper.

## Användning

Besök en turneringssida, till exempel:

`https://member.schack.se/ShowTournamentServlet?id=16539`

Klicka på bookmarkleten. Den:

- hämtar startordningen med `listingtype=3`
- hittar syskongrupper genom att öka id
- avbryter när titel eller deltagarantal avviker
- visar syskonens id
- skapar en `BBS2`-url med `id`, `turnering`, `n` och `players`

Ranking nollutfylls till minst fyra siffror, till exempel `0000`.

## Bookmarklet

Innehållet i `bookmarklet.txt` kan klistras in som ett bokmärke:

`javascript:(()=>{const s=document.createElement('script');s.src='https://christernilsson.github.io/BBS1/sketch.js';document.head.appendChild(s)})()`

License: personlig/ej specificerad
