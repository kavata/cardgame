import React from 'react';

const Card = ({ card, onClick, isSelected }) => {
  const cardClassName = isSelected ? 'selected-card' : 'card';

  return (
    <div className={cardClassName} onClick={onClick}>
      {`${card.value} of ${card.suit}`}
    </div>
  );
};

export default Card;
