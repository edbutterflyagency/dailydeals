// Messages style Street Fighter 2 - Semaine 06
export const victoryMessages = [
  "K.O.! 💥 Deal qualifié!",
  "PERFECT! 🏆 Tu gères!",
  "COMBO x3! 🔥 Enchaîne!",
  "YOU WIN! 👊 Round suivant!",
  "FINISH HIM! ⚡ Deal classé!",
  "HADOUKEN! 🌀 Bien joué!",
  "FLAWLESS VICTORY! 💎 Impeccable!",
  "ROUND CLEAR! 🎯 Continue!",
  "SHORYUKEN! 🐉 Deal validé!",
  "FIGHT! 🥊 Un de moins!"
];

export const getRandomMessage = () => {
  return victoryMessages[Math.floor(Math.random() * victoryMessages.length)];
};
