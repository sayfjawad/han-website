# assets

Beeldmateriaal van de filmpagina.

## De film

`feedback.mp4` - 720 x 1280 (9:16), H.264 + AAC, 52,24 s, ongeveer 10,3 MB.
Het bestand is met `+faststart` gemaakt (`moov` voor `mdat`), zodat de browser
direct kan beginnen met afspelen in plaats van eerst het hele bestand op te
halen.

## Een nieuw filmpje toevoegen

```bash
# 1. remuxen naar een faststart mp4 (zonder hercoderen)
ffmpeg -i bron.mp4 -c copy -movflags +faststart assets/feedback.mp4

# 2. posterframe maken (kies een seconde waar een mooi beeld staat)
ffmpeg -ss 3 -i assets/feedback.mp4 -frames:v 1 -q:v 3 assets/feedback-poster.jpg

# 3. controleren wat er in het bestand zit
ffprobe -v error -show_entries stream=codec_name,width,height -show_entries format=duration,size assets/feedback.mp4
```

De poster (`feedback-poster.jpg`) is het stilstaande beeld dat de speler toont
voordat je op play drukt; `index.html` verwijst ernaar met `poster=`.

Let op: de server (`server.js` in de bovenliggende map) moet HTTP Range
ondersteunen, anders kun je niet spoelen en weigert Safari soms om af te spelen.

## Eerder beeldmateriaal

De oude portretfoto-placeholders (`portret-placeholder.jpg`, `.png`, `.svg`)
horen bij het verwijderde portfolio en staan nog in de git-historie:
`git show 826d11d:assets/portret-placeholder.svg`.
