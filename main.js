// Kaboom is loaded via script tag in index.html
kaboom({
  canvas: document.querySelector("#game"),
  width: 1200,
  height: 600,
  background: [20, 30, 60], // Nacht-Himmel
});

// Game Over Szene
scene("gameover", () => {
  add([
    text("GAME OVER", { size: 48 }),
    pos(width() / 2, height() / 2 - 50),
    color(255, 0, 0),
    anchor("center")
  ]);
  
  add([
    text("Die Zombies haben gewonnen!", { size: 24 }),
    pos(width() / 2, height() / 2 + 20),
    color(255, 255, 255),
    anchor("center")
  ]);
  
  add([
    text("Drücke ENTER zum Neustart", { size: 20 }),
    pos(width() / 2, height() / 2 + 80),
    color(200, 200, 200),
    anchor("center")
  ]);
  
  onKeyPress("enter", () => {
    go("game");
  });
});

// Sieg-Szene
scene("victory", (data) => {
  const currentLevel = data.currentLevel || 1;
  const nextLevel = currentLevel + 1;
  const hasNextLevel = nextLevel <= 6; // Aktuell 6 Levels!
  
  add([
    text("LEVEL GESCHAFFT!", { size: 48 }),
    pos(width() / 2, height() / 2 - 80),
    color(100, 255, 100),
    anchor("center")
  ]);
  
  add([
    text(`Level ${currentLevel} abgeschlossen!`, { size: 24 }),
    pos(width() / 2, height() / 2 - 20),
    color(255, 255, 255),
    anchor("center")
  ]);
  
  add([
    text(`Verbleibende Leben: ${Math.ceil(data.playerHealth)} ♥`, { size: 20 }),
    pos(width() / 2, height() / 2 + 20),
    color(255, 100, 100),
    anchor("center")
  ]);
  
  add([
    text(`Goldene Äpfel: ${data.goldenApples} 🍎`, { size: 20 }),
    pos(width() / 2, height() / 2 + 50),
    color(255, 215, 0),
    anchor("center")
  ]);
  
  if (hasNextLevel) {
    add([
      text(`Drücke ENTER für Level ${nextLevel}`, { size: 24 }),
      pos(width() / 2, height() / 2 + 100),
      color(100, 255, 100),
      anchor("center")
    ]);
    
    let levelInfo = "";
    let infoColor = rgb(200, 200, 200);
    
    if (nextLevel === 2) {
      levelInfo = "5 Zombies mit je 7,5 ♥";
    } else if (nextLevel === 3) {
      levelInfo = "10 Zombies mit je 10 ♥";
      if (data.goldenApples >= 11) {
        levelInfo += " - SCHWERT-UPGRADE! ⚔✨";
        infoColor = rgb(255, 215, 0);
      }
    } else if (nextLevel === 4) {
      levelInfo = "⚠️ BOSS-KAMPF! 50 ♥ ⚠️";
      infoColor = rgb(255, 50, 50); // Rot für Boss!
    } else if (nextLevel === 5) {
      levelInfo = "2 Super-Zombies mit je 25 ♥";
      infoColor = rgb(255, 100, 100);
    } else if (nextLevel === 6) {
      levelInfo = "5 Starke Zombies mit je 40 ♥";
      infoColor = rgb(255, 80, 80);
    }
    
    add([
      text(`(${levelInfo})`, { size: nextLevel === 4 ? 24 : 18 }), // Größer für Boss!
      pos(width() / 2, height() / 2 + 130),
      color(infoColor),
      anchor("center")
    ]);
    
    onKeyPress("enter", () => {
      // Wenn Level 5 oder 6 kommt, gehe zum Shop
      if (nextLevel === 5) {
        go("shop", {
          level: nextLevel,
          playerHealth: data.playerHealth,
          goldenApples: data.goldenApples,
          coins: data.coins || 0,
          hasShield: data.hasShield || false,
          hasDiamondSword: data.hasDiamondSword || false,
          hasNetheriteSword: data.hasNetheriteSword || false,
          hasIronArmor: data.hasIronArmor || false
        });
      } else if (nextLevel === 6) {
        // 100 Münzen nach Level 5!
        go("coinreward", {
          level: nextLevel,
          playerHealth: data.playerHealth,
          goldenApples: data.goldenApples,
          coins: (data.coins || 0) + 100,
          hasShield: data.hasShield || false,
          hasDiamondSword: data.hasDiamondSword || false,
          hasNetheriteSword: data.hasNetheriteSword || false,
          hasIronArmor: data.hasIronArmor || false
        });
      } else {
        go("game", {
          level: nextLevel,
          playerHealth: data.playerHealth,
          goldenApples: data.goldenApples,
          coins: data.coins || 0,
          hasShield: data.hasShield || false,
          hasDiamondSword: data.hasDiamondSword || false,
          hasNetheriteSword: data.hasNetheriteSword || false,
          hasIronArmor: data.hasIronArmor || false
        });
      }
    });
  } else {
    // Boss besiegt - Schild-Belohnung!
    if (currentLevel === 4) {
      add([
        text("🏆 BOSS BESIEGT! 🏆", { size: 48 }),
        pos(width() / 2, height() / 2 - 60),
        color(255, 215, 0),
        anchor("center")
      ]);
      
      add([
        text("🛡️ SCHILD ERHALTEN! 🛡️", { size: 36 }),
        pos(width() / 2, height() / 2 + 10),
        color(100, 200, 255),
        anchor("center")
      ]);
      
      add([
        text("Drücke SHIFT um dich zu schützen!", { size: 20 }),
        pos(width() / 2, height() / 2 + 50),
        color(200, 200, 200),
        anchor("center")
      ]);
      
      add([
        text(`Leben: ${Math.ceil(data.playerHealth)} ♥  |  Äpfel: ${data.goldenApples} 🍎`, { size: 18 }),
        pos(width() / 2, height() / 2 + 90),
        color(255, 255, 255),
        anchor("center")
      ]);
      
      add([
        text("Drücke ENTER für Level 5", { size: 24 }),
        pos(width() / 2, height() / 2 + 140),
        color(100, 255, 100),
        anchor("center")
      ]);
      
      onKeyPress("enter", () => {
        go("shop", {
          level: nextLevel,
          playerHealth: data.playerHealth,
          goldenApples: data.goldenApples,
          hasShield: true,
          hasDiamondSword: false
        });
      });
    } else {
      // Spiel komplett gewonnen!
      add([
        text("🎉 SPIEL GEWONNEN! 🎉", { size: 48 }),
        pos(width() / 2, height() / 2 + 90),
        color(255, 215, 0),
        anchor("center")
      ]);
      
      add([
        text("Du hast alle Levels geschafft!", { size: 28 }),
        pos(width() / 2, height() / 2 + 140),
        color(100, 255, 100),
        anchor("center")
      ]);
      
      add([
        text("Drücke ENTER zum Neustart", { size: 20 }),
        pos(width() / 2, height() / 2 + 180),
        color(200, 200, 200),
        anchor("center")
      ]);
      
      onKeyPress("enter", () => {
        go("game", { level: 1 });
      });
    }
  }
});

