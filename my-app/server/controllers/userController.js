// server/controllers/gameController.js
// Contrôleur pour gérer les requêtes liées aux jeux
const Game = require('../models/Game');

exports.createGame = (req, res) => {
  Game.create(req.body.name, req.body.creatorId)
    .then(game => res.status(201).json(game))
    .catch(err => res.status(500).json({ error: err.message }));
};

exports.getGame = (req, res) => {
  Game.findById(req.params.id)
    .then(game => res.json(game))
    .catch(err => res.status(500).json({ error: err.message }));
};

// Ajouter d'autres méthodes selon les besoins de votre jeu
