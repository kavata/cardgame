import { io } from 'socket.io-client';
import {ref , onValue , push} from 'firebase/database'
import { db } from '../rtdb/config'

const socket = io('http://localhost:3001');

// Fonction pour comparer les cartes jouées avec les cartes des rangées
export function compareCards(cardsPlayed, randomCards) {
  // On parcourt les cartes jouées dans l'ordre croissant
  cardsPlayed.forEach((card) => {
    // On cherche la rangée qui contient la carte la plus proche de la carte jouée
    let closestRow = 0;
    let closestDiff = Infinity;
    for (let i = 0; i < 4; i++) {
      let diff = card.card - randomCards[i][randomCards[i].length - 1];
      if (diff > 0 && diff < closestDiff) {
        closestRow = i;
        closestDiff = diff;
      }
    }
    // Si la carte jouée est plus petite que toutes les cartes des rangées
    if (closestDiff === Infinity) {
      // Le joueur doit encaisser une rangée de son choix
      let chosenRow = prompt(
        `Votre carte ${card.card} ne peut pas être placée. Choisissez une rangée à encaisser :`
      );
      // On vérifie que le choix est valide
      while (
        chosenRow < 1 ||
        chosenRow > 4 ||
        isNaN(chosenRow) ||
        chosenRow === null
      ) {
        chosenRow = prompt(
          `Votre choix n'est pas valide. Choisissez une rangée à encaisser :`
        );
      }
      // On encaisse la rangée choisie
      takeRow(card, chosenRow - 1, randomCards);
    } else {
      // Si la carte jouée peut être placée dans une rangée
      // On vérifie si la rangée contient déjà 5 cartes
      if (randomCards[closestRow].length === 5) {
        // Le joueur doit encaisser la rangée
        takeRow(card, closestRow, randomCards);
      } else {
        // Sinon, on ajoute la carte à la rangée
        randomCards[closestRow].push(card.card);
      }
    }
  });
}

// Fonction pour encaisser une rangée
function takeRow(card, rowIndex, randomCards) {
  // On ajoute les cartes de la rangée au joueur
  card.cardsTaken.push(...randomCards[rowIndex]);
  // On remplace la rangée par la carte jouée
  randomCards[rowIndex] = [card.card];
}

// Fonction pour compter les têtes de bœufs sur les cartes
function countBulls(cards) {
  // On initialise le compteur à 0
  let bulls = 0;
  // On parcourt les cartes
  cards.forEach((card) => {
    // On vérifie si la carte se termine par 5 ou 0
    if (card % 10 === 5) {
      // La carte vaut 2 têtes de bœufs
      bulls += 2;
    } else if (card % 10 === 0) {
      // La carte vaut 3 têtes de bœufs
      bulls += 3;
    } else if (card % 11 === 0) {
      // La carte est un doublet
      // On vérifie si c'est la carte 55
      if (card === 55) {
        // La carte vaut 7 têtes de bœufs
        bulls += 7;
      } else {
        // La carte vaut 5 têtes de bœufs
        bulls += 5;
      }
    } else {
      // La carte vaut 1 tête de bœuf
      bulls += 1;
    }
  });
  // On retourne le nombre de têtes de bœufs
  return bulls;
}

// Fonction pour calculer le score final
export function calculateScore(cardsPlayed) {
  // On initialise le score à 0
  let score = 0;
  // On parcourt les cartes jouées
  cardsPlayed.forEach((card) => {
    // On compte les têtes de bœufs sur les cartes encaissées par le joueur
    score += countBulls(card.cardsTaken);
  });
  // On retourne le score
  return score;
}

// Fonction pour initialiser une nouvelle manche
function newRound(randomCards, cardsPlayed , generateRandomCards) {
  // On vide les rangées
  randomCards = [];
  // On génère 4 nouvelles cartes aléatoires
  randomCards = generateRandomCards;
  // On trie les cartes par ordre croissant
  randomCards.sort((a, b) => a - b);
  // On émet les nouvelles cartes aléatoires
  socket.emit("randomcards", randomCards);
  // On vide les cartes jouées
  cardsPlayed = [];
  // On retourne les nouvelles valeurs
  return [randomCards, cardsPlayed];
}

// Fonction pour initialiser une nouvelle partie
export function newGame(randomCards, cardsPlayed , generateRandomCards) {
  // On initialise une nouvelle manche
  [randomCards, cardsPlayed] = newRound(randomCards, cardsPlayed , generateRandomCards);
  // On distribue 10 nouvelles cartes à chaque joueur
  // A compléter avec votre logique de distribution
  // On retourne les nouvelles valeurs
  return [randomCards, cardsPlayed];
}
