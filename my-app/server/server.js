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
const gamesData = new Map();
const allGames = {}
io.on('connection', (socket) => {
  console.log('Nouvelle connexion Socket.io');
socket.on('createGame', (newGameInfo, userId, username) => {
        // Stockez les informations du jeu dans la Map
        const userGameKey =  userId

        gamesData.set(userId, {
            id: newGameInfo.gameId,
            master: userId,
            name: newGameInfo.gameName,
            numberOfPlayers: newGameInfo.numberOfPlayers,
            participants: [username], // Vous pouvez ajouter les participants ici
        });
       console.log(gamesData)
        // Émettez un événement pour informer les clients du jeu créé
        setInterval(() => {
          io.emit('gameCreated', gamesData.get(userId));
        }, 1000);
  });
   
   socket.on('ramdomCards', (ramDomCards)=>{
    
      console.log(ramDomCards)
        socket.emit('ramdomCardsUpdated', ramDomCards )
   

   })


  socket.on('joinGame', (gameId, userId , username) => {

   if (gamesData.get(gameId) && gamesData.get(gameId).participants.length < gamesData.get(gameId).numberOfPlayers) {
     console.log(username+'   a rejoint le jeu', gamesData.get(gameId))
    gamesData.get(gameId).participants.push(username)
    console.log("L'état dujeu", gamesData.get(gameId))
    io.emit('gameCreated', gamesData.get(userId));
   }else {
    // Si le jeu n'existe pas ou a atteint le nombre maximum de joueurs, émettez un message d'erreur
    socket.emit('gameError', { message: 'Impossible de rejoindre le jeu. Le jeu est complet ou n\'existe pas.' });
  }

    /*if (!games.has(gameId)) {
      const game = new Game();
      games.set(gameId, game);
    }
    const game = games.get(gameId);
    game.addPlayer(userId);
    socket.join(gameId);
    io.to(gameId).emit('gameState', game.getState()); // Assurez-vous que Game a une méthode getState()*/
  });

  const userData = [];
  
  socket.on('setCard', (data) => {
  
      // L'utilisateur n'a pas encore envoyé de données, ajoutez-les au tableau
      userData.push(data);
      console.log('Données stockées côté serveur :', userData);

     setInterval(() => {
       io.emit('cardsPlayed', userData);
     }, 1000);
  
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
