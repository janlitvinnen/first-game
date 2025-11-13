// Kaboom is loaded via script tag in index.html
kaboom({
  canvas: document.querySelector("#game"),
  background: [135, 206, 235], // Himmelblau
  scale: 1.5,
});

// Schwerkraft aktivieren (wie Minecraft)
setGravity(1600);

// ====== SPIELER-DATEN ======
let playerSpawned = false;
let inventoryOpen = false;
let hearts = 10;
let maxHearts = 10;
let player = null;

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
    
    // Block erstellen
    add([
      rect(BLOCK_SIZE, BLOCK_SIZE),
      pos(x * BLOCK_SIZE, y * BLOCK_SIZE),
      color(blockColor),
      outline(1, rgb(0, 0, 0)),
      area(),
      body({ isStatic: true }),
      blockType,
      "block"
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
        "tree"
      ]);
    }
    
    // Blätter (Krone)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -2; dy <= -1; dy++) {
        add([
          rect(BLOCK_SIZE, BLOCK_SIZE),
          pos(treeX + dx * BLOCK_SIZE, treeY + dy * BLOCK_SIZE),
          color(34, 139, 34), // Grün
          outline(1, rgb(0, 0, 0)),
          "leaves"
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
        "house_wall"
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
      "house_roof"
    ]);
  }
}

