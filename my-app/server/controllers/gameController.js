const Game = require('../models/Game'); // Modèle pour les jeux

// Obtenir la liste des jeux disponibles
exports.getAvailableGames = async (req, res) => {
  try {
    const games = await Game.getAll(); // Méthode hypothétique pour récupérer tous les jeux
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer une nouvelle partie de jeu
exports.createGame = async (req, res) => {
  try {
    const { userId, gameId } = req.body;
    
    // Vérifier si le jeu sélectionné existe
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Jeu non trouvé" });
    }

    // Créer la partie et enregistrer dans la base de données
    const newGame = await Game.create({ gameId, userId });

    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 

 // Stockez les instances de jeu en cours
let games = {};

exports.createGame = (req, res) => {
    const newGame = new Game();
    const gameId = generateUniqueId(); // Implémentez cette fonction pour générer un ID unique
    games[gameId] = newGame;
    res.json({ gameId: gameId });
};

exports.playTurn = (req, res) => {
    const { gameId } = req.body;
    const game = games[gameId];

    if (game) {
        game.playTurn();
        res.json({ gameState: game.getState() }); // Implémentez getState pour obtenir l'état actuel du jeu
    } else {
        res.status(404).send('Game not found');
    }
};

function generateUniqueId() {
    // Générez un identifiant unique pour chaque jeu
    const now = Date.now();
    const random = Math.floor(Math.random() * 1000000); // Un nombre aléatoire jusqu'à 6 chiffres
    return `game-${now}-${random}`;
}
// 
/* Ajouter des joueurs à une partie existante
exports.joinGame = async (req, res) => {
  try {
    const { userId, gameId } = req.body;

    // Logique pour récupérer les détails de la partie de jeu
    const gameDetails = await Game.findById(gameId);
    
    if (!gameDetails) {
      return res.status(404).json({ message: "Partie non trouvée" });
    }
    
    // Vérifier si la partie a déjà commencé
    if (gameDetails.isStarted) {
      return res.status(400).json({ message: "Impossible de rejoindre une partie déjà commencée" });
    }
    // Logique pour ajouter un utilisateur à une partie de jeu
    const updatedGame = await Game.addPlayer(gameId, userId);

    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/
// Gérer l'abandon d'un joueur
exports.leaveGame = async (req, res) => {
  try {
    const { userId, gameId } = req.body;

    // Logique pour retirer un utilisateur d'une partie de jeu
    const updatedGame = await Game.removePlayer(gameId, userId);

    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sauvegarder l'état actuel d'une partie
exports.saveGame = async (req, res) => {
  try {
    const { gameId } = req.body;
    
    // Logique pour sauvegarder l'état de la partie
    const savedGame = await Game.saveState(gameId);

    res.status(200).json(savedGame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
