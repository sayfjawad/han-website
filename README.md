# han-website

Persoonlijke pagina van **Han van Hulst** - live op **https://han.sdai.nl**.

## Wat staat er op de pagina

Een film, verder niets. De homepage is een lege zwarte pagina met in het midden
de verticale video `assets/feedback.mp4` met de native browserbediening
(`<video controls>`). Geen navigatie, geen footer, geen andere secties.

- Geen autoplay: de bezoeker drukt zelf op play. Browsers blokkeren autoplay met
  geluid en het filmpje heeft Nederlandse spraak.
- Geen tekst of knoppen over het beeld: de Nederlandse koppen en de ondertitels
  in het Perzisch en Iraaks-Arabisch zitten al in het filmpje zelf.
- Voor schermlezers staat er een onzichtbare titel en beschrijving in
  `index.html`. De pagina werkt volledig zonder JavaScript.

## Bestanden

| Bestand | Wat het doet |
| --- | --- |
| `index.html` | De filmpagina: de speler plus een onzichtbare titel/beschrijving |
| `styles.css` | Zwarte achtergrond, speler gecentreerd in 9:16-verhouding |
| `assets/feedback.mp4` | De film (720 x 1280, H.264 + AAC, 52,24 s, faststart) |
| `assets/feedback-poster.jpg` | Posterframe dat je ziet voor de eerste klik |
| `assets/README.md` | Hoe je een nieuw filmpje en posterframe toevoegt |
| `server.js` | Zero-dependency statische server op `0.0.0.0:3000`, met HTTP Range |
| `package.json` | `npm run dev` = `node server.js` |

## Hoe het werkt

- Alles in deze map draait in de container onder `/workspace/han-website`.
- Er draait automatisch een dev-server op **poort 3000** (zie `server.js`), die
  nginx doorzet naar `https://han.sdai.nl`.
- De **browser-IDE** staat op `https://ide-han.sdai.nl`.

## Video: waarom faststart en Range-support nodig zijn

`server.js` stuurt voor mediabestanden het juiste MIME-type (`video/mp4`) en
ondersteunt HTTP Range: `Accept-Ranges: bytes`, `206 Partial Content`,
`416 Range Not Satisfiable` en `HEAD`.

- Zonder `video/mp4` weigert Safari het bestand af te spelen.
- Zonder Range-support kun je niet vooruit spoelen en op iOS speelt er soms
  helemaal niets.
- Het mp4-bestand is met `-movflags +faststart` gemaakt: het `moov`-atoom staat
  voor `mdat`, zodat de browser direct kan beginnen met afspelen.

## De film vervangen

Zie `assets/README.md`. Kort: een nieuw bestand toevoegen met
`ffmpeg -i bron.mp4 -c copy -movflags +faststart assets/feedback.mp4`, een nieuw
posterframe maken en de browser verversen.

## Het oude portfolio terugzetten

De vorige homepage (hero, het verhaal, expertise, quote, ambacht, artikelen,
contact) staat nog in de git-historie:

```bash
git show 826d11d:index.html        # bekijken
git checkout 826d11d -- index.html styles.css app.js README.md assets
```

`826d11d` is de laatste commit met het portfolio; `d7dfca4` is de originele
startersversie.

## Starten / stoppen van de server

De container start de server automatisch. Wil je hem zelf draaien:

```bash
npm run dev          # = node server.js  (poort 3000)
```

Gebruik je een eigen framework (Vite, Next, Express, ...)? Zorg dat het op
`0.0.0.0:3000` luistert, en zet zo nodig de auto-server uit met
`sudo supervisorctl stop appserver`.

Let op: `server.js` leest niets in bij het opstarten, maar een wijziging in dat
bestand geldt pas na een herstart van het proces.

## Je werk opslaan (git push)

De container heeft schrijfrechten op deze repo via een deploy-key:

```bash
git add -A
git commit -m "beschrijf je wijziging"
git push
```

Repo: `git@github.com:sayfjawad/han-website.git`
