const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const socketIo = require('socket.io'); // Ajout de Socket.IO

const gameController = require('../controllers/gameController');

// Création d'une connexion à la base de données
const db = new sqlite3.Database('./mydb.sqlite3', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Création du serveur Socket.IO
const server = require('http').createServer();
const io = socketIo(server);

// Route pour obtenir la liste des jeux
router.get('/', (req, res) => {
    const query = "SELECT * FROM jeux"; // Remplacer par votre requête SQL appropriée

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});


// Route pour créer une nouvelle partie
router.post('/', (req, res) => {
    const { name, numberOfPlayers } = req.body; // Adaptez ces champs à votre requête
    console.log("name, nb of players", req.body);

    // Ici, ajoutez la logique pour insérer une nouvelle partie dans votre base de données
    const query = `INSERT INTO games (name, numberOfPlayers, status) VALUES (?,?,'en attente')`;
    db.run(query, [name, numberOfPlayers], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        // Renvoyer l'ID de la nouvelle partie créée
        const gameId = this.lastID;
        res.status(201).json({ message: "Nouvelle partie créée", gameId });
    });
});
// Utilisation de Socket.IO pour la création de jeu et le tour de jeu
io.on('connection', (socket) => {
    console.log('Nouvelle connexion Socket.IO');

    // Lorsqu'un joueur crée un jeu
    socket.on('createGame', ({ gameId }) => {
        // Émettre une mise à jour d'état du jeu à tous les clients connectés
        io.emit('gameState', { gameId, status: 'en attente' });
    });

    // Lorsqu'un joueur joue un tour
    socket.on('playTurn', ({ gameId }) => {
        // Émettre une mise à jour d'état du jeu à tous les clients connectés
        io.emit('gameState', { gameId, status: 'en cours' });
    });
});


module.exports = router;
