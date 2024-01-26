// server/initDB.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydb.sqlite3'); // Crée le fichier de base de données SQLite dans le répertoire serveur

db.serialize(() => {
  // Création de la table des utilisateurs
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);

  // Création de la table des parties de jeu
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      creator_id INTEGER,
      numberOfPlayers INTEGER,
      status TEXT,
      gameCode TEXT UNIQUE,
      FOREIGN KEY (creator_id) REFERENCES users (id)
    );
  `);

  // Table pour gérer les scores ou les états des joueurs dans les parties
  db.run(`
    CREATE TABLE IF NOT EXISTS game_scores (
      game_id INTEGER,
      user_id INTEGER,
      score INTEGER,
      FOREIGN KEY (game_id) REFERENCES games (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

    // création de la tabe des jeux
  db.run(`
  CREATE TABLE IF NOT EXISTS jeux (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
  );
  `);

  db.run(`
  INSERT INTO jeux (id, name) VALUES (1, 'bataille ouverte multi-joueurs');
  `);
  db.run(`
  INSERT INTO jeux  (id, name) VALUES (2, 'UNO');
  `);
  db.run(`
  INSERT INTO jeux (id, name) VALUES (3, 'TEST');
  `);
//       ('Jeu de Cartes 2', 1, 'en attente'),
//       ('Jeu de Cartes 3', 1, 'en attente');

  // Ajoutez ici d'autres tables nécessaires pour votre jeu
  
  db.run(`
  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER,
    user_id INTEGER,
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);
// Table pour les cartes
db.run(`
CREATE TABLE IF NOT EXISTS cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  value INTEGER NOT NULL,
  bullHeads INTEGER NOT NULL
);
`);

// Table pour les joueurs dans une partie
db.run(`
CREATE TABLE IF NOT EXISTS game_players (
  game_id INTEGER,
  user_id INTEGER,
  PRIMARY KEY (game_id, user_id),
  FOREIGN KEY (game_id) REFERENCES games (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);
`);

// Table pour les manches du jeu
db.run(`
CREATE TABLE IF NOT EXISTS rounds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER,
  winner_user_id INTEGER,
  FOREIGN KEY (game_id) REFERENCES games (id),
  FOREIGN KEY (winner_user_id) REFERENCES users (id)
);
`);

// Table pour enregistrer les cartes jouées pendant une manche
db.run(`
CREATE TABLE IF NOT EXISTS played_cards (
  round_id INTEGER,
  user_id INTEGER,
  card_id INTEGER,
  FOREIGN KEY (round_id) REFERENCES rounds (id),
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (card_id) REFERENCES cards (id)
);
`);

});



db.close();