class Player {
  constructor(slotId, heroId, data) {
    this.slotId = slotId;          // 1 or 2
    this.heroId = heroId;
    this.data = data;
    this.hero = data.heroes[heroId];
    this.maxHP = this.hero?.health || 50;
    this.hp = this.maxHP;
    this.cp = this.hero?.startingCP || 0;
    this.deck = buildDeckForHero(heroId, data);
    this.hand = [];
    this.discard = [];
    this.inPlay = [];
    this.status = []; // array of {name, remaining}
    this.shield = 0;  // simple shield/protection
  }

  draw(n=1) {
    for (let i = 0; i < n; i++) {
      if (!this.deck.length) this.reshuffleDiscard();
      if (!this.deck.length) break;
      this.hand.push(this.deck.shift());
    }
  }

  reshuffleDiscard() {
    if (!this.discard.length) return;
    this.deck = shuffle(this.discard);
    this.discard = [];
  }

  spendCP(amount) { this.cp = Math.max(0, this.cp - amount); }
  gainCP(amount) { this.cp += amount; }

  takeDamage(amount) {
    const mitigated = Math.max(0, amount - this.shield);
    this.shield = Math.max(0, this.shield - amount);
    this.hp = Math.max(0, this.hp - mitigated);
    return mitigated;
  }

  addStatus(name, duration) {
    this.status.push({name, remaining: duration});
  }

  tickStatus() {
    this.status.forEach(s => s.remaining--);
    this.status = this.status.filter(s => s.remaining > 0);
  }

  discardCardById(cardId) {
    const idx = this.hand.findIndex(c => c.id === cardId);
    if (idx >= 0) {
      this.discard.push(this.hand.splice(idx,1)[0]);
    }
  }
}
