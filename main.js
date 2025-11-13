// Kaboom is loaded via script tag in index.html
kaboom({
  canvas: document.querySelector("#game"),
  background: [135, 206, 235], // Himmelblau
  scale: 1.5,
});

// Schwerkraft aktivieren (wie Minecraft) - Stark reduziert für stabile Kollision
setGravity(800);

// ====== SPIELER-DATEN ======
let playerSpawned = false;
let inventoryOpen = false;
let hearts = 10;
let maxHearts = 10;
let player = null;
let lookingDown = false; // Q gedrückt = nach unten schauen
let facingRight = true; // Blickrichtung
let fallStartY = 0; // Für Fall-Schaden

// Inventar System mit 8 Slots (Hotbar)
let inventory = [
  { item: "sword", count: 1 }, // Slot 1: Steinschwert
  { item: "apple", count: 10 }, // Slot 2: 10 Äpfel
  null, // Slot 3: Leer
  null, // Slot 4: Leer
  null, // Slot 5: Leer
  null, // Slot 6: Leer
  null, // Slot 7: Leer
  null, // Slot 8: Leer
];
let selectedSlot = 0;

// ====== BLOCK-GRÖSSE (WIE MINECRAFT) ======
const BLOCK_SIZE = 32;

// ====== WELT ERSTELLEN (MINECRAFT-STYLE) ======
const worldWidth = 100; // 100 Blöcke breit
const worldHeight = 30; // 30 Blöcke hoch
const spawnX = 50; // Spawn-Position X

// Terrain generieren
let spawnGroundY = worldHeight * 0.7; // Default

for (let x = 0; x < worldWidth; x++) {
  // Boden-Höhe variieren (Hügel-Effekt)
  const groundHeight = Math.floor(worldHeight * 0.7 + Math.sin(x * 0.1) * 3);
  
  // Spawn-Position Bodenhöhe speichern
  if (x === spawnX) {
    spawnGroundY = groundHeight;
  }
  
  for (let y = groundHeight; y < worldHeight; y++) {
    let blockType = "dirt";
    let blockColor = rgb(139, 90, 43); // Braun (Erde)
    
    // Oberste Schicht = Gras
    if (y === groundHeight) {
      blockType = "grass";
      blockColor = rgb(34, 139, 34); // Grün
    }
    // Untere Schichten = Stein
    else if (y > worldHeight - 5) {
      blockType = "stone";
      blockColor = rgb(128, 128, 128); // Grau
    }
    
    // Block erstellen - MIT SOLIDER KOLLISION
    add([
      rect(BLOCK_SIZE, BLOCK_SIZE),
      pos(x * BLOCK_SIZE, y * BLOCK_SIZE),
      color(blockColor),
      outline(1, rgb(0, 0, 0)),
      area(),
      body({ isStatic: true }),
      z(0),
      blockType,
      "terrain_block",
      "solid", // WICHTIG: Solid Tag für Kollision
      { blockName: blockType }
    ]);
  }
  
  // Zufällig Bäume spawnen (nicht am Spawn-Punkt)
  if (Math.random() > 0.92 && x > 5 && x < worldWidth - 5 && Math.abs(x - spawnX) > 3) {
    const treeHeight = 4;
    const treeX = x * BLOCK_SIZE;
    const treeY = (groundHeight - treeHeight) * BLOCK_SIZE;
    
    // Baumstamm
    for (let i = 0; i < treeHeight; i++) {
      add([
        rect(BLOCK_SIZE, BLOCK_SIZE),
        pos(treeX, treeY + i * BLOCK_SIZE),
        color(101, 67, 33), // Braun
        outline(1, rgb(0, 0, 0)),
        area(),
        body({ isStatic: true }),
        z(0),
        "tree",
        "breakable",
        "solid", // Solid für Kollision
        { blockName: "wood" }
      ]);
    }
    
    // Blätter (Krone) - KEINE Kollision, man kann durchlaufen
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -2; dy <= -1; dy++) {
        add([
          rect(BLOCK_SIZE, BLOCK_SIZE),
          pos(treeX + dx * BLOCK_SIZE, treeY + dy * BLOCK_SIZE),
          color(34, 139, 34), // Grün
          outline(1, rgb(0, 0, 0)),
          z(0),
          "leaves",
          "breakable",
          { blockName: "leaves" }
        ]);
      }
    }
  }
}

