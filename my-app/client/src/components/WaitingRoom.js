import React, { useState, useEffect } from 'react';

function WaitingRoom({ gameId, onStartGame }) {
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Vérifier si gameId est défini
        if (gameId) {
            fetch(`http://localhost:3001/games/${gameId}/participants`)
                .then(response => {
                    // Vérifier si la réponse est OK
                    if (!response.ok) {
                        throw new Error('La réponse du serveur n\'est pas OK');
                    }
                    return response.json();
                })
                .then(data => setParticipants(data))
                .catch(error => {
                    console.error('Erreur lors du chargement des participants:', error);
                    setError('Erreur lors du chargement des participants');
                });
        } else {
            setError('ID de partie non défini');
        }
    }, [gameId]);

    return (
        <div>
            <h2>Salle d'attente pour la partie {gameId}</h2>
            {error && <p>Erreur : {error}</p>}
            <ul>
                {participants.map(participant => (
                    <li key={participant.id}>{participant.name}</li>
                ))}
            </ul>
            <button onClick={onStartGame}>Commencer le Jeu</button>
        </div>
    );
}

export default WaitingRoom;
