// client/src/components/GameScreen.js
import React, { useState } from 'react';

function GameScreen() {
    const [gameId, setGameId] = useState(null);
    const [gameState, setGameState] = useState(null);

    const createGame = async () => {
        const response = await fetch('http://localhost:3000/game/create', { method: 'POST' });
        const data = await response.json();
        setGameId(data.gameId);
    };

    const playTurn = async () => {
        const response = await fetch('http://localhost:3000/game/play', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId })
        });
        const data = await response.json();
        setGameState(data.gameState);
    };

    return (
        <div>
            <button onClick={createGame}>Start Game</button>
            <button onClick={playTurn}>Play Turn</button>
            {/* Affichez ici l'état du jeu */}
        </div>
    );
}

export default GameScreen;
/* 
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function GameScreen({ gameId, userId }) {
  const [gameState, setGameState] = useState(null); // État pour stocker les informations du jeu

  useEffect(() => {
    // Création d'une instance socket lors du montage du composant
    const socket = io('http://localhost:3001'); 

    // Envoi d'un événement pour rejoindre le jeu
    socket.emit('joinGame', { gameId, userId });

    // Écoute des mises à jour de l'état du jeu
    socket.on('gameState', (state) => {
      setGameState(state);
    });

    // Nettoyage en déconnectant le socket lors du démontage du composant
    return () => {
      socket.disconnect();
    };

    // Les dépendances gameId et userId sont nécessaires ici pour que useEffect s'exécute à nouveau si elles changent
  }, [gameId, userId]);

  // Logique pour afficher l'état du jeu
  return (
    <div>
      <h2>État du Jeu</h2>
      {gameState ? (
        <div>
        */  {/* Affichez ici les détails de gameState */}
         /* <p>Informations du jeu...</p>
        </div>
      ) : (
        <p>Chargement du jeu...</p>
      )}
    </div>
  );
}

export default GameScreen; */


