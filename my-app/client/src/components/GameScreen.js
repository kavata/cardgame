import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

function GameScreen({ gameId, userId }) {
  const [gameState, setGameState] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useRef(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    // La configuration de la connexion Socket.IO
    console.log('Tentative de connexion à : http://localhost:3001');
    socket.current = io('http://localhost:3001');

    // Les événements liés à la connexion Socket.IO
    if (socket.current) {
      socket.current.emit('joinGame', { gameId, userId });

      socket.current.on('gameState', (state) => {
        setGameState(state);
      });

      socket.current.on('receiveMessage', (chatMessage) => {
        setMessages(prevMessages => [...prevMessages, chatMessage]);
      });
    }

    // Nettoyage de la connexion lors du démontage du composant
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [gameId, userId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socket.current.emit('sendMessage', { gameId, userId, message: newMessage });
      setNewMessage('');
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePlayerAction = (actionType, additionalData) => {
    const action = { type: actionType, ...additionalData };
    socket.current.emit('playerAction', { gameId, userId, action });
  };

  
  return (
    <div className="game-screen">
      {/* Affichage du jeu */}
      {gameState && gameState.players.map(player => (
        <div key={player.id}>
          <h2>{player.username}'s Hand:</h2>
          <div className="player-hand">
            {player.hand.map((card, index) => (
              <div key={index} className="card">
                {card.value} of {card.suit}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Zone de Chat */}
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, index) => (
            <p key={index}><strong>{msg.userId}:</strong> {msg.message}</p>
          ))}
          <div ref={messageEndRef} />
        </div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Tapez votre message ici"
        />
        <button onClick={handleSendMessage}>Envoyer</button>
      </div>
    </div>
  );
}

export default GameScreen;