import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

function GameScreen({ gameId, userId }) {
  const [gameState, setGameState] = useState(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:3001');

    socket.current.emit('joinGame', { gameId, userId });

    socket.current.on('gameState', (state) => {
      setGameState(state);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [gameId, userId]);

  const handlePlayerAction = (actionType, additionalData) => {
    const action = { type: actionType, ...additionalData };
    socket.current.emit('playerAction', { gameId, userId, action });
  };

  return (
    <div>
      <h2>État du Jeu</h2>
      {gameState ? (
        <div>
          <p>Tour actuel : {gameState.currentTurn}</p>
          {/* Affichage des informations spécifiques au jeu */}
          {gameState.players.map((player, index) => (
            <p key={index}>{player.username}: {player.cards.length} cartes</p>
          ))}

          {/* Interactions possibles pour le joueur */}
          {gameState.currentTurn === userId && (
            <div>
              {/* Exemple d'action : jouer une carte */}
              <button onClick={() => handlePlayerAction('playCard', { cardId: '123' })}>
                Jouer une Carte
              </button>
            </div>
          )}

          {/* Autres interactions basées sur le jeu */}
        </div>
      ) : (
        <p>Chargement du jeu...</p>
      )}
    </div>
  );
}
export default GameScreen;