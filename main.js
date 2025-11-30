// Kaboom is loaded via script tag in index.html
kaboom({
  canvas: document.querySelector("#game"),
  background: [20, 20, 28],
});

// Placeholder message
add([
  text("Dein Spiel wird hier sein!\n\nBenutze die AI in Cursor,\num das Spiel zu programmieren.", { 
    size: 24, 
    width: 500,
    lineSpacing: 8 
  }),
  pos(width() / 2, height() / 2),
  anchor("center"),
  color(200, 200, 200),
]);

// TODO: Implementiere hier dein Spiel!
// Die AI wird dir helfen, den Code zu schreiben.