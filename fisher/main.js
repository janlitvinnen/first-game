// Kaboom wird über das Script-Tag in index.html geladen
kaboom({
  canvas: document.querySelector("#game"),
  width: 800,
  height: 600,
  background: [100, 180, 255], // Heller Blauton für Wasserfall
});

// Sprites laden
loadSprite("bear", "https://img.icons8.com/color/96/000000/bear.png");
loadSprite("fish1", "https://img.icons8.com/color/96/000000/fish.png"); // Tropischer Fisch
loadSprite("fish2", "https://img.icons8.com/color/96/000000/salmon.png"); // Lachs

// Punktestand
let score = 0;

// Hauptspiel-Szene
scene("game", () => {
  // Wasserfall-Hintergrund-Effekt (vertikale Linien)
  for (let i = 0; i < 20; i++) {
    const x = rand(0, width());
    add([
      rect(2, height()),
      pos(x, 0),
      color(150, 200, 255),
      opacity(0.3),
      z(-1),
    ]);
  }

  // Bär (Spieler) - unten in der Mitte mit Sprite
  const GROUND_Y = height() - 60; // Boden-Position
  
  const bear = add([
    sprite("bear"),
    pos(width() / 2, GROUND_Y),
    area(),
    anchor("center"),
    scale(1.2),
    "bear",
    {
      isJumping: false,
      jumpSpeed: 0,
      gravity: 1200, // Gravitation
    }
  ]);

  // Sprung- und Bewegungslogik
  bear.onUpdate(() => {
    // Gravitation anwenden
    if (bear.pos.y < GROUND_Y) {
      bear.jumpSpeed += bear.gravity * dt();
      bear.pos.y += bear.jumpSpeed * dt();
    } else {
      // Bär ist am Boden
      bear.pos.y = GROUND_Y;
      bear.jumpSpeed = 0;
      bear.isJumping = false;
    }
  });

  // Bewegungsgeschwindigkeit des Bären
  const BEAR_SPEED = 400;

  // Steuerung: Pfeiltasten für Links/Rechts
  onKeyDown("left", () => {
    bear.move(-BEAR_SPEED, 0);
    // Begrenzung auf Bildschirmgrenzen
    if (bear.pos.x < 30) {
      bear.pos.x = 30;
    }
  });

  onKeyDown("right", () => {
    bear.move(BEAR_SPEED, 0);
    // Begrenzung auf Bildschirmgrenzen
    if (bear.pos.x > width() - 30) {
      bear.pos.x = width() - 30;
    }
  });

  // Springen mit Pfeil-nach-oben, W oder Leertaste
  onKeyPress("up", () => {
    console.log("UP gedrückt - Sprung versucht");
    if (!bear.isJumping && bear.pos.y >= GROUND_Y - 5) {
      console.log("✅ SPRUNG!");
      bear.isJumping = true;
      bear.jumpSpeed = -500; // Sprungkraft (negativ = nach oben)
    }
  });

  onKeyPress("w", () => {
    console.log("W gedrückt - Sprung versucht");
    if (!bear.isJumping && bear.pos.y >= GROUND_Y - 5) {
      console.log("✅ SPRUNG!");
      bear.isJumping = true;
      bear.jumpSpeed = -500;
    }
  });

  onKeyPress("space", () => {
    console.log("SPACE gedrückt - Sprung versucht");
    if (!bear.isJumping && bear.pos.y >= GROUND_Y - 5) {
      console.log("✅ SPRUNG!");
      bear.isJumping = true;
      bear.jumpSpeed = -500;
    }
  });

  // Punkteanzeige
  const scoreText = add([
    text("Punkte: 0", { size: 32 }),
    pos(20, 20),
    color(255, 255, 255),
    z(10),
  ]);

  // Funktion zum Spawnen von Fischen mit Sprites
  function spawnFish() {
    // Wähle zufällig zwischen den zwei Fisch-Sprites
    const fishSprite = choose(["fish1", "fish2"]);
    
    // Salmon (fish2) ist schneller und gibt mehr Punkte
    const isSalmon = fishSprite === "fish2";
    const fishSpeed = isSalmon ? rand(250, 350) : rand(100, 200); // Salmon viel schneller!
    const fishPoints = isSalmon ? 2 : 1; // Salmon gibt 2 Punkte
    
    const fish = add([
      sprite(fishSprite),
      pos(rand(30, width() - 30), -20),
      area(),
      anchor("center"),
      scale(0.8),
      rotate(90), // Drehe den Fisch so dass er nach unten zeigt
      "fish",
      {
        speed: fishSpeed,
        points: fishPoints,
        isSalmon: isSalmon,
      },
    ]);

    // Fisch bewegt sich nach unten
    fish.onUpdate(() => {
      fish.move(0, fish.speed);

      // Wenn Fisch den Boden erreicht: -1 Punkt
      if (fish.pos.y > height()) {
        score -= 1;
        scoreText.text = "Punkte: " + score;
        destroy(fish);
      }
    });

    // Kollision mit Bär: Punkte je nach Fischart
    fish.onCollide("bear", () => {
      score += fish.points;
      scoreText.text = "Punkte: " + score;
      
      // Kleiner visueller Effekt beim Fangen
      const pointColor = fish.isSalmon ? rgb(255, 215, 0) : rgb(0, 255, 0); // Gold für Salmon, Grün für normale Fische
      add([
        text("+" + fish.points, { size: fish.isSalmon ? 32 : 24 }),
        pos(fish.pos),
        color(pointColor),
        lifespan(0.5),
        move(UP, 50),
      ]);
      
      destroy(fish);
    });
  }

  // Alle 1-2 Sekunden einen neuen Fisch spawnen
  loop(rand(1, 2), () => {
    spawnFish();
  });

  // Anleitung anzeigen (verschwindet nach 5 Sekunden)
  const instructions = add([
    text("Pfeiltasten ← → zum Bewegen | ↑ W oder LEERTASTE zum Springen\nFange die Fische! Tropischer Fisch: +1, Lachs: +2\nVerpasste Fische: -1 Punkt", {
      size: 18,
      align: "center",
    }),
    pos(width() / 2, height() / 2),
    color(255, 255, 255),
    anchor("center"),
    opacity(1),
    z(100),
  ]);

  // Anleitung ausblenden nach 5 Sekunden
  wait(5, () => {
    tween(
      instructions.opacity,
      0,
      1,
      (val) => instructions.opacity = val,
      easings.linear
    ).then(() => destroy(instructions));
  });
});

// Spiel starten
go("game");

