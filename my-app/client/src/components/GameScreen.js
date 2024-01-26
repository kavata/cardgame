import React, { useEffect, useState } from 'react';

const GameScreen = ({ socket, gameId, userId }) => {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    // Vérifiez si socket est défini avant d'ajouter des écouteurs
    if (socket) {
      // Écoutez les mises à jour de l'état du jeu depuis le serveur
      socket.on('gameState', (newGameState) => {
        setGameState(newGameState);
      });

      // Assurez-vous de nettoyer les écouteurs lors du démontage du composant
      return () => {
        socket.off('gameState');
      };
    }
  }, [socket]);

  const handlePlayCard = (cardIndex) => {
    if (socket) {
      // Ajoutez la logique pour jouer une carte au serveur
      socket.emit('playerAction', { gameId, userId, action: { type: 'playCard', cardIndex } });
    }
  };

  // Vérifiez si l'état du jeu est chargé
  if (!gameState) {
    return <div>Loading game state...</div>;
  }

  // Exemple d'affichage du plateau de jeu
  return (
    <div>
      {/* ... Votre code d'affichage ici */}
    </div>
  );
};

export default GameScreen;
