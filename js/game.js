// Orchestrates the full game
const game = {
  data: null,
  player1: null,
  player2: null,
  currentPlayer: null,
  opponentPlayer: null,
  aiModule: null,

  log(msg) {
    console.log(msg);
    if (typeof appendLog === "function") appendLog(msg);
  },

  async init() {
    const container = document.getElementById("gameContainer");
    container.innerHTML = "<p>Loading game data...</p>";

    // Look for UI controls (if they exist; ignore if not present)
    const useSheetEl = document.getElementById("use-google-sheet");
    const sheetUrlEl = document.getElementById("sheet-url");

    const useSheet = useSheetEl ? useSheetEl.checked : false;
    const sheetUrl = sheetUrlEl ? sheetUrlEl.value.trim() : null;

    try {
      this.data = await loadAllData({
        useGoogleSheet: useSheet,
        sheetUrl: sheetUrl || null
      });

      container.innerHTML = `
        <h2>Game Ready</h2>
        <p>Loaded heroes: ${Object.keys(this.data.heroes).join(", ")}</p>
        <p>Select heroes above and press “Start Game”.</p>
      `;

      // Initialize UI hooks only if UI exists
      if (typeof setUpUI === "function") {
        setUpUI(this);
      }

      this.log("D
