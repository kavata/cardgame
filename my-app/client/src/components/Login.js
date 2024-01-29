import React, { useState } from 'react';

function Login({ onLoginSuccess, onLoginFailure }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/user/login', { // Assurez-vous que l'URL est correcte
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                onLoginSuccess(data);
                localStorage.setItem('username',username );
            } else {
                onLoginFailure(data.message);
            }
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            onLoginFailure("Erreur de connexion au serveur");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Nom d'utilisateur" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" />
            <button type="submit">Se connecter</button>
        </form>
    );
}

export default Login;
