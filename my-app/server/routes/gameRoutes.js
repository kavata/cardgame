const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Création d'une connexion à la base de données
const db = new sqlite3.Database('./mydb.sqlite3', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Route pour obtenir la liste des jeux
router.get('/', (req, res) => {
    const query = /*"SELECT * FROM games;"*/"SELECT * FROM jeux"; // Remplacer par votre requête SQL appropriée

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
        res.status(201).json({ message: "Nouvelle partie créée", gameId: this.lastID });
    });
});


module.exports = router;
