import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
 const socket = io('http://localhost:3001');

function WaitingRoom({ gameId, gameCode, onStartGame }) {
    const [error, setError] = useState('');
    const [gamers, setGamers] = useState([])
    const [curentgameCode , setCurentgameCode] =useState()
    useEffect(() => {
       socket.on('gameCreated' , (gameCreated)=>{
        console.log('jeux' , gameCreated)
            if(gameCreated){
                setGamers(gameCreated.participants)
                console.log(gameCreated.participants)
                setCurentgameCode(gameCreated.id)
            }
       })
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
            <h2>Salle d'attente pour la partie {curentgameCode}</h2>
            {/* Afficher le code de jeu si disponible */}
            {curentgameCode!==undefined && <h3>Code de la Partie : {curentgameCode}</h3>}

            {error && <p>Erreur : {error}</p>}
            {/* Ne pas afficher la liste des participants */}
            <button onClick={onStartGame}>Commencer le Jeu</button>
        </div>
    );
}

export default WaitingRoom;
