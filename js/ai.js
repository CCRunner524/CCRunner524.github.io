// Simple heuristic AI for local play. It picks highest-value playable card or rolls optimally.
// The AI will be called during its turn; it has access to game object.

class SimpleAI {
  constructor(game, player, opponent) {
    this.game = game; this.player = player; this.opponent = opponent;
  }

  chooseCardToPlay() {
    // Heuristic: prefer damage effects, then shield, then status, prefer low CP if not enough
    const playable = this.player.hand.filter(c => (c.cost || 0) <= this.player.cp);
    if (!playable.length) return null;
    // Score cards by effect value if available
    const effects = this.game.data.effects || {};
    const scored = playable.map(c => {
      const e = effects[c.effectId];
      let score = 0;
      if (!e) score = 0;
      else if (e.type === 'damage') score = e.value * 10;
      else if (e.type === 'shield') score = (e.value || 0) * 5;
      else if (e.type === 'status') score = 6;
      score -= (c.cost || 0); // prefer cheaper
      return {card:c, score};
    });
    scored.sort((a,b)=>b.score-a.score);
    return scored[0].card;
  }

  async takeTurn() {
    // Very simple flow: draw to full 5, gain 1 CP, then play as many cards as makes sense
    this.player.draw(1);
    this.player.gainCP(1);
    this.game.log(`${this.player.hero.name} (AI) gains 1 CP.`);
    let playedAny = false;
    for (let i=0;i<5;i++) {
      const card = this.chooseCardToPlay();
      if (!card) break;
      this.game.playCard(this.player, card);
      playedAny = true;
      // small delay for readability (UI only), using Promise
      await new Promise(res => setTimeout(res, 350));
    }
    if (!playedAny) this.game.log(`${this.player.hero.name} (AI) passes.`);
    // end turn
    this.game.endTurn();
  }
}
