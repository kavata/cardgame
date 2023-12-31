const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const Game = require('./models/Game'); // Assurez-vous que le chemin est correct

const app = express();
const port = 3001;
const db = new sqlite3.Database('./mydb.sqlite3');

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"]
}));

app.post('/user/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    if (user) {
      return res.status(409).send({ message: "L'utilisateur existe déjà" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.run(query, [username, hashedPassword], function(err) {
      if (err) {
        return res.status(500).send({ message: "Erreur serveur", error: err.message });
      }
      res.status(201).send({ message: "Inscription réussie", userId: this.lastID });
    });
  } catch (error) {
    res.status(500).send({ message: "Erreur serveur", error: error.message });
  }
});

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
    res.status(500).send({ message: "Erreur serveur", error: error.message });
  }
});

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

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const gameRoutes = require('./routes/gameRoutes'); // Assurez-vous que le chemin est correct
app.use('/jeux', gameRoutes);

const games = new Map(); 

io.on('connection', (socket) => {
  console.log('Nouvelle connexion Socket.io');

  socket.on('joinGame', ({ gameId, userId }) => {
    if (!games.has(gameId)) {
      const game = new Game();
      games.set(gameId, game);
    }
    const game = games.get(gameId);
    game.addPlayer(userId);
    socket.join(gameId);
    io.to(gameId).emit('gameState', game.getState()); // Assurez-vous que Game a une méthode getState()
  });

  socket.on('playerAction', ({ gameId, userId, action }) => {
    const game = games.get(gameId);
    if (game) {
      try {
        game.playTurn(userId, action);
        io.to(gameId).emit('gameState', game.getState());
      } catch (error) {
        socket.emit('gameError', { message: error.message });
      }
    }
  });

  socket.on('sendMessage', async ({ gameId, userId, message }) => {
    try {
      const user = await getUserById(userId);
      const username = user ? user.username : 'Anonyme';
      const chatMessage = { userId, username, message };

      const game = games.get(gameId);
      if (game) {
        game.sendMessage(userId, message);
        io.to(gameId).emit('receiveMessage', chatMessage);
      }
    } catch (error) {
      console.error(error.message);
      socket.emit('error', { message: 'Erreur lors de l’envoi du message.' });
    }
  });
});

function getUserById(userId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.get(query, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

server.listen(port, () => console.log(`Serveur écoutant sur le port ${port}`));
