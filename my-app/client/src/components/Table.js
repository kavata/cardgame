import React, { useState, useEffect } from 'react';
import { Box, Slide } from '@mui/material';
import { getPenalites } from './data/cards';
import Card from '../components/widgets/Card';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

function GameTable() {
  const [randomCards, setRandomCards] = useState([]);
  const [cardsPlayed , setCardsPlayed] = useState([])
  useEffect(() => {
    socket.on("cardsPlayed" , (cards)=>{
       if (cardsPlayed) {
        setCardsPlayed(cards)
        console.log('Cartes joué' ,cards)
       }else{
        setCardsPlayed([])
       }
    })
    const generateRandomCards = () => {
      const cards = [];
      while (cards.length < 4) {
        const randomCard = Math.floor(Math.random() * 104) + 1;
        if (!cards.includes(randomCard)) {
          cards.push(randomCard);
        }
      }
      return cards;
    };

    const randomCardsArray = generateRandomCards();
    setRandomCards(randomCardsArray.sort((a, b) => a - b));
    socket.emit('randomcards', randomCardsArray);
  }, []);

  useEffect(() => {
    console.log('Les cartes jouées ont changé :', cardsPlayed);
  }, [cardsPlayed]);

  return (
    <Box sx={{ marginLeft: 0, display: 'flex' }}>
      <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={2000}>
        <div>
          {randomCards.map((card, index) => (
            <div key={index}>
              <Card cardNumber={card} />
              <b>{getPenalites(card)}</b>
            </div>
          ))}
        </div>
      </Slide>

      {/* Nouvelle ligne pour les cartes jouées par chaque joueur */}
      {cardsPlayed.map((playerCards, playerIndex) => {
        const sortedPlayerCards = playerCards.slice().sort((a, b) => a - b);

        return (
          <div key={playerIndex} style={{ marginLeft: 16 }}>
            <div>Joueur {playerIndex + 1} :</div>
            {sortedPlayerCards.map((card, index) => (
              <div key={index}>
                <Card cardNumber={card.card} />
                <b>{getPenalites(card.card)}</b>
              </div>
            ))}
          </div>
        );
      })}
    </Box>
  );
}

export default GameTable;
