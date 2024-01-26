import React from 'react';
import Card from './Card';

const Hand = ({ hand, onCardClick, selectedCardIndex }) => {
  return (
    <div className="player-hand">
      {hand.map((card, index) => (
        <Card
          key={index}
          card={card}
          onClick={() => onCardClick(index)}
          isSelected={index === selectedCardIndex}
        />
      ))}
    </div>
  );
};

export default Hand;
