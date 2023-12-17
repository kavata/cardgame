import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function WaitingRoom({ gameId }) {
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        // Remplacer par l'URL de votre API pour obtenir les participants
        fetch(`http://localhost:3001/games/${gameId}/participants`)
            .then(response => response.json())
            .then(data => setParticipants(data))
            .catch(error => console.error('Erreur lors du chargement des participants:', error));
    }, [gameId]);

    const handleStartGame = () => {
        // Envoie une requête pour démarrer le jeu
        // Remplacer par l'URL de votre API pour démarrer la partie
        fetch(`http://localhost:3001/games/${gameId}/start`, { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    // Gérer le démarrage réussi du jeu ici
                }
            })
            .catch(error => console.error('Erreur lors du démarrage du jeu:', error));
    };
       
    return (
        <div>
            <h2>Salle d'attente pour la partie {gameId}</h2>
            <ul>
                {participants.map(participant => (
                    <li key={participant.id}>{participant.name}</li>
                ))}
            </ul>
            <button onClick={handleStartGame}>Commencer le Jeu</button>
        </div>
    );

    
}

export default WaitingRoom;
