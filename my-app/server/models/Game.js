// models/Game.js

class Game {
  constructor() {
    this.players = []; // Liste des joueurs dans la partie
    this.deck = this.createDeck(); // Création du deck de cartes
    this.currentTurn = 0;
    this.chatHistory = [];
    this.isStarted = false;
    this.isFinished = false;
    // ... autres propriétés de l'état du jeu
  }

  createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];

    for (let suit of suits) {
      for (let value of values) {
        deck.push({ suit, value });
      }
    }

    return this.shuffleDeck(deck);
  }

  shuffleDeck(deck) {
    // Algorithme de mélange de Fisher-Yates
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

 // Méthode pour distribuer les cartes aux joueurs
 dealCards(numberOfPlayers) {
  if (numberOfPlayers < 2 || numberOfPlayers > 10) {
    throw new Error("Le nombre de joueurs doit être compris entre 2 et 10.");
  }

  this.deck = this.createDeck();
  this.players = Array.from({ length: numberOfPlayers }, (_, index) => ({
    id: index + 1,
    username: `Joueur ${index + 1}`,
    cards: [],
  }));

  while (this.deck.length > 0) {
    for (let player of this.players) {
      if (this.deck.length === 0) {
        break;
      }
      player.cards.push(this.deck.pop());
    }
  }

  this.isStarted = true;
}
  // Méthode pour démarrer le jeu
  startGame(playerIds) {
    if (this.isStarted) {
      throw new Error("La partie a déjà commencé.");
    }
    // Déterminer l'ordre de jeu
    // ...
    if (playerIds.length < 2 || playerIds.length > 10) {
      throw new Error("Le nombre de joueurs doit être compris entre 2 et 10.");
    }
    // Initialiser les joueurs
    this.players = playerIds.map((playerId) => ({
      id: playerId,
      hand: [],
      username: `Player ${playerId}`,
    }));
    // Marquer la partie comme commencée
    this.isStarted = true;
  }

  // Méthode pour jouer un tour
  playTurn(playerId, card) {
    // Vérifier si la partie a commencé
    if (!this.isStarted) {
      throw new Error("La partie n'a pas encore commencé.");
    }
    // Vérifier si la partie est terminée
    if (this.isFinished) {
      throw new Error("La partie est terminée.");
    }
    // Vérifier si c'est le tour du joueur
    if (this.players[this.currentTurn].id !== playerId) {
      throw new Error("Ce n'est pas votre tour.");
    }
    // Logique pour jouer un tour
    const currentPlayer = this.players[this.currentTurn];

    // Vérifier si la carte sélectionnée est valide
    if (selectedCardIndex < 0 || selectedCardIndex >= currentPlayer.hand.length) {
      throw new Error("Indice de carte invalide.");
    }
    const selectedCard = currentPlayer.hand[selectedCardIndex];
    // ... Logique spécifique au jeu pour comparer les cartes et déterminer le gagnant

    // Mettre à jour l'indice du joueur pour le prochain tour
    this.currentTurn = (this.currentTurn + 1) % this.players.length

    // Mettre à jour l'historique du chat
    this.chatHistory.push({
      playerId,
      username: this.players.find((player) => player.id === playerId).username,
      message: `Joueur ${playerId} a joué ${selectedCard.value} de ${selectedCard.suit}.`,
    });
     // Mettre à jour l'indice du joueur pour le prochain tour
     this.currentTurn = (this.currentTurn + 1) % this.players.length;

     // Vérifier si la partie est terminée
     if (this.isFinished) {
       // Ajouter un message de fin de partie à l'historique du chat
       this.chatHistory.push({ message: "La partie est terminée." });
     }
  }

  // Méthodes pour gérer le chat, l'abandon d'un joueur, la sauvegarde et la reprise de la partie
  // ...
  // Ajouter des méthodes pour gérer le chat
  getChatHistory() {
    return this.chatHistory;
  }

  sendMessage(playerId, message) {
    // Vérifier si le joueur appartient à la partie
    if (!this.players.some((player) => player.id === playerId)) {
      throw new Error("Le joueur n'appartient pas à la partie.");
    }

    // Ajouter le message à l'historique du chat
    this.chatHistory.push({
      playerId,
      username: this.players.find((player) => player.id === playerId).username,
      message,
    });
  }

  // Ajouter des méthodes pour gérer l'abandon d'un joueur
  playerLeave(playerId) {
    // Retirer le joueur de la partie
    this.players = this.players.filter((player) => player.id !== playerId);

    // Vérifier si la partie peut continuer avec les joueurs restants
    if (this.players.length < 2) {
      // La partie ne peut pas continuer, terminer la partie
      this.isFinished = true;
    }
  }

  // Ajouter des méthodes pour gérer la sauvegarde et la reprise de la partie
  saveGame() {
    // Retourner l'état actuel du jeu
    return {
      players: this.players,
      deck: this.deck,
      currentTurn: this.currentTurn,
      chatHistory: this.chatHistory,
      isStarted: this.isStarted,
      isFinished: this.isFinished,
    };
  }

  loadGame(savedGame) {
    // Restaurer l'état du jeu à partir d'une sauvegarde
    this.players = savedGame.players;
    this.deck = savedGame.deck;
    this.currentTurn = savedGame.currentTurn;
    this.chatHistory = savedGame.chatHistory;
    this.isStarted = savedGame.isStarted;
    this.isFinished = savedGame.isFinished;
  }
}

module.exports = Game;
