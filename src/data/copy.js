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
 * 🎨 THÈME ACTUEL : Street Fighter 2
 */

// ============================================
// 🏠 ÉCRAN D'ACCUEIL (StartScreen)
// ============================================
export const startScreen = {
  title: "READY? 🎮",
  subtitle: "Round 1. Fight! 🥊",
  dealCountLabel: "Challengers",
  startButton: "INSERT COIN 🕹️"
};

// ============================================
// 🎉 ÉCRAN DE FIN (GameSummary)
// ============================================
export const gameSummary = {
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
  // GIF de célébration (URL)
  celebrationGif: "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif"
};

// ============================================
// 📋 SIDEBAR (SidebarNav)
// ============================================
export const sidebar = {
  logoIcon: "🦋",
  logoText: "DealFlow",
  weekLabel: "Week #06", // Mettre à jour chaque semaine
  progressTitle: "Progression",
  sectionLabel: "Deals à qualifier"
};

// ============================================
// 🥊 MESSAGES DE VICTOIRE (Snackbar)
// Style actuel : Street Fighter 2
// ============================================
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

// ============================================
// ⚙️ UTILITAIRES
// ============================================
export const getRandomVictoryMessage = () => {
  return victoryMessages[Math.floor(Math.random() * victoryMessages.length)];
};

// ============================================
// 📝 AUTRES TEXTES
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

// ============================================
// 🎨 THÈMES PRÉDÉFINIS (pour référence future)
// ============================================
export const themes = {
  streetFighter: {
    name: "Street Fighter 2",
    messages: [
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
    messages: [
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