// Münz-Belohnungs-Szene
scene("coinreward", (data) => {
  // Hintergrund
  add([
    rect(width(), height()),
    pos(0, 0),
    color(20, 30, 80),
    z(-1)
  ]);
  
  add([
    text("🎉 BELOHNUNG! 🎉", { size: 48 }),
    pos(width() / 2, height() / 2 - 80),
    color(255, 215, 0),
    anchor("center")
  ]);
  
  add([
    text("Du hast 100 Münzen erhalten!", { size: 32 }),
    pos(width() / 2, height() / 2 - 10),
    color(255, 255, 100),
    anchor("center")
  ]);
  
  add([
    text("💰", { size: 64 }),
    pos(width() / 2, height() / 2 + 50),
    color(255, 215, 0),
    anchor("center")
  ]);
  
  add([
    text(`Münzen: ${data.coins} 💰`, { size: 28 }),
    pos(width() / 2, height() / 2 + 120),
    color(255, 255, 255),
    anchor("center")
  ]);
  
  add([
    text("Drücke ENTER für den LADEN", { size: 24 }),
    pos(width() / 2, height() - 80),
    color(100, 255, 100),
    anchor("center")
  ]);
  
  onKeyPress("enter", () => {
    go("shop", data);
  });
});

// Shop-Szene
scene("shop", (data) => {
  // Shop-Hintergrund (dunkelblau)
  add([
    rect(width(), height()),
    pos(0, 0),
    color(20, 30, 80),
    z(-1)
  ]);
  
  add([
    text("🏪 LADEN 🏪", { size: 48 }),
    pos(width() / 2, 40),
    color(255, 215, 0),
    anchor("center"),
    z(10)
  ]);
  
  // Währungsanzeige
  const hasCoins = (data.coins || 0) > 0;
  if (hasCoins) {
    add([
      text(`Münzen: ${data.coins} 💰  |  Äpfel: ${data.goldenApples} 🍎`, { size: 20 }),
      pos(width() / 2, 90),
      color(255, 255, 255),
      anchor("center"),
      z(10)
    ]);
  } else {
    add([
      text(`Goldene Äpfel: ${data.goldenApples} 🍎`, { size: 22 }),
      pos(width() / 2, 90),
      color(255, 255, 255),
      anchor("center"),
      z(10)
    ]);
  }
  
  let currentCoins = data.coins || 0;
  let currentApples = data.goldenApples;
  let boughtDiamond = data.hasDiamondSword;
  let boughtNetherite = data.hasNetheriteSword;
  let boughtArmor = data.hasIronArmor;
  
  // Shop-Items (verschiedene basierend auf Münzen)
  if (!hasCoins) {
    // Diamantschwert-Shop (nur Äpfel)
    const diamondPrice = 3;
    const canBuy = currentApples >= diamondPrice && !boughtDiamond;
    
    add([
      rect(450, 220),
      pos(width() / 2, height() / 2 + 10),
      color(60, 60, 100),
      outline(4, canBuy ? rgb(100, 255, 100) : rgb(100, 100, 100)),
      anchor("center"),
      z(5)
    ]);
    
    add([
      text("💎 DIAMANTSCHWERT", { size: 32 }),
      pos(width() / 2, height() / 2 - 70),
      color(100, 200, 255),
      anchor("center"),
      z(10)
    ]);
    
    add([
      text("Macht 6 Herzen Schaden!", { size: 18 }),
      pos(width() / 2, height() / 2 - 30),
      color(200, 200, 200),
      anchor("center"),
      z(10)
    ]);
    
    add([
      text(`Preis: ${diamondPrice} 🍎`, { size: 24 }),
      pos(width() / 2, height() / 2 + 10),
      color(255, 215, 0),
      anchor("center"),
      z(10)
    ]);
    
    if (boughtDiamond) {
      add([
        text("✓ BEREITS GEKAUFT", { size: 20 }),
        pos(width() / 2, height() / 2 + 60),
        color(100, 255, 100),
        anchor("center"),
        z(10)
      ]);
    } else if (canBuy) {
      add([
        text("Drücke K zum KAUFEN", { size: 22 }),
        pos(width() / 2, height() / 2 + 60),
        color(100, 255, 100),
        anchor("center"),
        z(10),
        "buy-hint"
      ]);
    } else {
      add([
        text("❌ NICHT GENUG ÄPFEL", { size: 20 }),
        pos(width() / 2, height() / 2 + 60),
        color(255, 100, 100),
        anchor("center"),
        z(10)
      ]);
    }
    
    onKeyPress("k", () => {
      if (!boughtDiamond && currentApples >= diamondPrice) {
        boughtDiamond = true;
        currentApples -= diamondPrice;
        
        destroyAll("buy-hint");
        add([
          text("✓ GEKAUFT! Drücke ENTER...", { size: 22 }),
          pos(width() / 2, height() / 2 + 60),
          color(100, 255, 100),
          anchor("center"),
          z(10)
        ]);
      }
    });
  } else {
    // Münz-Shop mit 3 Items
    // Item 1: Netherite-Schwert
    add([
      rect(350, 180),
      pos(width() / 2 - 400, height() / 2),
      color(60, 60, 100),
      outline(3, currentCoins >= 20 && !boughtNetherite ? rgb(100, 255, 100) : rgb(100, 100, 100)),
      anchor("center"),
      z(5)
    ]);
    
    add([
      text("🔥 NETHERITE-SCHWERT", { size: 20 }),
      pos(width() / 2 - 400, height() / 2 - 60),
      color(200, 50, 50),
      anchor("center"),
      z(10)
    ]);
    
    add([
      text("10 Herzen Schaden!", { size: 16 }),
      pos(width() / 2 - 400, height() / 2 - 25),
      color(200, 200, 200),
      anchor("center"),
      z(10)
    ]);
    
    add([
      text("20 💰", { size: 20 }),
      pos(width() / 2 - 400, height() / 2 + 10),
      color(255, 215, 0),
      anchor("center"),
      z(10)
    ]);
    
    if (boughtNetherite) {
      add([
        text("✓ GEKAUFT", { size: 16 }),
        pos(width() / 2 - 400, height() / 2 + 50),
        color(100, 255, 100),
        anchor("center"),
        z(10)
      ]);
    } else {
      add([
        text(currentCoins >= 20 ? "[1] KAUFEN" : "ZU TEUER", { size: 16 }),
        pos(width() / 2 - 400, height() / 2 + 50),
        color(currentCoins >= 20 ? rgb(100, 255, 100) : rgb(255, 100, 100)),
        anchor("center"),
        z(10),
        "hint1"
      ]);
    }
    
    // Item 2: Goldener Apfel
    add([
      rect(350, 180),
      pos(width() / 2, height() / 2),
      color(60, 60, 100),
      outline(3, currentCoins >= 5 ? rgb(100, 255, 100) : rgb(100, 100, 100)),
      anchor("center"),
      z(5)
    ]);
    
    add([
      text("🍎 GOLDENER APFEL", { size: 20 }),
      pos(width() / 2, height() / 2 - 60),
      color(255, 215, 0),
      anchor("center"),
      z(10)
    ]);
    
    add([
      text("Heilt 2 Herzen", { size: 16 }),
      pos(width() / 2, height() / 2 - 25),
      color(200, 200, 200),
      anchor("center"),
      z(10)
    ]);
    
    add([
      text("5 💰 (mehrfach kaufbar)", { size: 16 }),
      pos(width() / 2, height() / 2 + 10),
      color(255, 215, 0),
      anchor("center"),
      z(10)
    ]);
    
    add([
      text(currentCoins >= 5 ? "[2] KAUFEN" : "ZU TEUER", { size: 16 }),
      pos(width() / 2, height() / 2 + 50),
      color(currentCoins >= 5 ? rgb(100, 255, 100) : rgb(255, 100, 100)),
      anchor("center"),
      z(10),
      "hint2"
    ]);
    
    // Item 3: Eisenrüstung
    add([
      rect(350, 180),
      pos(width() / 2 + 400, height() / 2),
      color(60, 60, 100),
      outline(3, currentCoins >= 20 && !boughtArmor ? rgb(100, 255, 100) : rgb(100, 100, 100)),
      anchor("center"),
      z(5)
    ]);
    
    add([
      text("🛡️ EISENRÜSTUNG", { size: 20 }),
      pos(width() / 2 + 400, height() / 2 - 60),
      color(180, 180, 180),
      anchor("center"),
      z(10)
    ]);
    
    add([
      text("-1 Herz Schaden", { size: 16 }),
      pos(width() / 2 + 400, height() / 2 - 25),
      color(200, 200, 200),
      anchor("center"),
      z(10)
    ]);
    
    add([
      text("20 💰", { size: 20 }),
      pos(width() / 2 + 400, height() / 2 + 10),
      color(255, 215, 0),
      anchor("center"),
      z(10)
    ]);
    
    if (boughtArmor) {
      add([
        text("✓ GEKAUFT", { size: 16 }),
        pos(width() / 2 + 400, height() / 2 + 50),
        color(100, 255, 100),
        anchor("center"),
        z(10)
      ]);
    } else {
      add([
        text(currentCoins >= 20 ? "[3] KAUFEN" : "ZU TEUER", { size: 16 }),
        pos(width() / 2 + 400, height() / 2 + 50),
        color(currentCoins >= 20 ? rgb(100, 255, 100) : rgb(255, 100, 100)),
        anchor("center"),
        z(10),
        "hint3"
      ]);
    }
    
    // Kauf-Logik für Münz-Shop
    onKeyPress("1", () => {
      if (!boughtNetherite && currentCoins >= 20) {
        boughtNetherite = true;
        currentCoins -= 20;
        destroyAll("hint1");
        add([
          text("✓ GEKAUFT!", { size: 16 }),
          pos(width() / 2 - 400, height() / 2 + 50),
          color(100, 255, 100),
          anchor("center"),
          z(10)
        ]);
      }
    });
    
    onKeyPress("2", () => {
      if (currentCoins >= 5) {
        currentCoins -= 5;
        currentApples++;
        destroyAll("hint2");
        add([
          text("✓ GEKAUFT! (mehrfach möglich)", { size: 14 }),
          pos(width() / 2, height() / 2 + 50),
          color(100, 255, 100),
          anchor("center"),
          z(10),
          lifespan(1.5),
          "hint2"
        ]);
      }
    });
    
    onKeyPress("3", () => {
      if (!boughtArmor && currentCoins >= 20) {
        boughtArmor = true;
        currentCoins -= 20;
        destroyAll("hint3");
        add([
          text("✓ GEKAUFT!", { size: 16 }),
          pos(width() / 2 + 400, height() / 2 + 50),
          color(100, 255, 100),
          anchor("center"),
          z(10)
        ]);
      }
    });
  }
  
  // Unten: Weiter zum Level
  add([
    text("Drücke ENTER um zum Level zu gehen", { size: 22 }),
    pos(width() / 2, height() - 40),
    color(200, 200, 200),
    anchor("center"),
    z(10)
  ]);
  
  onKeyPress("enter", () => {
    go("game", {
      level: data.level,
      playerHealth: data.playerHealth,
      goldenApples: currentApples,
      coins: currentCoins,
      hasShield: data.hasShield,
      hasDiamondSword: boughtDiamond,
      hasNetheriteSword: boughtNetherite,
      hasIronArmor: boughtArmor
    });
  });
});

