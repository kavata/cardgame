import { shuffle } from 'lodash';

export const distributeCards = (players, randomCards) => {
  const cards = Array.from({ length: 104 }, (_, index) => index + 1);

  // Fusionnez toutes les cartes (initiales et aléatoires)
  const allCards = [...cards, ...randomCards];

  // Mélangez toutes les cartes
  const shuffledCards = shuffle(allCards);

  // Tableau pour stocker les informations sur les cartes attribuées à chaque joueur
  const playerCardsInfo = [];

  players.forEach((player, index) => {
    // Génère un objet représentant un joueur avec son nom et les cartes qui lui ont été attribuées
    const playerInfo = {
      username: player,
      cards: shuffledCards.slice(index * 10, (index + 1) * 10), // Distribuez les cartes sans duplication
    };

    // Ajoute cet objet au tableau
    playerCardsInfo.push(playerInfo);
  });

  // Retourne le tableau contenant les informations sur les cartes attribuées à chaque joueur
  return playerCardsInfo;
};
