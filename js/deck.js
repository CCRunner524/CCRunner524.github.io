function expandCardCopies(card) {
  const copies = [];
  for (let i = 0; i < (card.limit || 1); i++) copies.push({...card});
  return copies;
}

function buildDeckForHero(heroId, data) {
  const deck = [];
  (data.globalCards || []).forEach(c => expandCardCopies(c).forEach(x => deck.push(x)));
  const heroPool = (data.heroCards && data.heroCards[heroId]) || [];
  heroPool.forEach(c => expandCardCopies(c).forEach(x => deck.push(x)));
  return shuffle(deck);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
