import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

function GameScreen({ gameId }) {
  const [gameState, setGameState] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useRef(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    // Récupérer l'userId du localStorage
    const userId = localStorage.getItem('userId');

    if (userId) {
      // La configuration de la connexion Socket.IO
      console.log('Tentative de connexion à : http://localhost:3001');
      socket.current = io('http://localhost:3001');

      // Les événements liés à la connexion Socket.IO
      socket.current.emit('joinGame', { gameId, userId });

      socket.current.on('gameState', (state) => {
        setGameState(state);
      });

      socket.current.on('receiveMessage', (chatMessage) => {
        setMessages(prevMessages => [...prevMessages, chatMessage]);
      });

      // Nettoyage de la connexion lors du démontage du composant
      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, [gameId]); // Retirez userId des dépendances

  const handleSendMessage = () => {
    const userId = localStorage.getItem('userId'); // Récupérer l'userId à nouveau ici pour être sûr de sa fraîcheur
    if (newMessage.trim() && userId) {
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
    const userId = localStorage.getItem('userId'); // Récupérer l'userId à nouveau ici pour être sûr de sa fraîcheur
    if (userId) {
      const action = { type: actionType, ...additionalData };
      socket.current.emit('playerAction', { gameId, userId, action });
    }
  };

  return (
    <div className="game-screen">
      {gameState && gameState.players ? (
        gameState.players.map((player, index) => (
          <div key={index} className="player-info">
            <h2>{player.username ? player.username : 'Anonymous'}'s Hand:</h2>
            <div className="player-hand">
              {player.hand ? player.hand.map((card, cardIndex) => (
                <div key={cardIndex} className="card">
                  {`${card.value} of ${card.suit}`}
                </div>
              )) : null}
            </div>
          </div>
        ))
      ) : (
        <p>Chargement des joueurs...</p>
      )}
  
      {/* Chat Area */}
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, index) => (
           <p key={index}>
           <strong>{msg.username ? msg.username : msg.userId}:</strong> {msg.message}
         </p>
         
          ))}
          <div ref={messageEndRef} />
        </div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
  
//   return (
//     <div className="game-screen">
//     {/* Vérifiez que gameState et gameState.players sont définis */}
//     {gameState && gameState.players && gameState.players.map((player) => (
//       <div key={player.id} className="player-info">
//         {/* Utilisez une condition pour vérifier si le username est défini */}
//         <h2>{player.username ? player.username : 'Anonymous'}'s Hand:</h2>
//         <div className="player-hand">
//           {/* Vérifiez que player.hand est défini */}
//           {player.hand && player.hand.map((card, index) => (
//             // Utilisez l'ID du joueur et l'index pour créer une clé unique
//             <div key={`card-${player.id}-${index}`} className="card">
//               {`${card.value} of ${card.suit}`}
//             </div>
//           ))}
//         </div>
//       </div>
//       ))}


 }

export default GameScreen; 