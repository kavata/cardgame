// components/WaitingRoom.js

import React from 'react';

function WaitingRoom({ gameId }) {
    // Logique pour afficher les informations de la salle d'attente

    return (
        <div>
            <h2>Salle d'attente pour la partie {gameId}</h2>
            {/* Affichage des joueurs, chat, etc. */}
        </div>
    );
}

export default WaitingRoom;
