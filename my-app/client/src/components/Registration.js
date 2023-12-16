import React, { useState } from 'react';

function Registration({ onRegistrationSuccess, onRegistrationFailure }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/user/register', { // Assurez-vous que l'URL est correcte
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                onRegistrationSuccess(data);
            } else {
                onRegistrationFailure(data.message);
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);
            onRegistrationFailure("Erreur de connexion au serveur");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Champs de formulaire */}
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Nom d'utilisateur" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" />
            <button type="submit">S'inscrire</button>
        </form>
    );
}

export default Registration;
