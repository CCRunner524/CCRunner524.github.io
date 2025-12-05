// Very light UI glue: renders player names, HP, CP, hands, and log
function setUpUI(game) {
  // populate hero selects
  const sel1 = document.getElementById('hero1-select');
  const sel2 = document.getElementById('hero2-select');
  sel1.innerHTML = '';
  sel2.innerHTML = '';
  Object.values(game.data.heroes).forEach(h => {
    const o1 = document.createElement('option'); o1.value = h.id; o1.textContent = h.name;
    const o2 = document.createElement('option'); o2.value = h.id; o2.textContent = h.name;
    sel1.appendChild(o1); sel2.appendChild(o2);
  });

  document.getElementById('start-btn').onclick = async () => {
    const h1 = sel1.value; const h2 = sel2.value;
    await game.startNewGame(h1, h2);
  };
}

function renderPlayer(player) {
  const handEl = document.getElementById(`p${player.slotId}-hand`);
  const nameEl = document.getElementById(`player${player.slotId}-name`);
  const hpEl = document.getElementById(`p${player.slotId}-hp`);
  const cpEl = document.getElementById(`p${player.slotId}-cp`);
  nameEl.textContent = player.hero.name + (player.heroId ? '' : '');
  hpEl.textContent = player.hp;
  cpEl.textContent = player.cp;

  handEl.innerHTML = '';
  player.hand.forEach(card => {
    const c = document.createElement('div');
    c.className = 'card';
    c.dataset.id = card.id;
    c.innerHTML = `<strong>${card.name}</strong><div style="font-size:0.8rem">${card.text || ''}</div><div style="font-size:0.8rem;color:#aaa">CP ${card.cost}</div>`;
    // disable if not enough CP
    if (player.cp < (card.cost || 0)) c.classList.add('disabled');
    c.onclick = () => {
      // only allow play if it's the player's turn
      if (game.currentPlayer.slotId !== player.slotId) {
        game.log("Not your turn.");
        return;
      }
      if (player.cp < (card.cost || 0)) {
        game.log("Not enough CP.");
        return;
      }
      game.playCard(player, card);
    };
    handEl.appendChild(c);
  });
}

function renderAll(game) {
  renderPlayer(game.player1);
  renderPlayer(game.player2);
  // dice area and log updates managed by game
}

function appendLog(msg) {
  const log = document.getElementById('log');
  const p = document.createElement('div');
  p.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  log.prepend(p);
}
