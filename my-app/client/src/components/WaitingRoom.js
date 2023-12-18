import React, { useState, useEffect } from 'react';

function WaitingRoom({ gameId, gameCode, onStartGame }) {
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
                .then(data => {
                    // Vous n'avez pas besoin de définir les participants dans le state ici
                    // si vous ne souhaitez pas les afficher dans le rendu
                    // setParticipants(data);
                })
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
            {/* Afficher le code de jeu si disponible */}
            {gameCode && <h3>Code de la Partie : {gameCode}</h3>}

            {error && <p>Erreur : {error}</p>}
            {/* Ne pas afficher la liste des participants */}
            <button onClick={onStartGame}>Commencer le Jeu</button>
        </div>
    );
}

export default WaitingRoom;
