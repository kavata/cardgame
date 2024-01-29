// Card.js

import React from 'react';

function Card({ cardNumber }) {
  const cardImageUrl = `/images/cards/${cardNumber}.png`; // Assurez-vous d'ajuster le chemin

  return (
    <img
      src={cardImageUrl}
      alt={`Carte ${cardNumber}`}
      style={{ width: '70px', margin: '5px' }}
    />
  );
}

export default Card;
