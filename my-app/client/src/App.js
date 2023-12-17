import './App.css'; // Ajustez le chemin si votre fichier CSS est dans un sous-dossier
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Registration from './components/Registration';
import GameScreen from './components/GameScreen';
import GameSelection from './components/GameSelection';
import WaitingRoom from './components/WaitingRoom';
function App() {
  const [user, setUser] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('login'); // Nouvel état pour gérer l'écran actuel
  

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté (par exemple, via un token stocké localement)
    // Si oui, mettre à jour les états 'user' et 'isAuthenticated'
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentScreen('gameSelection'); // Changement d'écran après connexion
    setMessage("Bienvenue sur votre espace de jeu !");
  };

  const handleLoginFailure = (errorMsg) => {
    setMessage(`Erreur de connexion : ${errorMsg}`);
  };

  const handleRegistrationSuccess = (userData) => {
    setMessage("Inscription réussie. Veuillez vous connecter.");
  };

  const handleRegistrationFailure = (errorMsg) => {
    setMessage(`Erreur d'inscription : ${errorMsg}`);
  };

  const handleGameSelected = (gameId) => {
    setSelectedGameId(gameId);
    setCurrentScreen('waitingRoom'); // Supposons que vous ayez un écran de salle d'attente
    setMessage(`Jeu sélectionné : ${gameId}`);
    console.log('Game selected with ID:', gameId); // Dans handleGameSelected

// Et au début du composant WaitingRoom
console.log('WaitingRoom loaded with gameId:', gameId);

  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setSelectedGameId(null);
    setCurrentScreen('login')
    setMessage("Déconnexion réussie.");
    // Supprimer le token local ou les données de session si nécessaire
  };

 const handleStartGame = () => {
    setCurrentScreen('gameScreen');
  };
  /*const renderContent = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Login onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />
          <Registration onRegistrationSuccess={handleRegistrationSuccess} onRegistrationFailure={handleRegistrationFailure} />
        </>
      );
    } else if (!selectedGameId) {
      return <GameSelection onGameSelected={handleGameSelected} />;
    } else {
      return <GameScreen userId={user.id} gameId={selectedGameId} />;
    }
  };

  return (
    <div className="App">
      {message && <div className="message">{message}</div>}
      {renderContent()}
      {isAuthenticated && <button onClick={handleLogout}>Déconnexion</button>}
    </div>
  );
}*/
const renderContent = () => {
  switch (currentScreen) {
    case 'login':
      return (
        <>
          <Login onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />
          <Registration onRegistrationSuccess={handleRegistrationSuccess} onRegistrationFailure={handleRegistrationFailure} />
        </>
      );
    case 'gameSelection':
      return <GameSelection onGameSelected={handleGameSelected} />;
      case 'waitingRoom':
        return <WaitingRoom gameId={selectedGameId} onStartGame={handleStartGame} />;
      case 'gameScreen':
        return <GameScreen userId={user.id} gameId={selectedGameId} />;
      default:
        return <div>Écran inconnu</div>;
  }
};



return (
  <div className="App">
    {message && <div className="message">{message}</div>}
    {renderContent()}
    {isAuthenticated && <button onClick={handleLogout}>Déconnexion</button>}
  </div>
);
}

export default App;
