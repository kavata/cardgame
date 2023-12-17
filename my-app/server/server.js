const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const http = require('http'); // Assurez-vous d'importer le module http


const app = express();
const port = 3001;
const db = new sqlite3.Database('./mydb.sqlite3');

// Middleware pour gérer les requêtes JSON et CORS
app.use(express.json());
app.use(cors());

// Route d'inscription
app.post('/user/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Vérification si l'utilisateur existe déjà
        const user = await getUserByUsername(username);
        if (user) {
            return res.status(409).send({ message: "L'utilisateur existe déjà" });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Ajout de l'utilisateur à la base de données
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.run(query, [username, hashedPassword], function(err) {
            if (err) {
                throw err;
            }
            res.status(201).send({ message: "Inscription réussie", userId: this.lastID });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: "Erreur serveur" });
    }
});


// Route de connexion
app.post('/user/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(404).send({ message: "Utilisateur non trouvé" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: "Mot de passe incorrect" });
        }

        res.status(200).send({ message: "Connexion réussie", userId: user.id });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: "Erreur serveur" });
    }
});

// Fonction pour récupérer un utilisateur par son nom d'utilisateur
function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        db.get(query, [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}
// Créez le serveur HTTP après avoir configuré `app`
const server = http.createServer(app);
const io = socketIo(server);
// Exemple de configuration dans server.js
const gameRoutes = require('./routes/gameRoutes');
app.use('/jeux', gameRoutes); // Assurez-vous que le chemin correspond à celui que vous utilisez dans le fetch

//stocker les etas de jeux
const games = new Map(); // Pour stocker les états des jeux

io.on('connection', (socket) => {
  console.log('Nouvelle connexion Socket.io');

  socket.on('joinGame', ({ gameId, userId }) => {
    if (!games.has(gameId)) {
      games.set(gameId, new Game());
    }
    const game = games.get(gameId);
    game.addPlayer(userId);
    socket.join(gameId);
  });

  socket.on('playerAction', ({ gameId, userId, action }) => {
    const game = games.get(gameId);
    if (game) {
      // Traitement de l'action du joueur
      game.playTurn(userId, action);
      io.to(gameId).emit('gameState', game.getState());
    }
  });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