// Dorf-Häuser
function createMinecraftHouse(blockX, blockY) {
  const houseWidth = 6;
  const houseHeight = 5;
  
  // Wände
  for (let x = 0; x < houseWidth; x++) {
    for (let y = 0; y < houseHeight; y++) {
      // Tür-Öffnung
      if ((x === 2 || x === 3) && y === houseHeight - 1) continue;
      // Fenster
      if ((x === 1 || x === 4) && y === 2) continue;
      
      add([
        rect(BLOCK_SIZE, BLOCK_SIZE),
        pos((blockX + x) * BLOCK_SIZE, (blockY + y) * BLOCK_SIZE),
        color(139, 90, 43), // Holz-Braun
        outline(1, rgb(0, 0, 0)),
        area(),
        body({ isStatic: true }),
        z(0),
        "house_wall",
        "solid" // Solid für Kollision
      ]);
    }
  }
  
  // Dach
  for (let x = -1; x < houseWidth + 1; x++) {
    add([
      rect(BLOCK_SIZE, BLOCK_SIZE),
      pos((blockX + x) * BLOCK_SIZE, (blockY - 1) * BLOCK_SIZE),
      color(150, 75, 0), // Dunkles Braun
      outline(1, rgb(0, 0, 0)),
      area(),
      body({ isStatic: true }),
      z(0),
      "house_roof",
      "solid" // Solid für Kollision
    ]);
  }
}

// Häuser im Dorf platzieren
createMinecraftHouse(15, 14);
createMinecraftHouse(25, 13);
createMinecraftHouse(70, 15);

// ====== TIERE SPAWNEN (KÜHE UND SCHWEINE) ======
function spawnAnimal(type, x, groundY) {
  const animalColor = type === "cow" ? rgb(80, 50, 30) : rgb(255, 192, 203); // Braun oder Rosa
  const animalSize = BLOCK_SIZE * 1.2;
  
  const animal = add([
    rect(animalSize, animalSize * 0.8),
    pos(x * BLOCK_SIZE, (groundY - 1.5) * BLOCK_SIZE),
    color(animalColor),
    outline(2, rgb(0, 0, 0)),
    area(),
    body(),
    anchor("botleft"),
    z(5),
    type === "cow" ? "cow" : "pig",
    "animal",
    {
      walkSpeed: 30,
      direction: choose([1, -1]),
    }
  ]);
  
  // Kopf
  animal.add([
    rect(animalSize * 0.5, animalSize * 0.5),
    pos(type === "cow" ? 0 : animalSize * 0.6, -animalSize * 0.6),
    color(animalColor),
    outline(2, rgb(0, 0, 0)),
  ]);
  
  // Einfache KI - Hin und her laufen
  animal.onUpdate(() => {
    animal.move(animal.walkSpeed * animal.direction, 0);
    
    // Richtung zufällig ändern
    if (Math.random() < 0.01) {
      animal.direction *= -1;
    }
  });
}

// Tiere spawnen
for (let i = 0; i < 10; i++) {
  const x = Math.floor(Math.random() * (worldWidth - 10)) + 5;
  const groundY = Math.floor(worldHeight * 0.7 + Math.sin(x * 0.1) * 3);
  const animalType = Math.random() > 0.5 ? "cow" : "pig";
  spawnAnimal(animalType, x, groundY);
}

// ====== SPAWNING TEXT ======
const spawnText = add([
  text("Spawning in 3 seconds...", { size: 32 }),
  pos(center()),
  anchor("center"),
  color(255, 255, 255),
  z(1000),
  fixed(),
]);

// ====== HERZ-ANZEIGE (UI) - MINECRAFT STYLE ======
function updateHearts() {
  destroyAll("heart_ui");
  
  for (let i = 0; i < maxHearts; i++) {
    const heartX = 10 + i * 25;
    const heartY = 10;
    
    if (i < hearts) {
      add([
        text("♥", { size: 28 }),
        pos(heartX, heartY),
        color(255, 0, 0),
        z(1000),
        fixed(),
        "heart_ui"
      ]);
    } else {
      add([
        text("♡", { size: 28 }),
        pos(heartX, heartY),
        color(100, 0, 0),
        z(1000),
        fixed(),
        "heart_ui"
      ]);
    }
  }
}

updateHearts();

