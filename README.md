# han-website

Persoonlijke pagina van **Han van Hulst** — wat de agent hier bouwt, wordt live gezet op
**https://han.sdai.nl**.

## Hoe het werkt
- Alles in deze map draait in jouw container onder `/workspace/han-website`.
- Er draait automatisch een dev-server op **poort 3000** (zie `server.js`), die
  nginx doorzet naar `https://han.sdai.nl`.
- De **browser-IDE** staat op `https://ide-han.sdai.nl`.

## Wat staat er op de pagina
Een persoonlijk verhaal in de stijl van apple.com: rustige typografie, veel
witruimte, afwisselend witte, lichtgrijze en zwarte secties.

| Sectie | Inhoud |
| --- | --- |
| Hero | Naam, rol (founder Ydb Groep b.v.) en het portret |
| Het verhaal | Drie hoofdstukken: Ydb Groep, EpexSpot (datacenter → cloud, Oracle → Postgres), AI als dagelijkse collega |
| Expertise | Oracle, PostgreSQL, cloud-migraties, AI & automatisering |
| Quote | Zijn eigen LinkedIn-post over het afronden van de EpexSpot-opdracht |
| Ambacht | Stichting Stadsbrouwerij de Kemphaan / Stadsbrouwerij Almere |
| Artikelen | "AI: hype of dagelijkse collega?" en "The power of translation" |
| Contact | Uitnodiging + CTA naar LinkedIn |

Feiten, data en citaten komen van openbaar beschikbare bronnen (het
LinkedIn-profiel en de posts en artikelen daar, plus de site van de brouwerij).
Die bronnen staan ook in de footer van de pagina.

## Bestanden
| Bestand | Wat het doet |
| --- | --- |
| `index.html` | De pagina zelf (nav, hero, verhaal, expertise, ambacht, artikelen, contact, footer) |
| `styles.css` | Alle styling in Apple-stijl: systeemfont, zachte gradients, blur-nav, scroll-reveal |
| `app.js` | Sticky nav, scroll-reveal, actieve sectie in de nav, portret-fallback, jaartal |
| `assets/` | Beeldmateriaal — zie `assets/README.md` voor de portretfoto |
| `server.js` | Zero-dependency statische server op `0.0.0.0:3000` |

De pagina werkt ook zonder JavaScript (de animaties vallen dan weg), gebruikt
semantische HTML en respecteert `prefers-reduced-motion`.

## Portretfoto toevoegen
Zet een foto als `assets/portret.jpg` (verhouding 4:5 werkt het mooist).
Ontbreekt het bestand, dan toont de pagina automatisch een nette fallback met de
initiaal en een kleurgradient — er breekt dus niets.

## Starten / stoppen van de server
De container start de server automatisch. Wil je hem zelf draaien:

```bash
npm run dev          # = node server.js  (poort 3000)
```

Gebruik je een eigen framework (Vite, Next, Express, …)? Zorg dat het op
`0.0.0.0:3000` luistert, en zet zo nodig de auto-server uit met
`sudo supervisorctl stop appserver`.

## Je werk opslaan (git push)
De container heeft schrijfrechten op deze repo via een deploy-key:

```bash
git add -A
git commit -m "beschrijf je wijziging"
git push
```

Repo: `git@github.com:sayfjawad/han-website.git`
