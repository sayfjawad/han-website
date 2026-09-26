# assets

Deze map is bedoeld voor beeldmateriaal van de site.

## Portretfoto

De hero gebruikt `assets/portret.jpg`. Zet daar je eigen foto neer (bijvoorbeeld
geëxporteerd uit je LinkedIn-profiel, verhouding 4:5 werkt het mooist, richtlijn
1200 × 1500 px).

Zolang het bestand ontbreekt, toont de pagina automatisch een nette fallback met
je initiaal en een kleurverloop — er breekt dus niets.

Extra afbeeldingen? Gebruik dezelfde aanpak:

```html
<div class="media">
  <span class="media__fallback" aria-hidden="true">H</span>
  <img data-fallback src="assets/bestandsnaam.jpg" alt="Beschrijving" width="1200" height="800" decoding="async">
</div>
```
