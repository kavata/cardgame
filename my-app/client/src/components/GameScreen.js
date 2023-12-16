// client/src/components/GameScreen.js
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
          {/* Affichez ici les détails de gameState */}
          <p>Informations du jeu...</p>
        </div>
      ) : (
        <p>Chargement du jeu...</p>
      )}
    </div>
  );
}

export default GameScreen;
