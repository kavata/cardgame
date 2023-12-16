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
      jeu TEXT NOT NULL,
      name TEXT NOT NULL,
      creator_id INTEGER,
      numberOfPlayers INTEGER,
      status TEXT,
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

   db.run(`
   INSERT INTO games (name, creator_id, status) VALUES 
       ('Jeu de Cartes 1', 1, 'en attente');
 `);
//       ('Jeu de Cartes 2', 1, 'en attente'),
//       ('Jeu de Cartes 3', 1, 'en attente');

  // Ajoutez ici d'autres tables nécessaires pour votre jeu

});

db.close();