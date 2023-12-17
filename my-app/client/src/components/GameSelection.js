import React, { useState, useEffect } from 'react';

function GameSelection({ onGameSelected }) {
    const [games, setGames] = useState([]);
    const [selectedGameId, setSelectedGameId] = useState('');
    const [numberOfPlayers, setNumberOfPlayers] = useState(2); // Par défaut, 2 joueurs
    const [gameCode, setGameCode] = useState('');


    // Effet de chargement des jeux au montage du composant
    useEffect(() => {
        // Fetch pour récupérer la liste des jeux depuis le serveur
        fetch('http://localhost:3001/jeux')
            .then(response => response.json())
            .then(setGames)
           .catch(error => console.error('Erreur lors du chargement des jeux :', error));
       /*     fetch('http://localhost:3001/games')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
           // ...
       */
        }, []);

    // Gestionnaire d'événement pour la sélection d'un jeu existant
    const handleGameSelect = (e) => {
        setSelectedGameId(e.target.value);
    };

    // Gestionnaire d'événement pour le changement du nombre de joueurs
    const handleNumberOfPlayersChange = (e) => {
        const value = parseInt(e.target.value, 10);
        console.log("value",value);
        // Assurez-vous que la valeur est comprise entre 2 et 10
        const clampedValue = Math.min(10, Math.max(2, value));
        setNumberOfPlayers(clampedValue);
    };

    // Gestionnaire d'événement pour la création d'une nouvelle partie
    const handleCreateGame = () => {
        const newGameInfo = {
            name: 'Nouvelle Partie',            // Nom de la partie, peut être dynamique
            numberOfPlayers: numberOfPlayers,  
            
            // Nombre de joueurs sélectionné
            // Vous pouvez ajouter d'autres informations nécessaires pour créer une partie,
            // telles que l'ID de l'utilisateur qui crée la partie, le type de jeu, etc.
        };
        console.log("newGameInfo", newGameInfo);
        fetch('http://localhost:3001/jeux', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newGameInfo),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Échec de la création de la partie');
            }
            return response.json();
        })
        .then(newGame => {
            console.log('Nouvelle partie créée :', newGame);
            onGameSelected(newGame.id); // Assurez-vous que cette fonction fait ce que vous attendez
        })
        .catch(error => {
            console.error('Erreur lors de la création de la partie :', error);
        });
    };
    
     /*   {games.map(game => (
                    <option key={game.id} value={game.id}>{game.name}</option>
                ))}
            </select>*/
    return (
        <div>
            {/* Sélecteur de jeux existants */}
            <select value={selectedGameId} onChange={handleGameSelect}>
                <option value="">Sélectionnez un jeu</option>
                {games.map(jeu => (
        <option key={jeu.id} value={jeu.id}>{jeu.name}</option> // Utilisez game.jeu ou l'attribut approprié
    ))}
</select>

            {/* Sélecteur pour le nombre de joueurs */}
            <label>
                Nombre de joueurs :
                <input
                    type="number"
                    min="2"
                    max="10"
                    value={numberOfPlayers}
                    onChange={handleNumberOfPlayersChange}
                />
            </label>

            {/* Bouton pour créer une nouvelle partie */}
            <button onClick={handleCreateGame}>Créer une partie</button>
        </div>
    );
    
}

export default GameSelection;
