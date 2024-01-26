const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.create(username, password);
        res.status(201).json({ message: "Inscription réussie", user });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de l'inscription", error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }
        res.status(200).json({ message: "Connexion réussie", user });
    } catch (err) {
        res.status(500).json({ message: "Erreur de connexion", error: err.message });
    }
};