// ====== HOTBAR (8 FELDER UNTEN) ======
const hotbarY = height() - 70;
const slotSize = 50;
const hotbarStartX = width() / 2 - (slotSize * 8) / 2;

// Hotbar Hintergrund zeichnen
for (let i = 0; i < 8; i++) {
  const slotX = hotbarStartX + i * (slotSize + 5);
  
  add([
    rect(slotSize, slotSize),
    pos(slotX, hotbarY),
    color(80, 80, 80),
    outline(2, rgb(255, 255, 255)),
    z(999),
    fixed(),
    "hotbar_slot"
  ]);
}

// Block-Icons für Inventar
function getBlockIcon(blockName) {
  if (blockName === "wood") return "🪵";
  if (blockName === "leaves") return "🍃";
  if (blockName === "dirt") return "🟫";
  if (blockName === "stone") return "🗿";
  if (blockName === "grass") return "🟩";
  if (blockName === "sword") return "⚔";
  if (blockName === "apple") return "🍎";
  return "?";
}

// Hotbar Update-Funktion
function updateHotbar() {
  destroyAll("hotbar_icon");
  destroyAll("hotbar_count");
  
  for (let i = 0; i < 8; i++) {
    const slotX = hotbarStartX + i * (slotSize + 5);
    const slot = inventory[i];
    
    if (slot) {
      const icon = getBlockIcon(slot.item);
      
      add([
        text(icon, { size: 30 }),
        pos(slotX + 8, hotbarY + 5),
        z(1000),
        fixed(),
        "hotbar_icon"
      ]);
      
      if (slot.count > 1) {
        add([
          text(slot.count.toString(), { size: 14 }),
          pos(slotX + 35, hotbarY + 35),
          color(255, 255, 255),
          z(1000),
          fixed(),
          "hotbar_count"
        ]);
      }
    }
  }
}

updateHotbar();

// Ausgewählter Slot Indikator
const selectedIndicator = add([
  rect(slotSize + 4, slotSize + 4),
  pos(hotbarStartX - 2, hotbarY - 2),
  outline(3, rgb(255, 255, 0)),
  z(998),
  fixed(),
  "selected_indicator"
]);

// Item ins Inventar hinzufügen
function addToInventory(itemName) {
  // Prüfen ob Item schon vorhanden ist
  for (let i = 0; i < 8; i++) {
    if (inventory[i] && inventory[i].item === itemName) {
      inventory[i].count++;
      updateHotbar();
      return;
    }
  }
  
  // Neuen Slot finden
  for (let i = 0; i < 8; i++) {
    if (!inventory[i]) {
      inventory[i] = { item: itemName, count: 1 };
      updateHotbar();
      return;
    }
  }
}

