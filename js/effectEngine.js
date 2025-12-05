// effectEngine interprets effect definitions from data.effects
function resolveEffect(effectId, sourcePlayer, targetPlayer, game) {
  const effects = game.data.effects || {};
  const e = effects[effectId];
  if (!e) {
    game.log(`Effect ${effectId} not defined.`);
    return;
  }
  switch (e.type) {
    case "damage":
      {
        const amt = e.value || 0;
        const done = targetPlayer.takeDamage(amt);
        game.log(`${sourcePlayer.hero.name} deals ${done} damage to ${targetPlayer.hero.name}.`);
      }
      break;
    case "heal":
      {
        const amt = e.value || 0;
        sourcePlayer.hp = Math.min(sourcePlayer.maxHP, sourcePlayer.hp + amt);
        game.log(`${sourcePlayer.hero.name} heals ${amt} HP.`);
      }
      break;
    case "status":
      {
        sourcePlayer.addStatus(e.status, e.duration || 1);
        game.log(`${sourcePlayer.hero.name} gains status ${e.status}.`);
      }
      break;
    case "shield":
      {
        sourcePlayer.shield = (sourcePlayer.shield || 0) + (e.value || 0);
        game.log(`${sourcePlayer.hero.name} gains ${e.value} shield.`);
      }
      break;
    case "dice":
      {
        // placeholder: dice modification should be handled by UI/dice phase
        game.log(`Dice modification effect applied (developer note).`);
      }
      break;
    default:
      game.log(`Unknown effect type ${e.type}`);
  }
}
