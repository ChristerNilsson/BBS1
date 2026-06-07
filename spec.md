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

VIKTIGT: Startordningen ges av positionen i listan, inte av den första kolumnen.

Om den sista gruppen har ett annat antal deltagare än övriga, ignoreras den.


### Exempel 1 Växjöspelen 2025

#### Input

Primär url: https://member.schack.se/ShowTournamentServlet?id=16442

Här hämtas deltagarnas Namn och Ranking

#### Output

Antal deltagare per grupp: 4
Antal grupper: 13
Id: 16442 .. 16454

Sekundär url: 

<!-- https://christernilsson.github.io/BBS2/#id=16442&turnering=V%C3%A4xj%C3%B6spelen+2025+grupp+1&n=4&players=2118+CM+Anders+Wengholm_2123+CM+Max+Wahlund_2233+Carlos+T%C3%B6rnberg_2188+Julius+Schwartz_2107+FM+Conny+Holst_2107+CM+Nedzad+Neretljak_2029+Martin+G%C3%B6ransson_2105+Sebastian+Persson_2000+Nejib+Bouaziz_1999+Simon+Gustafsson_1998+Kristian+Eriksson_2020+Lennart+Fransson_1993+Lukas+Guagliano_1984+Christoffer+Stenman_1966+Isac+Johansson_1995+H%C3%A5kan+Winfridsson_1942+Lukas+Sp%C3%A5ng_1964+Andreas+Peitersen_1936+Roy+Berg_1960+Joakim+Eriksson_1936+Marcus+Johnsson_1896+Eva+Johansson_1892+Anders+Kvarby_1881+Ofelia+Th%C3%B6rnqvist_1852+Arnold+Hermansson_1827+Fredrik+Qwarfort_1841+Sten+Bernhardsson_1833+Karl+Malbert_1814+Minh+Thuc+Le+Doan_1824+M%C3%A5rten+Garner_1824+Bj%C3%B6rn+Ottosson_1792+Nils+Zandler_1775+Lukas+Rasmussen_1735+Per+D%C3%A4ldborg_1728+Bengt+Svensson_1725+Joakim+Wahlstr%C3%B6m_1713+Liam+Blixth_1717+Martin+Sedl%C3%A1k_1723+Sven-Ingvar+Sundin_1685+Paul+Eknor_1657+Julius+M%C3%A4lming_1670+Marvin+Mulato_1614+Duy+Thuc+Le+Doan_1683+Liron+Liebe_1614+Leif+Westman_1573+Anders+Hansen_1587+Michael+Persson_1575+Nellie+St%C3%A5hl_1509+Theodor+Cornfors_1529+Stefan+Magnusson_1525+Andreas+Lundstr%C3%B6m_1540+Olof+Johannesson -->

Rubriken ska vara turneringens namn.

n = antal deltagare i en grupp

Gå igenom alla syskon.

Visa syskonens id

Samla upp alla deltagare i startordning.

Om elo-talet har färre än fyra siffror ska nollutfyllnad ske. T ex 0 => 0000

Observera att id ska sättas till parametern id i den primära urlen.

Underscore ska alltid användas som avskiljare.  
Mellanslag skall alltid bytas ut mot +  

Texten "Man måste klicka på urlen för att gå vidare." ska ej skrivas ut.