// ====== SPIELER NACH 3 SEKUNDEN SPAWNEN ======
wait(3, () => {
  destroy(spawnText);
  
  // WICHTIG: Boden-Block an Spawn-Position finden
  const groundBlocks = get("terrain_block").filter(block => {
    return Math.abs(block.pos.x - spawnX * BLOCK_SIZE) < BLOCK_SIZE / 2 &&
           block.is("grass");
  });
  
  let spawnYPos = (spawnGroundY - 2) * BLOCK_SIZE;
  
  // Wenn Boden gefunden, direkt drauf spawnen
  if (groundBlocks.length > 0) {
    const groundBlock = groundBlocks[0];
    spawnYPos = groundBlock.pos.y - BLOCK_SIZE * 1.8; // Direkt auf dem Block
  }
  
  // Minecraft-Style Spielfigur erstellen - MIT FESTEN BODEN-KONTAKT
  player = add([
    rect(BLOCK_SIZE - 4, BLOCK_SIZE * 1.8), // Breiter für bessere Kollision
    pos(spawnX * BLOCK_SIZE, spawnYPos + BLOCK_SIZE * 1.8), // Position angepasst
    color(0, 150, 200),
    anchor("bot"), // bot ist stabiler für Plattformer
    area({
      scale: 0.7, // Noch kleinere Hitbox
    }),
    body({
      jumpForce: 500, // Reduziert wegen niedrigerer Schwerkraft
      maxVelocity: 400, // Stark reduziert
      stickToPlatform: true, // Bleibt auf Plattformen
      mass: 2, // Schwerer = stabiler
    }),
    z(10),
    "player",
  ]);
  
  // Kopf des Spielers (oben auf dem Körper)
  player.add([
    rect(BLOCK_SIZE - 6, BLOCK_SIZE - 6),
    pos(-2, -BLOCK_SIZE - 5),
    color(222, 184, 135), // Hautfarbe
    outline(2),
  ]);
  
  // Linker Arm
  player.add([
    rect(8, BLOCK_SIZE * 0.7),
    pos(-10, -BLOCK_SIZE * 1.3),
    color(0, 150, 200),
    outline(1),
  ]);
  
  // Rechter Arm
  player.add([
    rect(8, BLOCK_SIZE * 0.7),
    pos(BLOCK_SIZE - 6, -BLOCK_SIZE * 1.3),
    color(0, 150, 200),
    outline(1),
  ]);
  
  playerSpawned = true;
  fallStartY = player.pos.y;
  
  // KAMERA FOLGT DEM SPIELER
  player.onUpdate(() => {
    // Augenhöhe = Spieler-Position - Augenhöhe
    let camY = player.pos.y - BLOCK_SIZE * 0.9;
    
    // Nach unten schauen (Q gedrückt)
    if (lookingDown) {
      camY = player.pos.y + BLOCK_SIZE * 2;
    }
    
    camPos(player.pos.x, camY);
    
    // ===== VOID CHECK: Zu tief gefallen? RESPAWN! =====
    const voidLevel = worldHeight * BLOCK_SIZE + BLOCK_SIZE * 5; // 5 Blöcke unter der Welt
    
    if (player.pos.y > voidLevel) {
      // RESPAWN AM SPAWN-PUNKT, 3 BLÖCKE HÖHER!
      player.pos.x = spawnX * BLOCK_SIZE;
      player.pos.y = (spawnYPos + BLOCK_SIZE * 1.8) - BLOCK_SIZE * 3; // 3 Blöcke über Spawn
      fallStartY = player.pos.y;
      
      // Schaden beim Respawn
      hearts = Math.max(1, hearts - 2); // -2 Herzen, mindestens 1 bleibt
      updateHearts();
      
      // Respawn Nachricht
      const respawnText = add([
        text("RESPAWN! -2 ♥", { size: 40 }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(255, 50, 50),
        z(2000),
        fixed(),
      ]);
      
      wait(1.5, () => {
        if (respawnText.exists()) destroy(respawnText);
      });
      
      return; // Andere Checks überspringen
    }
    
    // Fall-Schaden prüfen
    if (player.isGrounded()) {
      const fallDistance = fallStartY - player.pos.y;
      const blocksFallen = fallDistance / BLOCK_SIZE;
      
      if (blocksFallen > 4) {
        // Schaden berechnen: 1 Herz pro 4 Blöcke
        const damage = Math.floor((blocksFallen - 4) / 4) + 1;
        hearts = Math.max(0, hearts - damage);
        updateHearts();
        
        // Fall-Schaden Feedback
        const damageText = add([
          text(`-${damage} ♥`, { size: 40 }),
          pos(width() / 2, height() / 2),
          anchor("center"),
          color(255, 50, 50),
          z(2000),
          fixed(),
        ]);
        
        wait(1, () => {
          if (damageText.exists()) destroy(damageText);
        });
      }
      
      fallStartY = player.pos.y;
    } else {
      // Spieler fällt, aktualisiere Start-Y nur wenn höher
      if (player.pos.y < fallStartY) {
        fallStartY = player.pos.y;
      }
    }
  });
});

// ====== SPIELER BEWEGUNG - MINECRAFT-STYLE ======
const SPEED = 120; // Noch weiter verringert für sichere Kollision
const JUMP_FORCE = 500; // Angepasst an niedrigere Schwerkraft

onKeyDown("w", () => {
  if (player && !inventoryOpen) {
    player.move(SPEED, 0);
    facingRight = true;
  }
});

onKeyDown("s", () => {
  if (player && !inventoryOpen) {
    player.move(-SPEED, 0);
    facingRight = false;
  }
});

onKeyDown("a", () => {
  if (player && !inventoryOpen) {
    player.move(-SPEED, 0);
    facingRight = false;
  }
});

onKeyDown("d", () => {
  if (player && !inventoryOpen) {
    player.move(SPEED, 0);
    facingRight = true;
  }
});

// SPACE = SPRINGEN - mit kleiner Verzögerung für bessere Kollision
onKeyPress("space", () => {
  if (player && !inventoryOpen) {
    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
    }
  }
});

