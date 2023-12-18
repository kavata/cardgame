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
    const handleCreateGame = () => {
        // Convertir selectedGameId en Number si nécessaire
        const gameIdNumber = selectedGameId ? Number(selectedGameId) : null;
    
        // Vérifiez si un jeu existant a été sélectionné
        if (gameIdNumber) {
            // Trouver le jeu sélectionné par ID
            const selectedGame = games.find(game => game.id === gameIdNumber);
            if (selectedGame) {
                // Un jeu existant a été sélectionné, appeler onGameSelected avec cet ID et le nom
                onGameSelected(selectedGame.id, selectedGame.name);
            } else {
                // Aucun jeu correspondant trouvé, log une erreur
                console.error('Le jeu sélectionné est introuvable dans la liste des jeux disponibles.');
            }
        } else {
            // Aucun jeu n'a été sélectionné, créer une nouvelle partie
            const newGameInfo = {
                name: 'Nouvelle Partie', // Vous pourriez vouloir permettre à l'utilisateur de définir ce nom
                numberOfPlayers: numberOfPlayers, // Le nombre de joueurs a été défini par l'utilisateur
            };
    
            // Appel API pour créer une nouvelle partie
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
                // Nouvelle partie créée, utiliser les propriétés retournées par l'API
                onGameSelected(newGame.id, newGame.name);
            })
            .catch(error => {
                // Gérer les erreurs de la requête API
                console.error('Erreur lors de la création de la partie :', error);
            });
        }
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