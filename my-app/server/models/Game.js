class Game {
  constructor() {
    this.players = [];
    this.deck = this.createDeck();
    this.rows = [[]];
    this.currentPlayerIndex = 0;
    this.isFinished = false;
    this.isStarted = false;
    this.currentTurn = 0;
    this.currentHand = [];
    this.chatHistory = [];
  }
  

  createDeck() {
    const deck = [];
    const maxCardValue = 104; // Valeur maximale des cartes dans "6 qui prend"
  
    for (let value = 1; value <= maxCardValue; value++) {
      let bullHeads = 0;
  
      // Déterminez le nombre de têtes de bœufs associé à chaque carte
      if (value % 5 === 0) {
        bullHeads = 2;
      } else if (value % 10 === 0) {
        bullHeads = 3;
      } else if (value === 55) {
        bullHeads = 7;
      } else {
        bullHeads = 1;
      }
  
      deck.push({ value, bullHeads });
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
  //distribuer les cartes aux joueurs
  dealCards() {
    const numPlayers = this.players.length;
    const cardsPerPlayer = Math.floor(this.deck.length / numPlayers);
  
    for (let i = 0; i < numPlayers; i++) {
      const player = this.players[i];
      player.hand = this.deck.splice(0, cardsPerPlayer);
    }
  }
  

  startGame(playerIds) {
    if (this.isStarted) {
      throw new Error("La partie a déjà commencé.");
    }
  
    if (playerIds.length < 2 || playerIds.length > 10) {
      throw new Error("Le nombre de joueurs doit être compris entre 2 et 10.");
    }
  
    // Initialiser les joueurs
    this.players = playerIds.map((playerId) => ({
      id: playerId,
      hand: [],
      username: `Player ${playerId}`,
      points: 0, // Ajoutez d'autres propriétés si nécessaire
    }));
  
    // Distribuer les cartes aux joueurs
    this.dealCards();
  
    // Marquer la partie comme commencée
    this.isStarted = true;
  
    // Définir d'autres paramètres du jeu selon les besoins
    // ...
  }
  

  playCard(playerIndex, cardIndex) {
    // Vérifier si la partie a commencé
    if (!this.isStarted) {
      throw new Error("La partie n'a pas encore commencé.");
    }
  
    // Vérifier si la partie est terminée
    if (this.isFinished) {
      throw new Error("La partie est terminée.");
    }
  
    // Vérifier si c'est le tour du joueur
    if (this.currentTurn !== playerIndex) {
      throw new Error("Ce n'est pas votre tour.");
    }
  
    // Obtenir le joueur actuel
    const currentPlayer = this.players[playerIndex];
  
    // Vérifier si la carte sélectionnée est valide
    if (cardIndex < 0 || cardIndex >= currentPlayer.hand.length) {
      throw new Error("Indice de carte invalide.");
    }
  
    const selectedCard = currentPlayer.hand[cardIndex];
  
    // Logique spécifique au jeu "6 qui prend" pour jouer une carte sur une rangée
    // ...
  
    // Mettre à jour l'indice du joueur pour le prochain tour
    this.currentTurn = (this.currentTurn + 1) % this.players.length;
  
    // Vérifier si la partie est terminée
    if (this.isFinished) {
      // Ajouter un message de fin de partie à l'historique du chat
      this.chatHistory.push({ message: "La partie est terminée." });
    }
  }
  

  resolveRound() {
    // Logique pour résoudre une manche du jeu "6 qui prend"
    // ...
  
    // Calculez les points de bœufs pour chaque carte dans la main actuelle
    const bullheadPoints = this.currentHand.map((card) => card.heads);
  
    // Trouvez le joueur avec le plus grand nombre de points de bœufs
    const maxBullheadPoints = Math.max(...bullheadPoints);
    const winningPlayerIndex = bullheadPoints.indexOf(maxBullheadPoints);
  
    // Ajoutez la main actuelle à la main du joueur gagnant
    const winningPlayer = this.players[winningPlayerIndex];
    winningPlayer.hand = [...winningPlayer.hand, ...this.currentHand];
    winningPlayer.heads += maxBullheadPoints;
  
    // Effacez la main actuelle
    this.currentHand = [];
  
    // Vérifiez si le jeu est terminé (tout joueur a plus de 66 têtes de bœufs)
    const isGameOver = this.players.some((player) => player.heads > 66);
  
    if (isGameOver) {
      this.isFinished = true;
      this.chatHistory.push({ message: 'Game over!' });
      // Ajoutez d'autres logiques de fin de jeu si nécessaire
    } else {
      // Continuez avec la prochaine manche ou d'autres logiques du jeu
      // ...
    }
  }

  getState() {
    // Retournez l'état actuel du jeu pour diffusion aux clients
    return {
      players: this.players,
      rows: this.rows,
      currentPlayerIndex: this.currentPlayerIndex,
      isFinished: this.isFinished,
      // Ajoutez d'autres propriétés selon les besoins
    };
  }
}

module.exports = Game;
