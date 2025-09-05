import React from 'react';
import { useStore } from '../store/useStore';

const Inspector: React.FC = () => {
  const { cards, selectedCardId, updateCardText } = useStore();
  
  const selectedCard = cards.find(card => card.id === selectedCardId);
  
  if (!selectedCard) {
    return (
      <div style={{ padding: '16px', color: 'white' }}>
        <h3>Inspector</h3>
        <p>Select a card to edit</p>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '16px', color: 'white' }}>
      <h3>Inspector</h3>
      <textarea
        value={selectedCard.text}
        onChange={(e) => updateCardText(selectedCard.id, e.target.value)}
        style={{ width: '100%', minHeight: '100px', color: 'black' }}
      />
    </div>
  );
};

export default Inspector;
