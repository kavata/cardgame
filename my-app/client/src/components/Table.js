import React, { useState, useEffect } from 'react';
import { Box, Slide } from '@mui/material';
import { getPenalites } from './data/cards';
import Card  from '../components/widgets/Card'
function GameTable() {
  const [randomCards, setRandomCards] = useState([]);

  useEffect(() => {
    // Fonction pour générer quatre cartes aléatoires
    const generateRandomCards = () => {
      const cards = [];
      while (cards.length < 4) {
        const randomCard = Math.floor(Math.random() * 104) + 1; // Plage correcte pour 104 cartes
        if (!cards.includes(randomCard)) {
          cards.push(randomCard);
        }
      }
      return cards;
    };

    const randomCardsArray = generateRandomCards();
    setRandomCards(randomCardsArray.sort((a, b) => a - b)); // Tri des cartes aléatoires
  }, []);
 



  return (
    <Box sx={{ marginLeft: -100 }}>
      <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={2000}>
        <div>
          {randomCards.map((card, index) => (
            <div key={index}>
              <Card cardNumber={card} />
               <b>
                {getPenalites(card)}
               </b>
            </div>
          ))}
        </div>
      </Slide>
    </Box>
  );
}

export default GameTable;