// Q = NACH UNTEN SCHAUEN
onKeyPress("q", () => {
  lookingDown = !lookingDown;
});

// ====== MAUSRAD ZUM SLOT WECHSELN ======
onScroll((delta) => {
  if (inventoryOpen) return;
  
  if (delta.y > 0) {
    selectedSlot = (selectedSlot + 1) % 8;
  } else if (delta.y < 0) {
    selectedSlot = (selectedSlot - 1 + 8) % 8;
  }
  
  selectedIndicator.pos.x = hotbarStartX + selectedSlot * (slotSize + 5) - 2;
});

// ====== INVENTAR MIT E ÖFFNEN ======
onKeyPress("e", () => {
  if (!playerSpawned) return;
  
  inventoryOpen = !inventoryOpen;
  
  if (inventoryOpen) {
    add([
      rect(width(), height()),
      pos(0, 0),
      color(0, 0, 0),
      opacity(0.8),
      z(2000),
      fixed(),
      "inventory_ui"
    ]);
    
    add([
      text("INVENTAR (Drücke E zum Schließen)", { size: 28 }),
      pos(width() / 2, 50),
      anchor("center"),
      color(255, 255, 255),
      z(2001),
      fixed(),
      "inventory_ui"
    ]);
    
    const invStartX = width() / 2 - (slotSize * 4 + 15);
    const invStartY = height() / 2 - 50;
    
    for (let i = 0; i < 8; i++) {
      const row = Math.floor(i / 4);
      const col = i % 4;
      const slotX = invStartX + col * (slotSize + 10);
      const slotY = invStartY + row * (slotSize + 10);
      
      add([
        rect(slotSize, slotSize),
        pos(slotX, slotY),
        color(60, 60, 60),
        outline(2, rgb(200, 200, 200)),
        z(2001),
        fixed(),
        "inventory_ui"
      ]);
      
      add([
        text((i + 1).toString(), { size: 16 }),
        pos(slotX + 5, slotY + 5),
        color(150, 150, 150),
        z(2002),
        fixed(),
        "inventory_ui"
      ]);
      
      const slot = inventory[i];
      if (slot) {
        const icon = getBlockIcon(slot.item);
        
        add([
          text(icon, { size: 30 }),
          pos(slotX + 10, slotY + 15),
          z(2002),
          fixed(),
          "inventory_ui"
        ]);
        
        add([
          text(`x${slot.count}`, { size: 14 }),
          pos(slotX + 30, slotY + 35),
          color(255, 255, 255),
          z(2002),
          fixed(),
          "inventory_ui"
        ]);
      }
    }
  } else {
    destroyAll("inventory_ui");
  }
});

// ====== LINKSKLICK: BLÖCKE ABBAUEN ODER PLATZIEREN ======
let canAttack = true;
let attackCooldown = 0.3;

