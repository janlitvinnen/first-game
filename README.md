# 🎮 Game Collection

Welcome to the Game Collection! 🎮  
This project contains multiple browser-based games built with Kaboom.js.

---

## 🎯 Project Structure

```
first-game/
├── index.html              # Game selection start page
├── minecraft-world/        # Minecraft-style dodge game
│   ├── index.html
│   └── main.js
└── zombie/                 # Zombie survival game
    ├── index.html
    └── main.js
```

---

## 🚀 How to Play

1. **Open the start page**
   - Right-click on `index.html` in the root directory
   - Select **"Reveal in Finder"** (or your system's file manager)
   - Double-click on `index.html` to open it in your browser
   - You'll see a beautiful game selection screen

2. **Choose your game**
   - Click on "Dodge the Slimes" (Minecraft World) or "Zombie Survival"
   - The selected game will load and you can start playing!

3. **Or directly open a specific game**
   - Open `minecraft-world/index.html` for the Minecraft-style game
   - Open `zombie/index.html` for the Zombie game

---

## 🎮 Available Games

### 🧱 Dodge the Slimes (Minecraft World)
A Minecraft-inspired 2D adventure game where you can:
- Build and break blocks
- Explore a procedurally generated world
- Manage your inventory
- Avoid fall damage
- Collect resources

**Controls:**
- W/A/S/D: Move
- SPACE: Jump
- Q: Look down
- E: Open inventory
- Mouse wheel: Select hotbar slot
- Left click: Break/place blocks
- Right click: Use items (eat apples)

### 🧟 Zombie Survival
Fight off waves of zombies and survive as long as possible!

---

## 🛠️ Development

This project uses:
- **Kaboom.js** - Game development library
- **HTML5** - Structure
- **JavaScript** - Game logic
- **CSS3** - Styling for the start page

---

---

## 📝 Original Tutorial Documentation

<details>
<summary>Click to expand the original tutorial for "Dodge the Slimes"</summary>

This started as a simple tutorial project. The original content is preserved here for reference.

### 1. Cursor kennenlernen

**Cursor** ist dein Code-Editor mit eingebauter AI-Unterstützung.

### Die wichtigsten Bereiche:

- **Links: Explorer** – Hier siehst du alle Dateien deines Projekts (z.B. `index.html`, `main.js`, `README.md`)
- **Mitte: Editor** – Hier bearbeitest du deinen Code
- **Rechts: AI Chat** – Hier kannst du mit der AI chatten und Fragen stellen

Wenn du den Chat nicht siehst, kannst du ihn mit `Cmd + L` öffnen.

---

## 2. Spiel starten

Ziel: Du kannst das Spiel im Browser öffnen und neu laden.

1. **Spiel im Browser öffnen**
   - Klicke im **Explorer** (links) mit der rechten Maustaste auf `index.html`
   - Wähle **„Reveal in Finder"** (zeigt die Datei im Finder)
   - Doppelklicke im Finder auf `index.html`
   - Dein Standard-Browser (Chrome, Safari, Firefox, …) sollte sich öffnen
   - Du siehst jetzt ein leeres Spielfeld oder vielleicht schon etwas Code-Ergebnis

2. **Spiel neu laden**
   - Lasse das Browser-Fenster geöffnet
   - Wenn du später Code änderst, drücke im Browser einfach `Cmd + R`
   - So siehst du sofort die neue Version deines Spiels

Wenn du gar nichts siehst oder eine Fehlermeldung kommt: keine Panik.  
Das ist normal in der Programmierung – die AI und dieses README helfen dir. 💪

---

## 3. Erste Schritte in **Cursor**

Du benutzt Cursor wie einen Editor + Chat mit einer schlauen AI.

### 3.1 Dateien anschauen

1. Links im **Explorer** siehst du die **Datei-Liste**.
2. Klicke dort auf `main.js`, um die Haupt-Spiel-Datei zu öffnen.
3. Du siehst den Code des Spiels in der Mitte.

Wenn du die Datei nicht findest, such oben in der Dateiliste nach `main.js`.

---

### 3.2 Mit der AI chatten (prompts schreiben)

Die AI kann dir Code schreiben, erklären oder verbessern.

1. Öffne den **Chat-Bereich** in Cursor  
   - Drücke `Cmd + L` oder klicke auf das Chat-Symbol rechts
   - Der Chat öffnet sich auf der rechten Seite
2. Schreibe dort zuerst:

   > `Bitte antworte auf Deutsch und erkläre Dinge einfach.`

3. Beschreibe dann, was du möchtest, z.B.:

   > `Ich möchte ein kleines Dodge-Spiel programmieren.`
   >
   > `Es gibt eine Spielfigur unten im Bildschirm, die ich mit den Pfeiltasten bewege.`
   >
   > `Von oben fallen Gegner herunter, denen ich ausweichen muss.`  
   > `Bitte passe den Code in main.js an und erkläre mir, was du machst.`

4. Die AI wird dir Code-Vorschläge machen.

---

### 3.3 Änderungen der AI übernehmen

Oft zeigt Cursor dir einen Vorschlag als Vergleich („Diff“):  
Links der alte Code, rechts der neue.

- Normalerweise siehst du einen Knopf wie **„Apply“**, **„Accept“** oder ähnlich.
- Klicke darauf, um die Änderungen zu übernehmen.
- Danach siehst du den neuen Code in `main.js`.

Wenn du unsicher bist:
- Lies kurz durch, was sich geändert hat.
- Du kannst den Chat auch fragen:  
  > `Erkläre mir bitte kurz (auf Deutsch), was du gerade geändert hast.`

---

## 4. Meilenstein 1: Einfach spielbares Spiel

Ziel von **Meilenstein 1**:  
> Du hast ein Spiel, in dem du eine Figur mit den Pfeiltasten bewegst  
> und fallenden Gegnern ausweichst.  
> Wenn du getroffen wirst, ist „Game Over“ und du kannst neu starten.

Es ist egal, ob das Spiel schön aussieht.  
Wichtig ist: **Es ist spielbar**.

### 4.1 Das komplette Spiel implementieren

Jetzt kommt der spannende Teil! Du wirst die AI bitten, das komplette Spiel zu programmieren.

**Kopiere diesen Prompt in den Cursor-Chat und drücke Enter:**

```
Bitte antworte auf Deutsch und erkläre Dinge einfach.

Implementiere ein "Dodge the Slimes" Spiel in main.js mit folgenden Features:

1. SPIELFIGUR (Player):
   - Ein blaues Quadrat (24x24 Pixel, Farbe: rgb(120, 200, 255))
   - Startet am unteren Rand in der Mitte
   - Kann mit Pfeiltasten (links/rechts/oben/unten) bewegt werden
   - Geschwindigkeit: 220
   - Bleibt immer auf dem Bildschirm (clamp zwischen 12 und width/height - 12)
   - Benutze anchor("center") für die Positionierung

2. GEGNER (Enemies):
   - Rote Quadrate (20x20 Pixel, Farbe: rgb(255, 120, 120))
   - Spawnen alle 0.8 Sekunden an zufälliger X-Position oben
   - Fallen nach unten mit zufälliger Geschwindigkeit (120-220)
   - Werden gelöscht, wenn sie unten aus dem Bildschirm verschwinden (pos.y > height() + 20)

3. PUNKTEZÄHLER (Score):
   - Startet bei 0
   - Erhöht sich alle 0.5 Sekunden um 1
   - Wird oben links angezeigt (Position: 12, 8)
   - Benutze z(100) damit der Text über allem anderen liegt

4. KOLLISION & GAME OVER:
   - Wenn Player einen Enemy berührt → Game Over Scene
   - Game Over Scene zeigt: "Game Over", den finalen Score und "(Drücke Enter für Neustart)"
   - Text-Größe: 24, Position: (40, 80)
   - Enter-Taste startet das Spiel neu

5. SZENEN:
   - scene("game") für das Hauptspiel
   - scene("gameover", finalScore) für Game Over
   - Starte mit go("game")

WICHTIG - Benutze diese Kaboom.js Funktionen (neuere Version):
- anchor() statt origin()
- z() statt layer()
- Keine onExitScreen() - prüfe stattdessen pos.y > height() + 20

Nachdem du den Code geschrieben hast:
1. Starte einen lokalen Webserver mit: python3 -m http.server 8000
2. Öffne http://localhost:8000/index.html im Browser
3. Teste das Spiel:
   - Bewege den Player mit Pfeiltasten
   - Prüfe ob Gegner fallen
   - Prüfe ob der Score hochzählt
   - Prüfe ob Game Over funktioniert (laufe in einen Gegner)
   - Prüfe ob Neustart mit Enter funktioniert
4. Mache einen Screenshot vom laufenden Spiel
5. Stoppe den Webserver

Erkläre mir dann auf Deutsch, was du implementiert hast und ob alles funktioniert.
```

**Was passiert dann?**

1. Die AI wird den Code in `main.js` schreiben
2. Die AI wird das Spiel im Browser testen
3. Die AI wird dir erklären, was sie gemacht hat
4. Du siehst einen Screenshot vom fertigen Spiel

**Danach:**

1. Klicke auf **„Apply"** oder **„Accept"**, um den Code zu übernehmen
2. Öffne `index.html` in deinem Browser (siehe Abschnitt 2)
3. Spiele das Spiel! 🎮

Wenn das alles klappt, hast du **Meilenstein 1 geschafft** 🎉  
Sag dann Bescheid – es gibt weitere Aufgaben als nächsten Meilenstein.

---

## 5. Änderungen speichern mit Git & GitHub (in Cursor)

Wenn du mit deinem Ergebnis zufrieden bist, möchtest du es in GitHub speichern.  

### 5.1 Änderungen anschauen

1. Auf der **linken Seite** (wo auch der Explorer ist) findest du das **Source Control** Panel
2. Klicke auf das Icon mit dem **Verzweigungssymbol** (sieht aus wie ein Y mit drei Kreisen)
   - Es ist normalerweise das dritte Icon von oben in der linken Seitenleiste
   - Direkt unter dem Explorer-Icon (Dateien) und dem Such-Icon (Lupe)
3. Du siehst jetzt eine Liste mit geänderten Dateien, z.B.:
   - `main.js`
   - vielleicht auch `README.md`

Du kannst auf eine Datei klicken, um die Änderungen anzusehen.

---

### 5.2 Commit machen

1. Suche im Git-Bereich das Feld für die **Commit-Nachricht**.
2. Schreibe eine kurze Nachricht, z.B.:

   - `Erster spielbarer Prototyp`
   - `Player-Bewegung und Gegner`

3. Klicke auf den Knopf **„Commit“** oder **„Commit & Push“**  
   (der genaue Name kann etwas variieren).
4. Wenn Cursor dich fragt, ob du GitHub verbinden möchtest:
   - Melde dich mit deinem GitHub-Account an.
   - Folge den Anweisungen auf dem Bildschirm.

Nach dem Push ist dein Code in GitHub gespeichert.

Wenn du dir unsicher bist, schreib in den Cursor-Chat z.B.:

> `Bitte erkläre mir Schritt für Schritt, wie ich in Cursor einen Git-Commit mache und zu GitHub pushe.`

---

## 6. Wenn etwas schiefgeht…

Das ist **normal** beim Programmieren. Ein paar Tipps:

- **Fehler im Browser?**
  - Öffne die Entwickler-Konsole (`Cmd + Option + I` in Chrome/Safari) und schau nach roten Fehlermeldungen.
  - Kopiere die Fehlermeldung und schreib in den Cursor-Chat:

    > `Ich bekomme diesen Fehler im Browser: <Fehlermeldung>.`  
    > `Bitte erkläre mir auf Deutsch, was das bedeutet und wie ich es reparieren kann.`

- **Spiel „fühlt sich komisch an“?**
  - Beschreibe einfach im Chat, was du erwartest und was passiert.

---

## 7. Nächste Schritte (nach Meilenstein 1)

Wenn du **Meilenstein 1** geschafft und einen Commit gemacht hast,  
bekommst du von deinem „Auftraggeber" 😉 neue Anweisungen für **Meilenstein 2**.

Bis dahin: Viel Spaß beim Basteln und Ausprobieren! 🚀

</details>