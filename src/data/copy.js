/**
 * COPY.JS - Textes thématiques
 * 
 * Ce fichier centralise tous les textes de l'interface qui peuvent
 * changer en fonction de la thématique de la semaine.
 * 
 * ⚠️ NE PAS MODIFIER :
 * - Les labels de Business Status (engaged, engaging, to engage, TBD, DQ)
 * - Les intitulés des champs entreprise (Chiffre d'affaires, Employés, etc.)
 * 
 * 🎨 THÈME ACTUEL : Default
 * Pour changer de thème, modifier ACTIVE_THEME ci-dessous
 */

// ============================================
// 🎨 SÉLECTION DU THÈME ACTIF
// ============================================
const ACTIVE_THEME = "default"; // Options: "default", "streetFighter", "mario"

// ============================================
// 🎨 DÉFINITION DES THÈMES
// ============================================
const themes = {
  default: {
    name: "Default",
    startScreen: {
      title: "Challenge du Jour",
      subtitle: "Prêt à qualifier tes deals ?",
      dealCountLabel: "Deals à qualifier",
      startButton: "C'est parti ! 🚀",
      backgroundImage: null // Pas de fond
    },
    gameSummary: {
      title: "Semaine bouclée ! 🎯",
      subtitle: "Tu as qualifié tous les deals de la semaine.",
      scoreLabel: "Deals qualifiés",
      completionText: "100% de completion 🔥",
      stat1Icon: "✅",
      stat1Label: "Décisions prises",
      stat2Icon: "🚀",
      stat2Label: "Statuts mis à jour",
      footerMessage: "Les statuts ont été synchronisés avec Attio.<br/>Rendez-vous lundi prochain pour les nouveaux deals !",
      backButton: "← Retour aux deals",
      celebrationGif: "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif"
    },
    sidebar: {
      logoIcon: "🦋",
      logoText: "DealFlow",
      weekLabel: "Week #06",
      progressTitle: "Progression",
      sectionLabel: "Deals à qualifier"
    },
    victoryMessages: [
      "Bien joué ! 👍",
      "Deal qualifié ! ✅",
      "Excellent ! 🎯",
      "Continue comme ça ! 💪",
      "Parfait ! ⭐",
      "Un de plus ! 🚀",
      "Super ! 🔥",
      "Validé ! ✨",
      "Bravo ! 👏",
      "Top ! 💎"
    ]
  },
  streetFighter: {
    name: "Street Fighter 2",
    startScreen: {
      title: "READY? 🎮",
      subtitle: "Round 1. Fight! 🥊",
      dealCountLabel: "Challengers",
      startButton: "INSERT COIN 🕹️",
      backgroundImage: "/sf2-bg.gif"
    },
    gameSummary: {
      title: "YOU WIN! 🏆",
      subtitle: "All challengers defeated!",
      scoreLabel: "K.O. Count",
      completionText: "PERFECT! 💯",
      stat1Icon: "🥊",
      stat1Label: "Rounds won",
      stat2Icon: "⚡",
      stat2Label: "Combos landed",
      footerMessage: "Your score has been recorded.<br/>New challengers arrive Monday!",
      backButton: "← Continue?",
      celebrationGif: "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif"
    },
    sidebar: {
      logoIcon: "🥊",
      logoText: "DealFighter",
      weekLabel: "Round #06",
      progressTitle: "Fight Progress",
      sectionLabel: "Challengers"
    },
    victoryMessages: [
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
    ]
  },
  mario: {
    name: "Super Mario",
    startScreen: {
      title: "Let's-a go! 🍄",
      subtitle: "Time to collect some deals!",
      dealCountLabel: "Coins to collect",
      startButton: "Start Game 🎮",
      backgroundImage: null
    },
    gameSummary: {
      title: "Course Complete! 🏁",
      subtitle: "All coins collected!",
      scoreLabel: "Coins",
      completionText: "New High Score! ⭐",
      stat1Icon: "🪙",
      stat1Label: "Coins grabbed",
      stat2Icon: "🍄",
      stat2Label: "Power-ups used",
      footerMessage: "Princess Peach is proud!<br/>New world unlocks Monday!",
      backButton: "← World Map",
      celebrationGif: "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif"
    },
    sidebar: {
      logoIcon: "🍄",
      logoText: "DealWorld",
      weekLabel: "World 06",
      progressTitle: "Level Progress",
      sectionLabel: "Coins to get"
    },
    victoryMessages: [
      "It's-a me, un deal! 🍄",
      "1-UP! ⬆️ Bonus deal!",
      "Mamma mia! Bien joué! 🇮🇹",
      "Super Star! ⭐ Invincible!",
      "Coin! 🪙 Deal validé!",
      "Level Complete! 🏁",
      "Power-up obtenu! 🔥",
      "Princess saved! 👸 Enfin, deal classé!",
      "Warp Zone! 🌀 Vitesse max!",
      "Yahoo! 🎉 Continue!"
    ]
  }
};

// ============================================
// 📤 EXPORTS (thème actif)
// ============================================
const activeTheme = themes[ACTIVE_THEME];

export const startScreen = activeTheme.startScreen;
export const gameSummary = activeTheme.gameSummary;
export const sidebar = activeTheme.sidebar;
export const victoryMessages = activeTheme.victoryMessages;

export const getRandomVictoryMessage = () => {
  return victoryMessages[Math.floor(Math.random() * victoryMessages.length)];
};

// ============================================
// 📝 AUTRES TEXTES (ne changent pas avec le thème)
// ============================================
export const misc = {
  loading: "Chargement...",
  retry: "Réessayer",
  noDealsSelected: "Sélectionnez un deal dans le menu.",
  noContactWarning: "Aucun contact identifié dans le CRM",
  moreInfo: "Plus d'infos",
  hideInfo: "Masquer",
  qualifyDeal: "Qualifier le deal..."
};

// Export all themes for reference
export { themes, ACTIVE_THEME };