// Haupt-Spiel-Szene
scene("game", (levelData) => {
  // Spielzustand
  const level = levelData?.level || 1;
  const hasShield = levelData?.hasShield || false;
  const hasDiamondSword = levelData?.hasDiamondSword || false;
  const hasNetheriteSword = levelData?.hasNetheriteSword || false;
  const hasIronArmor = levelData?.hasIronArmor || false;
  const hasUpgradedSword = level === 3 && (levelData?.goldenApples || 13) >= 11;
  
  // Schwert-Schaden berechnen (bestes Schwert gewinnt)
  let swordDamage = 2.5; // Normal
  let swordType = "normal";
  if (hasNetheriteSword) {
    swordDamage = 10; // Netherite-Schwert! (STÄRKSTES)
    swordType = "netherite";
  } else if (hasDiamondSword) {
    swordDamage = 6; // Diamantschwert!
    swordType = "diamond";
  } else if (hasUpgradedSword) {
    swordDamage = 4; // Gold-Schwert
    swordType = "gold";
  }
  
  const gameState = {
    playerHealth: levelData?.playerHealth || 10,
    playerMaxHealth: 10,
    goldenApples: levelData?.goldenApples || 13,
    coins: levelData?.coins || 0,
    selectedSlot: 0, // 0 = Schwert, 1 = Äpfel
    zombies: [],
    currentLevel: level,
    swordDamage: swordDamage,
    swordType: swordType,
    hasUpgradedSword: hasUpgradedSword,
    hasShield: hasShield,
    hasDiamondSword: hasDiamondSword,
    hasNetheriteSword: hasNetheriteSword,
    hasIronArmor: hasIronArmor,
    shieldActive: false
  };
  
  // Level-Anzeige oben links
  add([
    text(`Level ${level}`, { size: 32 }),
    pos(20, 20),
    color(255, 255, 255),
    z(100)
  ]);
  
  // Schwert-Upgrade-Nachricht anzeigen
  if (hasUpgradedSword) {
    add([
      text("SCHWERT AUFGEWERTET! ⚔✨", { size: 24 }),
      pos(width() / 2, 80),
      color(255, 215, 0),
      anchor("center"),
      z(100),
      lifespan(3) // Verschwindet nach 3 Sekunden
    ]);
    
    add([
      text("(4 Herzen Schaden!)", { size: 18 }),
      pos(width() / 2, 110),
      color(255, 215, 0),
      anchor("center"),
      z(100),
      lifespan(3)
    ]);
  }
  
  // Boss-Warnung anzeigen
  if (level === 4) {
    add([
      text("⚠️ BOSS-KAMPF! ⚠️", { size: 36 }),
      pos(width() / 2, 80),
      color(255, 50, 50),
      anchor("center"),
      z(100),
      lifespan(4) // Bleibt länger als normale Nachrichten
    ]);
    
    add([
      text("Der Boss ist RIESIG und hat 50 Herzen!", { size: 18 }),
      pos(width() / 2, 120),
      color(255, 100, 100),
      anchor("center"),
      z(100),
      lifespan(4)
    ]);
  }

  // Boden erstellen (Minecraft-Style: Gras und Erde)
  const groundHeight = 80;
  const grassBlockSize = 40;

  // Grasblöcke
  for (let x = 0; x < width(); x += grassBlockSize) {
    // Gras-Oberseite (grün)
    add([
      rect(grassBlockSize, grassBlockSize),
      pos(x, height() - groundHeight),
      color(80, 170, 50),
      area(),
      "ground"
    ]);
    
    // Erde darunter (braun)
    add([
      rect(grassBlockSize, groundHeight - grassBlockSize),
      pos(x, height() - groundHeight + grassBlockSize),
      color(120, 85, 60),
      "ground"
    ]);
  }

  // Spieler erstellen
  const player = add([
    rect(40, 60),
    pos(width() - 100, height() - 140), // Spawn ganz rechts
    color(100, 150, 255), // Blaue Farbe für den Spieler
    area(),
    anchor("center"),
    "player",
    {
      speed: 250,
      isAttacking: false,
      attackCooldown: 0
    }
  ]);

  // Zombies erstellen
  function spawnZombie(xPos, health, damage = 1) {
    const zombie = add([
      rect(40, 60),
      pos(xPos, height() - 140),
      color(50, 150, 50), // Grüne Zombie-Farbe
      area(),
      anchor("center"),
      "zombie",
      {
        health: health,
        maxHealth: health,
        speed: 30,
        attackCooldown: 0,
        isDead: false,
        damage: damage
      }
    ]);
    
    // Zombie-Herzen anzeigen
    const healthBar = add([
      text("", { size: 16 }),
      pos(zombie.pos.x, zombie.pos.y - 40),
      color(255, 0, 0),
      anchor("center"),
      z(10)
    ]);
    
    // Funktion um Herzen-Display zu erstellen (mit halben Herzen)
    function getHealthDisplay(health) {
      const fullHearts = Math.floor(health);
      const halfHeart = (health % 1) >= 0.5 ? "♡" : "";
      return "♥".repeat(fullHearts) + halfHeart;
    }
    
    healthBar.text = getHealthDisplay(zombie.health);
    
    zombie.onUpdate(() => {
      if (zombie.isDead) return;
      
      // Zombie bewegt sich zum Spieler
      if (player.pos.x > zombie.pos.x) {
        zombie.pos.x += zombie.speed * dt();
      } else {
        zombie.pos.x -= zombie.speed * dt();
      }
      
      // Herzen-Anzeige aktualisieren
      healthBar.pos = vec2(zombie.pos.x, zombie.pos.y - 40);
      healthBar.text = getHealthDisplay(zombie.health);
      
      // Angriff-Cooldown verringern
      if (zombie.attackCooldown > 0) {
        zombie.attackCooldown -= dt();
      }
      
      // Zombie greift Spieler an bei Berührung
      if (zombie.isColliding(player) && zombie.attackCooldown <= 0) {
        damagePlayer(zombie.damage); // Benutze den Zombie-Schaden
        zombie.attackCooldown = 1; // 1 Sekunde Cooldown
      }
    });
    
    zombie.onDestroy(() => {
      healthBar.destroy();
    });
    
    gameState.zombies.push(zombie);
    return zombie;
  }

  // Boss-Zombie erstellen (größer und stärker!)
  function spawnBoss(xPos, health) {
    const boss = add([
      rect(80, 120), // DOPPELT so groß!
      pos(xPos, height() - 160),
      color(150, 30, 30), // Dunkelrot für den Boss
      area(),
      anchor("center"),
      "zombie",
      "boss", // Extra Tag für Boss
      {
        health: health,
        maxHealth: health,
        speed: 20, // Langsamer als normale Zombies
        attackCooldown: 0,
        isDead: false,
        isBoss: true
      }
    ]);
    
    // Boss-Herzen anzeigen (größer!)
    const healthBar = add([
      text("", { size: 20 }), // Größere Schrift für Boss
      pos(boss.pos.x, boss.pos.y - 70),
      color(255, 0, 0),
      anchor("center"),
      z(10)
    ]);
    
    // Boss-Name
    const bossName = add([
      text("☠️ BOSS ☠️", { size: 18 }),
      pos(boss.pos.x, boss.pos.y - 95),
      color(255, 50, 50),
      anchor("center"),
      z(10)
    ]);
    
    // Funktion um Herzen-Display zu erstellen
    function getHealthDisplay(health) {
      const fullHearts = Math.floor(health);
      const halfHeart = (health % 1) >= 0.5 ? "♡" : "";
      return "♥".repeat(fullHearts) + halfHeart;
    }
    
    healthBar.text = getHealthDisplay(boss.health);
    
    boss.onUpdate(() => {
      if (boss.isDead) return;
      
      // Boss bewegt sich zum Spieler
      if (player.pos.x > boss.pos.x) {
        boss.pos.x += boss.speed * dt();
      } else {
        boss.pos.x -= boss.speed * dt();
      }
      
      // Herzen-Anzeige und Name aktualisieren
      healthBar.pos = vec2(boss.pos.x, boss.pos.y - 70);
      healthBar.text = getHealthDisplay(boss.health);
      bossName.pos = vec2(boss.pos.x, boss.pos.y - 95);
      
      // Angriff-Cooldown verringern
      if (boss.attackCooldown > 0) {
        boss.attackCooldown -= dt();
      }
      
      // Boss greift Spieler an bei Berührung (macht 2 Herzen Schaden!)
      if (boss.isColliding(player) && boss.attackCooldown <= 0) {
        damagePlayer(2); // Boss macht mehr Schaden!
        boss.attackCooldown = 1.5; // Längerer Cooldown
      }
    });
    
    boss.onDestroy(() => {
      healthBar.destroy();
      bossName.destroy();
    });
    
    gameState.zombies.push(boss);
    return boss;
  }

  // Zombies spawnen basierend auf dem Level
  if (level === 1) {
    // Level 1: 2 Zombies mit je 5 Herzen
    spawnZombie(200, 5);
    spawnZombie(400, 5);
  } else if (level === 2) {
    // Level 2: 5 Zombies mit je 7.5 Herzen
    spawnZombie(150, 7.5);
    spawnZombie(300, 7.5);
    spawnZombie(450, 7.5);
    spawnZombie(600, 7.5);
    spawnZombie(750, 7.5);
  } else if (level === 3) {
    // Level 3: 10 Zombies mit je 10 Herzen
    spawnZombie(100, 10);
    spawnZombie(200, 10);
    spawnZombie(300, 10);
    spawnZombie(400, 10);
    spawnZombie(500, 10);
    spawnZombie(600, 10);
    spawnZombie(700, 10);
    spawnZombie(800, 10);
    spawnZombie(900, 10);
    spawnZombie(1000, 10);
  } else if (level === 4) {
    // Level 4: BOSS-KAMPF!
    spawnBoss(400, 50); // Ein riesiger Boss mit 50 Herzen!
  } else if (level === 5) {
    // Level 5: 2 Super-Zombies mit je 25 Herzen
    spawnZombie(300, 25);
    spawnZombie(700, 25);
  } else if (level === 6) {
    // Level 6: 5 Starke Zombies mit je 40 Herzen und 2 Schaden!
    spawnZombie(200, 40, 2);
    spawnZombie(400, 40, 2);
    spawnZombie(600, 40, 2);
    spawnZombie(800, 40, 2);
    spawnZombie(1000, 40, 2);
  }

  // Schild anzeigen (wenn vorhanden)
  let shieldIndicator = null;
  if (hasShield) {
    shieldIndicator = add([
      text("🛡️", { size: 32 }),
      pos(player.pos.x - 50, player.pos.y),
      color(100, 200, 255),
      anchor("center"),
      z(90),
      opacity(0.5)
    ]);
    
    shieldIndicator.onUpdate(() => {
      shieldIndicator.pos = vec2(player.pos.x - 50, player.pos.y);
      shieldIndicator.opacity = gameState.shieldActive ? 1 : 0.5;
      shieldIndicator.color = gameState.shieldActive ? rgb(100, 255, 255) : rgb(100, 200, 255);
    });
  }
  
  // Schild-Steuerung
  if (hasShield) {
    onKeyDown("shift", () => {
      gameState.shieldActive = true;
    });
    
    onKeyRelease("shift", () => {
      gameState.shieldActive = false;
    });
  }

  // Spieler-Steuerung
  onKeyDown("a", () => {
    player.pos.x -= player.speed * dt();
    // Nicht vom Bildschirm fallen
    if (player.pos.x < 20) player.pos.x = 20;
  });

  onKeyDown("d", () => {
    player.pos.x += player.speed * dt();
    // Nicht vom Bildschirm fallen
    if (player.pos.x > width() - 20) player.pos.x = width() - 20;
  });

  // Angriff mit linker Maustaste
  onMousePress("left", () => {
    if (gameState.selectedSlot === 0 && !player.isAttacking && player.attackCooldown <= 0) {
      // Schild deaktivieren beim Angriff
      if (gameState.shieldActive) {
        gameState.shieldActive = false;
      }
      attackWithSword();
    }
  });

  // Apfel essen mit rechter Maustaste
  onMousePress("right", () => {
    if (gameState.selectedSlot === 1) {
      eatGoldenApple();
    }
  });

  // Inventar-Auswahl mit Zahlen 1-8
  onKeyPress("1", () => { gameState.selectedSlot = 0; });
  onKeyPress("2", () => { gameState.selectedSlot = 1; });

  // Schwert-Angriff
  function attackWithSword() {
    player.isAttacking = true;
    player.attackCooldown = 0.5; // 0.5 Sekunden Cooldown
    
    // Angriffs-Animation (größere rote Fläche links vom Spieler)
    const attackRange = add([
      rect(100, 80), // Größerer Angriff!
      pos(player.pos.x - 70, player.pos.y), // Links vom Spieler
      color(255, 100, 100),
      opacity(0.5),
      area(),
      anchor("center"),
      "attack",
      lifespan(0.3) // Bleibt etwas länger sichtbar
    ]);
    
    // Warte kurz damit die Kollision sicher erkannt wird
    wait(0.05, () => {
      // Prüfen, ob Zombies getroffen wurden
      for (const zombie of gameState.zombies) {
        if (!zombie.isDead && zombie.exists() && attackRange.exists() && attackRange.isColliding(zombie)) {
          damageZombie(zombie, gameState.swordDamage); // Verwendet den Schwert-Schaden (2.5 oder 4)
        }
      }
    });
    
    setTimeout(() => {
      player.isAttacking = false;
    }, 300);
  }

  // Zombie Schaden zufügen
  function damageZombie(zombie, damage) {
    zombie.health -= damage;
    
    // Zombie-Treffer-Animation (kurz rot aufblinken)
    zombie.color = rgb(255, 100, 100);
    setTimeout(() => {
      if (!zombie.isDead) {
        zombie.color = rgb(50, 150, 50);
      }
    }, 100);
    
    if (zombie.health <= 0 && !zombie.isDead) {
      zombie.isDead = true;
      zombie.destroy();
      gameState.zombies = gameState.zombies.filter(z => z !== zombie);
      
      // Prüfen ob alle Zombies tot sind
      if (gameState.zombies.length === 0) {
        go("victory", {
          playerHealth: gameState.playerHealth,
          goldenApples: gameState.goldenApples,
          coins: gameState.coins,
          currentLevel: gameState.currentLevel,
          hasShield: gameState.hasShield,
          hasDiamondSword: gameState.hasDiamondSword,
          hasNetheriteSword: gameState.hasNetheriteSword,
          hasIronArmor: gameState.hasIronArmor
        });
      }
    }
  }

  // Spieler Schaden zufügen
  function damagePlayer(damage) {
    // Kein Schaden wenn Schild aktiv ist!
    if (gameState.shieldActive) {
      // Schild-Block-Animation (blau aufleuchten)
      player.color = rgb(100, 255, 255);
      setTimeout(() => {
        player.color = rgb(100, 150, 255);
      }, 100);
      return; // Kein Schaden!
    }
    
    // Rüstung reduziert Schaden um 1 (mindestens 0.5 Schaden)
    let actualDamage = damage;
    if (gameState.hasIronArmor) {
      actualDamage = Math.max(0.5, damage - 1);
    }
    
    gameState.playerHealth -= actualDamage;
    
    // Spieler-Treffer-Animation
    player.color = rgb(255, 100, 100);
    setTimeout(() => {
      player.color = rgb(100, 150, 255);
    }, 100);
    
    if (gameState.playerHealth <= 0) {
      go("gameover");
    }
  }

  // Goldenen Apfel essen
  function eatGoldenApple() {
    if (gameState.goldenApples > 0 && gameState.playerHealth < gameState.playerMaxHealth) {
      gameState.goldenApples--;
      gameState.playerHealth = Math.min(gameState.playerMaxHealth, gameState.playerHealth + 2);
      
      // Heilungs-Animation (grün aufblinken)
      player.color = rgb(100, 255, 100);
      setTimeout(() => {
        player.color = rgb(100, 150, 255);
      }, 200);
    }
  }

  // Spieler Cooldown aktualisieren
  player.onUpdate(() => {
    if (player.attackCooldown > 0) {
      player.attackCooldown -= dt();
    }
  });

  // Herzen oben rechts anzeigen
  const heartsDisplay = add([
    text("", { size: 24 }),
    pos(width() - 20, 20),
    color(255, 0, 0),
    anchor("topright"),
    z(100)
  ]);

  heartsDisplay.onUpdate(() => {
    const fullHearts = Math.floor(gameState.playerHealth);
    const halfHeart = (gameState.playerHealth % 1) >= 0.5 ? "♡" : "";
    heartsDisplay.text = "♥".repeat(fullHearts) + halfHeart;
  });

  // Inventar anzeigen
  const inventoryBg = add([
    rect(400, 60),
    pos(width() / 2, height() - 30),
    color(50, 50, 50),
    anchor("center"),
    z(50)
  ]);

  // Inventar-Slots (8 Felder)
  for (let i = 0; i < 8; i++) {
    const slotX = width() / 2 - 160 + i * 50;
    const slotY = height() - 30;
    
    // Slot-Hintergrund
    add([
      rect(40, 40),
      pos(slotX, slotY),
      color(100, 100, 100),
      outline(2, i === 0 ? rgb(255, 255, 255) : rgb(150, 150, 150)),
      anchor("center"),
      z(51),
      "slot" + i
    ]);
  }

  // Schwert im ersten Slot (Farbe basierend auf Typ)
  let swordColor = rgb(200, 200, 200); // Normal (grau)
  let swordIcon = "⚔";
  let swordEffect = null;
  
  if (hasNetheriteSword) {
    swordColor = rgb(200, 50, 50); // Netherite (dunkelrot)
    swordEffect = "🔥";
  } else if (hasDiamondSword) {
    swordColor = rgb(100, 200, 255); // Diamant (cyan)
    swordEffect = "💎";
  } else if (hasUpgradedSword) {
    swordColor = rgb(255, 215, 0); // Gold
    swordEffect = "✨";
  }
  
  add([
    text(swordIcon, { size: 24 }),
    pos(width() / 2 - 160, height() - 30),
    color(swordColor),
    anchor("center"),
    z(52)
  ]);
  
  // Zeige Effekt bei besonderem Schwert
  if (swordEffect) {
    add([
      text(swordEffect, { size: 14 }),
      pos(width() / 2 - 140, height() - 40),
      color(255, 255, 255),
      anchor("center"),
      z(53)
    ]);
  }

  // Goldene Äpfel im zweiten Slot
  add([
    text("🍎", { size: 20 }),
    pos(width() / 2 - 110, height() - 30),
    color(255, 215, 0),
    anchor("center"),
    z(52)
  ]);

  const appleCount = add([
    text("13", { size: 14 }),
    pos(width() / 2 - 100, height() - 15),
    color(255, 255, 255),
    anchor("center"),
    z(52)
  ]);

  appleCount.onUpdate(() => {
    appleCount.text = gameState.goldenApples.toString();
  });

  // Ausgewählten Slot aktualisieren
  onUpdate(() => {
    // Alle Slots zurücksetzen
    for (let i = 0; i < 8; i++) {
      const slots = get("slot" + i);
      for (const slot of slots) {
        if (i === gameState.selectedSlot) {
          slot.outline.color = rgb(255, 255, 255);
          slot.outline.width = 3;
        } else {
          slot.outline.color = rgb(150, 150, 150);
          slot.outline.width = 2;
        }
      }
    }
  });
});

// Starte das Spiel mit Level 1
go("game", { level: 1 });