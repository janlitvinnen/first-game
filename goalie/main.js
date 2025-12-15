// Kaboom initialisieren
kaboom({
  canvas: document.querySelector("#game"),
  width: 800,
  height: 600,
  background: [50, 150, 50], // Grüner Rasen
});

// Hauptspiel-Szene
scene("game", (levelData) => {
  // Level und Spielwerte
  const currentLevel = levelData?.level || 1;
  let score = levelData?.score || 0;
  let savedBalls = levelData?.savedBalls || 0;
  
  // Ball-Geschwindigkeit erhöht sich mit Level
  const ballSpeed = 180 + (currentLevel - 1) * 80; // Level 1: 180, Level 2: 260, etc.
  
  // Anzeige oben links
  const levelText = add([
    text(`Level ${currentLevel}`, { size: 28 }),
    pos(20, 20),
    color(255, 255, 100),
    z(100),
  ]);
  
  const scoreText = add([
    text(`Punkte: ${score}`, { size: 24 }),
    pos(20, 55),
    color(255, 255, 255),
    z(100),
  ]);
  
  const progressText = add([
    text(`Gehalten: ${savedBalls}/10`, { size: 20 }),
    pos(20, 85),
    color(200, 255, 200),
    z(100),
  ]);

  // Tor zeichnen (oberer Bildschirmrand)
  // Tor-Hintergrund (Netz)
  add([
    rect(400, 80),
    pos(width() / 2, 0),
    color(220, 220, 220),
    anchor("top"),
    z(1),
  ]);
  
  // Linker Torpfosten
  add([
    rect(15, 80),
    pos(width() / 2 - 200, 0),
    color(255, 255, 255),
    anchor("top"),
    z(2),
  ]);
  
  // Rechter Torpfosten
  add([
    rect(15, 80),
    pos(width() / 2 + 200, 0),
    color(255, 255, 255),
    anchor("top"),
    z(2),
  ]);
  
  // Querlatte
  add([
    rect(430, 15),
    pos(width() / 2, 0),
    color(255, 255, 255),
    anchor("top"),
    z(2),
  ]);
  
  // Torlinie
  add([
    rect(430, 5),
    pos(width() / 2, 85),
    color(255, 255, 255),
    anchor("center"),
    z(2),
  ]);

  // Torwart (grünes Rechteck auf der Torlinie)
  const goalkeeper = add([
    rect(60, 70),
    pos(width() / 2, 85),
    color(100, 200, 255),
    anchor("center"),
    area(),
    z(10),
    "goalkeeper",
  ]);
  
  // Torwart-Kopf (Detail)
  goalkeeper.add([
    circle(20),
    pos(0, -35),
    color(255, 220, 180),
    anchor("center"),
  ]);

  // Stürmer (unten in der Mitte)
  const striker = add([
    rect(40, 60),
    pos(width() / 2, height() - 100),
    color(255, 100, 100),
    anchor("center"),
    z(5),
  ]);
  
  // Stürmer-Kopf
  striker.add([
    circle(15),
    pos(0, -30),
    color(255, 220, 180),
    anchor("center"),
  ]);

  // Ball-Variable
  let currentBall = null;
  let ballDirection = "center"; // "left", "center", "right"
  
  // Funktion zum Spawnen eines neuen Balls
  function spawnBall() {
    if (currentBall) {
      destroy(currentBall);
    }
    
    // Zufällige Richtung wählen (links oder rechts)
    const directions = ["left", "right"];
    ballDirection = choose(directions);
    
    // Ball beim Stürmer spawnen
    currentBall = add([
      circle(15),
      pos(striker.pos.x, striker.pos.y - 40),
      color(255, 255, 255),
      area(),
      anchor("center"),
      z(15),
      "ball",
      {
        targetX: ballDirection === "left" ? width() / 2 - 150 : width() / 2 + 150,
        speed: ballSpeed, // Geschwindigkeit abhängig vom Level
      }
    ]);
  }

  // Ersten Ball spawnen
  wait(1, () => {
    spawnBall();
  });

  // Torwart-Bewegung
  const GOALKEEPER_SPEED = 350;
  const MIN_X = width() / 2 - 200 + 30; // Innerhalb des Tors
  const MAX_X = width() / 2 + 200 - 30;
  
  onKeyDown("left", () => {
    goalkeeper.pos.x -= GOALKEEPER_SPEED * dt();
    goalkeeper.pos.x = Math.max(MIN_X, goalkeeper.pos.x);
  });
  
  onKeyDown("right", () => {
    goalkeeper.pos.x += GOALKEEPER_SPEED * dt();
    goalkeeper.pos.x = Math.min(MAX_X, goalkeeper.pos.x);
  });

  // Ball-Bewegung und Logik
  onUpdate("ball", (ball) => {
    // Ball bewegt sich zum Ziel
    const dx = ball.targetX - ball.pos.x;
    const dy = 85 - ball.pos.y; // Torlinie ist bei y=85
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
      // Normalisierte Richtung
      ball.pos.x += (dx / distance) * ball.speed * dt();
      ball.pos.y += (dy / distance) * ball.speed * dt();
    }
    
    // Prüfen ob Ball die Torlinie berührt hat (Tor = Minuspunkte!)
    if (ball.pos.y <= 85) {
      // Ball wurde verpasst - MINUSPUNKTE!
      score -= 2;
      scoreText.text = `Punkte: ${score}`;
      
      // Ball wird rot für Feedback
      ball.color = rgb(255, 50, 50);
      
      // Neuen Ball nach kurzer Pause
      wait(0.5, () => {
        destroy(ball);
        currentBall = null;
        wait(1.2, () => {
          spawnBall();
        });
      });
    }
  });

  // Kollision zwischen Torwart und Ball
  goalkeeper.onCollide("ball", (ball) => {
    // Ball gehalten!
    score += 3; // +3 Punkte für gehaltenen Ball
    savedBalls++;
    
    scoreText.text = `Punkte: ${score}`;
    progressText.text = `Gehalten: ${savedBalls}/10`;
    
    // Visuelles Feedback (Ball wird grün)
    ball.color = rgb(100, 255, 100);
    
    // Prüfen ob Level geschafft (10 Bälle gehalten)
    if (savedBalls >= 10) {
      // LEVEL UP!
      wait(0.5, () => {
        destroy(ball);
        currentBall = null;
        
        // Zeige Level-Up Nachricht
        const levelUpText = add([
          text(`LEVEL ${currentLevel} GESCHAFFT!`, { size: 36 }),
          pos(width() / 2, height() / 2 - 40),
          color(255, 255, 100),
          anchor("center"),
          z(200),
        ]);
        
        const nextLevelText = add([
          text(`Nächstes Level in 3 Sekunden...`, { size: 24 }),
          pos(width() / 2, height() / 2 + 20),
          color(255, 255, 255),
          anchor("center"),
          z(200),
        ]);
        
        // Nächstes Level nach 3 Sekunden
        wait(3, () => {
          go("game", {
            level: currentLevel + 1,
            score: score,
            savedBalls: 0,
          });
        });
      });
    } else {
      // Normaler Ball - neuen spawnen
      wait(0.3, () => {
        destroy(ball);
        currentBall = null;
        wait(1.2, () => {
          spawnBall();
        });
      });
    }
  });

  // Zurück zur Startseite (ESC-Taste)
  onKeyPress("escape", () => {
    window.location.href = "../index.html";
  });
});

// Spiel starten
go("game");

