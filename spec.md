### Inledning

Jag behöver kod till ett bokmärke.

UTF-8 ska gälla.

Skapa följande filer:

* bookmarklet.txt
* sketch.js
* index.html

Koden i bokmärket ska se ut så här:

javascript:(()=>{const s=document.createElement('script');s.src='https://christernilsson.github.io/BBS1/sketch.js';document.head.appendChild(s)})()

Denna bookmarklet ska först hitta syskonen till given grupp. id numreras uppåt och man avbryter när antalet spelare avviker. Kontrollera att titlarna liknar varandra.  
Exempel:  
"Klass III 3 SM 2025" och "Klass III 4 SM 2025" är syskon.  

Följande grupper är syskon: 16539, 16540, 16541, 16542

Gå igenom syskongruppen och återvinn startordningen.

Detta kan göras genom att ta fram startordningen med listingtype=3

Om den sista gruppen har ett annat antal deltagare än övriga, ignoreras den.

### Input

Primär url: https://member.schack.se/ShowTournamentServlet?id=16539

Här hämtas deltagarnas Namn och Ranking

### Output

Rubriken ska vara turneringens namn.

n = antal deltagare i en grupp

Gå igenom alla syskon.

Visa syskonens id

Samla upp alla deltagare i startordning.

Om elo-talet har färre än fyra siffror ska nollutfyllnad ske. T ex 0 => 0000

Exempel på utdata:
```
Antal deltagare per grupp: 8
Antal grupper: 3
Id: 16539 16540 16541
```

Exempel på url:

Sekundär url: https://christernilsson.github.io/BBS2/#id=16539&turnering=Växjöspelen&n=4&players=1984+Adam+Nilsson_1954+Bertil+Svensson_1812+Cesar+Persson_1776+David+Eriksson_1912+Erik+Karlsson_1917+Filip+Jönsson_2026+Gustav+Hansson_0000+Helge+Ågren

Observera att id ska sättas till parametern id i den primära urlen.

Underscore ska alltid användas som avskiljare.  
Mellanslag skall alltid bytas ut mot +  

Texten "Man måste klicka på urlen för att gå vidare." ska ej skrivas ut.
