// Orchestrates the full game
const game = {
  data: null,
  player1: null,
  player2: null,
  currentPlayer: null,
  opponentPlayer: null,
  aiModule: null,
  log: function(msg) { console.log(msg); appendLog(msg); },
  async init() {
    // read UI control to see if google sheet is used
    const useSheet = document.getElementById('use-google-sheet').checked;
    const sheetUrl = document.getElementById('sheet-url').value.trim();
    try {
      this.data = await loadAllData({useGoogleSheet: useSheet, sheetUrl: sheetUrl || null});
      setUpUI(this);
      this.log("Data loaded.");
      // auto populate selects (if not already)
    } catch (err) {
      this.log("Failed to load data: " + err.message);
    }
  },

  async startNewGame(hero1Id, hero2Id) {
    // create players
    this.player1 = new Player(1, hero1Id, this.data);
    this.player2 = new Player(2, hero2Id, this.data);
    // initial draws
    this.player1.draw(4);
    this.player2.draw(4);
    // decide who starts
    this.currentPlayer = this.player1;
    this.opponentPlayer = this.player2;
    renderAll(this);
    this.log(`Game started: ${this.player1.hero.name} vs ${this.player2.hero.name}.`);
    // create AI if player2 is to be AI (we'll assume player2 by default is AI)
    this.aiModule = new SimpleAI(this, this.player2, this.player1);
    // If AI starts, run its first turn
    if (this.currentPlayer === this.player2) {
      await this.aiModule.takeTurn();
    }
  },

  async playCard(player, card) {
    // validate player/turn
    if (player !== this.currentPlayer) { this.log("Not player's turn."); return; }
    if ((card.cost || 0) > player.cp) { this.log("Not enough CP."); return; }
    player.spendCP(card.cost || 0);
    // remove card from hand to discard (or inPlay)
    const cardIdx = player.hand.findIndex(c => c.id === card.id);
    if (cardIdx >= 0) {
      const played = player.hand.splice(cardIdx,1)[0];
      player.discard.push(played);
      this.log(`${player.hero.name} plays ${played.name} (cost ${played.cost}).`);
      // resolve effect
      const target = (player === this.player1) ? this.player2 : this.player1;
      resolveEffect(played.effectId, player, target, this);
      renderAll(this);
      // check win
      this.checkWin();
    }
  },

  endTurn() {
    // simple status tick and swap players
    this.currentPlayer.tickStatus();
    [this.currentPlayer, this.opponentPlayer] = [this.opponentPlayer, this.currentPlayer];
    renderAll(this);
    // If new current player is AI, trigger it
    if (this.currentPlayer === this.player2 && this.aiModule) {
      // run AI asynchronously
      setTimeout(()=> this.aiModule.takeTurn(), 450);
    } else {
      this.log(`It's ${this.currentPlayer.hero.name}'s turn.`);
    }
  },

  checkWin() {
    if (this.player1.hp <= 0) {
      this.log(`${this.player2.hero.name} wins!`);
      alert(`${this.player2.hero.name} wins!`);
    } else if (this.player2.hp <= 0) {
      this.log(`${this.player1.hero.name} wins!`);
      alert(`${this.player1.hero.name} wins!`);
    }
  }
};

// Expose game for UI use
window.game = game;
window.addEventListener('DOMContentLoaded', ()=>game.init());