onMousePress("left", () => {
  if (!playerSpawned || inventoryOpen || !canAttack || !player) return;
  
  const currentSlot = inventory[selectedSlot];
  const attackRange = 80;
  
  // Prüfen ob wir einen Block platzieren können
  const canPlaceBlock = currentSlot && 
    (currentSlot.item === "wood" || currentSlot.item === "dirt" || 
     currentSlot.item === "stone" || currentSlot.item === "grass");
  
  if (canPlaceBlock) {
    // BLOCK PLATZIEREN
    let placeX = player.pos.x + (facingRight ? attackRange : -attackRange);
    let placeY = player.pos.y;
    
    // Nach unten schauen und springen = Block unter sich platzieren
    if (lookingDown && !player.isGrounded()) {
      placeX = player.pos.x;
      placeY = player.pos.y + BLOCK_SIZE * 1.5;
    }
    // Nach unten schauen = Block direkt unter Füßen
    else if (lookingDown) {
      placeX = player.pos.x;
      placeY = player.pos.y + BLOCK_SIZE;
    }
    
    // Auf Grid snappen
    const gridX = Math.round(placeX / BLOCK_SIZE) * BLOCK_SIZE;
    const gridY = Math.round(placeY / BLOCK_SIZE) * BLOCK_SIZE;
    
    // Prüfen ob Platz frei ist
    const blocksAtPos = get("*", { pos: vec2(gridX, gridY) }).filter(obj => 
      obj.is("terrain_block") || obj.is("breakable") || obj.is("placed_block")
    );
    
    if (blocksAtPos.length === 0) {
      // Block platzieren!
      let blockColor = rgb(139, 90, 43);
      if (currentSlot.item === "wood") blockColor = rgb(101, 67, 33);
      if (currentSlot.item === "stone") blockColor = rgb(128, 128, 128);
      if (currentSlot.item === "grass") blockColor = rgb(34, 139, 34);
      
      add([
        rect(BLOCK_SIZE, BLOCK_SIZE),
        pos(gridX, gridY),
        color(blockColor),
        outline(1, rgb(0, 0, 0)),
        area(),
        body({ isStatic: true }),
        z(0),
        "placed_block",
        "breakable",
        "solid", // Solid für Kollision
        { blockName: currentSlot.item }
      ]);
      
      // Item aus Inventar entfernen
      currentSlot.count--;
      if (currentSlot.count === 0) {
        inventory[selectedSlot] = null;
      }
      updateHotbar();
    }
  } else {
    // BLOCK ABBAUEN
    const attackX = player.pos.x + (facingRight ? attackRange : -attackRange);
    const attackY = player.pos.y - BLOCK_SIZE;
    
    const blocksInRange = get("breakable");
    let blockDestroyed = false;
    
    for (const block of blocksInRange) {
      const distance = Math.sqrt(
        Math.pow(block.pos.x - attackX, 2) + 
        Math.pow(block.pos.y - attackY, 2)
      );
      
      if (distance < attackRange) {
        const blockName = block.blockName;
        
        // Block zerstören
        destroy(block);
        blockDestroyed = true;
        
        // Item ins Inventar
        addToInventory(blockName);
        
        // Partikel
        for (let i = 0; i < 8; i++) {
          const particle = add([
            rect(6, 6),
            pos(block.pos.x + Math.random() * BLOCK_SIZE, block.pos.y + Math.random() * BLOCK_SIZE),
            color(101, 67, 33),
            opacity(1),
            z(14),
            "break_particle"
          ]);
          
          wait(0.5, () => {
            if (particle.exists()) destroy(particle);
          });
        }
        
        break;
      }
    }
    
    // Schlag-Effekt
    if (!blockDestroyed) {
      const attackEffect = add([
        rect(50, 8),
        pos(attackX, attackY),
        color(255, 255, 150),
        z(15),
        opacity(0.8),
      ]);
      
      wait(0.15, () => {
        if (attackEffect.exists()) destroy(attackEffect);
      });
    }
  }
  
  canAttack = false;
  wait(attackCooldown, () => {
    canAttack = true;
  });
});

// ====== RECHTSKLICK ZUM APFEL ESSEN ======
onMousePress("right", () => {
  if (!playerSpawned || inventoryOpen) return;
  
  const currentSlot = inventory[selectedSlot];
  
  if (currentSlot && currentSlot.item === "apple" && currentSlot.count > 0) {
    currentSlot.count--;
    hearts = Math.min(hearts + 2, maxHearts);
    
    if (currentSlot.count === 0) {
      inventory[selectedSlot] = null;
    }
    
    updateHotbar();
    updateHearts();
    
    const eatText = add([
      text("+2 ♥", { size: 40 }),
      pos(width() / 2, height() / 2 - 100),
      anchor("center"),
      color(255, 100, 100),
      z(2000),
      fixed(),
    ]);
    
    wait(1, () => {
      if (eatText.exists()) destroy(eatText);
    });
  }
});

// ====== SLOT-AUSWAHL MIT ZAHLEN 1-8 ======
for (let i = 1; i <= 8; i++) {
  onKeyPress(i.toString(), () => {
    selectedSlot = i - 1;
    selectedIndicator.pos.x = hotbarStartX + selectedSlot * (slotSize + 5) - 2;
  });
}

// ====== INFO TEXT ======
add([
  text("W/D = Vor/Zurück | SPACE = Springen | Q = Runter schauen | E = Inventar | Mausrad = Slot | Links = Abbauen/Bauen", { size: 9 }),
  pos(width() / 2, height() - 10),
  anchor("center"),
  color(255, 255, 255),
  z(1000),
  fixed(),
]);