// Häuser im Dorf platzieren
createMinecraftHouse(15, 14);
createMinecraftHouse(25, 13);
createMinecraftHouse(70, 15);

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
// Herzen werden individuell gezeichnet für bessere Sichtbarkeit
function updateHearts() {
  destroyAll("heart_ui");
  
  for (let i = 0; i < maxHearts; i++) {
    const heartX = 10 + i * 25; // Nebeneinander wie in Minecraft
    const heartY = 10;
    
    if (i < hearts) {
      // Volles Herz (rot)
      add([
        text("♥", { size: 28 }),
        pos(heartX, heartY),
        color(255, 0, 0),
        z(1000),
        fixed(),
        "heart_ui"
      ]);
    } else {
      // Leeres Herz (grau/schwarz outline)
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

// Initial Herzen zeichnen
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

// Hotbar Update-Funktion
function updateHotbar() {
  destroyAll("hotbar_icon");
  destroyAll("hotbar_count");
  
  for (let i = 0; i < 8; i++) {
    const slotX = hotbarStartX + i * (slotSize + 5);
    const slot = inventory[i];
    
    if (slot && slot.item === "sword") {
      add([
        text("⚔", { size: 30 }),
        pos(slotX + 10, hotbarY + 5),
        color(180, 180, 180),
        z(1000),
        fixed(),
        "hotbar_icon"
      ]);
      
      add([
        text("1", { size: 14 }),
        pos(slotX + 35, hotbarY + 35),
        color(255, 255, 255),
        z(1000),
        fixed(),
        "hotbar_count"
      ]);
    } else if (slot && slot.item === "apple") {
      add([
        text("🍎", { size: 30 }),
        pos(slotX + 8, hotbarY + 5),
        z(1000),
        fixed(),
        "hotbar_icon"
      ]);
      
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

// ====== SPIELER NACH 3 SEKUNDEN SPAWNEN ======
wait(3, () => {
  destroy(spawnText);
  
  // Minecraft-Style Spielfigur erstellen - AUF DEM BODEN SPAWNEN!
  player = add([
    rect(BLOCK_SIZE - 8, BLOCK_SIZE * 1.8), // Körper
    pos(spawnX * BLOCK_SIZE, (spawnGroundY - 2) * BLOCK_SIZE), // AUF DEM BODEN!
    color(0, 150, 200), // Blau (wie Steve)
    anchor("botleft"),
    area(),
    body(),
    z(10),
    "player",
  ]);
  
  // Kopf des Spielers
  player.add([
    rect(BLOCK_SIZE - 10, BLOCK_SIZE - 10),
    pos(7, -BLOCK_SIZE * 1.8 - 12),
    color(222, 184, 135), // Hautfarbe
    outline(2),
  ]);
  
  // Arme
  player.add([
    rect(6, BLOCK_SIZE * 0.6),
    pos(-2, -BLOCK_SIZE * 1.3),
    color(0, 150, 200),
    outline(1),
  ]);
  
  player.add([
    rect(6, BLOCK_SIZE * 0.6),
    pos(BLOCK_SIZE - 4, -BLOCK_SIZE * 1.3),
    color(0, 150, 200),
    outline(1),
  ]);
  
  playerSpawned = true;
  
  // KAMERA FOLGT DEM SPIELER - FIRST PERSON STYLE (aus den Augen)
  player.onUpdate(() => {
    // Kamera ist auf Augenhöhe des Spielers
    const camX = player.pos.x;
    const camY = player.pos.y - BLOCK_SIZE * 0.9; // Augenhöhe
    camPos(camX, camY);
  });
});

// ====== SPIELER BEWEGUNG - MINECRAFT-STYLE ======
const SPEED = 200;
const JUMP_FORCE = 550;

// W = VORWÄRTS (nach rechts)
onKeyDown("w", () => {
  if (player && !inventoryOpen) {
    player.move(SPEED, 0);
  }
});

// S = RÜCKWÄRTS (nach links)
onKeyDown("s", () => {
  if (player && !inventoryOpen) {
    player.move(-SPEED, 0);
  }
});

// A = LINKS (seitlich - optional)
onKeyDown("a", () => {
  if (player && !inventoryOpen) {
    player.move(-SPEED, 0);
  }
});

// D = RECHTS (seitlich - optional)
onKeyDown("d", () => {
  if (player && !inventoryOpen) {
    player.move(SPEED, 0);
  }
});

// SPACE = SPRINGEN (nur wenn auf dem Boden)
onKeyPress("space", () => {
  if (player && player.isGrounded() && !inventoryOpen) {
    player.jump(JUMP_FORCE);
  }
});

// ====== MAUSRAD ZUM SLOT WECHSELN ======
onScroll((delta) => {
  if (inventoryOpen) return;
  
  // Delta.y ist negativ beim Hochscrollen, positiv beim Runterscrollen
  if (delta.y > 0) {
    // Runterscrollen = nächster Slot
    selectedSlot = (selectedSlot + 1) % 8;
  } else if (delta.y < 0) {
    // Hochscrollen = vorheriger Slot
    selectedSlot = (selectedSlot - 1 + 8) % 8;
  }
  
  // Indikator bewegen
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
        let icon = "";
        if (slot.item === "sword") icon = "⚔";
        if (slot.item === "apple") icon = "🍎";
        
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

// ====== LINKSKLICK ZUM SCHLAGEN UND BLÖCKE ABBAUEN ======
let canAttack = true;
let attackCooldown = 0.5;

onMousePress("left", () => {
  if (!playerSpawned || inventoryOpen || !canAttack || !player) return;
  
  // Prüfen ob wir einen Block/Baum treffen
  const attackRange = 80; // Reichweite wie in Minecraft
  const attackX = player.pos.x + attackRange;
  const attackY = player.pos.y - 30;
  
  // Alle Blöcke in Reichweite prüfen
  const blocksInRange = get("tree").concat(get("leaves"));
  let blockDestroyed = false;
  
  for (const block of blocksInRange) {
    const distance = Math.sqrt(
      Math.pow(block.pos.x - attackX, 2) + 
      Math.pow(block.pos.y - attackY, 2)
    );
    
    if (distance < attackRange) {
      // Block zerstören!
      destroy(block);
      blockDestroyed = true;
      
      // Holz-Partikel beim Zerstören
      for (let i = 0; i < 8; i++) {
        const particle = add([
          rect(6, 6),
          pos(block.pos.x + Math.random() * BLOCK_SIZE, block.pos.y + Math.random() * BLOCK_SIZE),
          color(101, 67, 33), // Braune Partikel
          opacity(1),
          z(14),
          "break_particle"
        ]);
        
        wait(0.5, () => {
          if (particle.exists()) {
            destroy(particle);
          }
        });
      }
      
      break; // Nur einen Block pro Klick
    }
  }
  
  // Schlag-Effekt anzeigen
  const attackEffect = add([
    rect(50, 8),
    pos(attackX, attackY),
    color(255, 255, 150),
    z(15),
    opacity(0.8),
    "attack_effect"
  ]);
  
  // Normale Schlag-Partikel
  for (let i = 0; i < 5; i++) {
    const particle = add([
      rect(4, 4),
      pos(attackX + Math.random() * 40 - 20, attackY + Math.random() * 40 - 20),
      color(255, 255, 0),
      opacity(1),
      z(14),
      "particle"
    ]);
    
    wait(0.2, () => {
      if (particle.exists()) {
        destroy(particle);
      }
    });
  }
  
  const swingText = add([
    text(blockDestroyed ? "⛏" : "⚔", { size: 50 }),
    pos(attackX + 20, attackY - 20),
    opacity(1),
    z(20),
    "swing_icon"
  ]);
  
  wait(0.15, () => {
    if (attackEffect.exists()) destroy(attackEffect);
    if (swingText.exists()) destroy(swingText);
  });
  
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
    updateHearts(); // Herzen aktualisieren!
    
    const eatText = add([
      text("+2 ♥", { size: 40 }),
      pos(width() / 2, height() / 2 - 100),
      anchor("center"),
      color(255, 100, 100),
      z(2000),
      fixed(),
    ]);
    
    wait(1, () => {
      if (eatText.exists()) {
        destroy(eatText);
      }
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
  text("W/D = Vorwärts/Zurück | A/S = Links/Rechts | SPACE = Springen | E = Inventar | Mausrad = Slot wechseln", { size: 10 }),
  pos(width() / 2, height() - 10),
  anchor("center"),
  color(255, 255, 255),
  z(1000),
  fixed(),
]);
