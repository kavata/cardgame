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
    const query = "SELECT * FROM games;"; // Remplacer par votre requête SQL appropriée

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

module.exports = router;
