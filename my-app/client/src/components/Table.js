import React, { useState, useEffect } from 'react';
import { Box, Slide } from '@mui/material';
import { getPenalites } from './data/cards';
import Card from '../components/widgets/Card';
import { io } from 'socket.io-client';
import { ref, onValue } from 'firebase/database';
import { db } from '../rtdb/config';

const socket = io('http://localhost:3001');

function GameTable() {
  const [randomCards, setRandomCards] = useState([]);
  const [cardsPlayed, setCardsPlayed] = useState([]);

  useEffect(() => {
    const dataRef = ref(db, 'cardsPlayed');
    onValue(
      dataRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const playedCardsData = Object.entries(data).map(([id, item]) => ({ id, ...item }));

          setCardsPlayed(playedCardsData.sort((a, b) => a.card - b.card));
        } else {
          setCardsPlayed([]);
        }
      }
    );

    const generateRandomCards = () => {
      const cards = [];
      while (cards.length < 4) {
        const randomCard = Math.floor(Math.random() * 104) + 1;
        if (!cards.includes(randomCard)) {
          cards.push(randomCard);
        }
      }
      return cards.map((card) => [card]);
    };

    const randomCardsArray = generateRandomCards();

   
    setRandomCards(randomCardsArray);
    socket.emit('randomcards', randomCardsArray);


  }, []);

  useEffect(() => {
    console.log('Les cartes jouées ont changé :', cardsPlayed);
    console.log('Les cartes aléatoires ont changé :', randomCards);
    
    
  }, [cardsPlayed, randomCards]);

  randomCards.forEach((randomCard, i) => {
    cardsPlayed.forEach((cardPlayed, j) => {
      if (cardPlayed.card > randomCard[i] && !randomCard.includes(cardPlayed.card)) {
        randomCard.push(cardPlayed.card);
      }
    });
  });

console.log('nouveau tableau', randomCards)
  return (
    <Box sx={{ marginLeft: 0, display: 'flex' }}>
      <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={2000}>
        <div>
           {randomCards.map((tableau, index) => (
          <div key={index} style={{display: 'flex'}}>
            {/* Afficher les éléments du tableau sur une ligne */}
            {tableau.sort((a, b) => a - b).map((element, elementIndex) => (
              <div key={elementIndex}>
              <Card cardNumber={element} />
              <b>{getPenalites(element)}</b>
            </div>
            ))}
          </div>
        ))}
     
        </div>
      </Slide>
       
     
    </Box>
  );
}

export default GameTable;
