import React from 'react';
import { useStore } from '../store/useStore';

const Inspector: React.FC = () => {
  const { cards, selectedCardId, updateCardText, updateCardDuration } = useStore();
  
  const selectedCard = cards.find(card => card.id === selectedCardId);
  
  if (!selectedCard) {
    return (
      <div style={{ padding: '16px', color: 'white' }}>
        <p>Select a card to edit</p>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '16px', color: 'white' }}>
      <div style={{ marginBottom: '16px' }}>
        <label>
          Description:
          <textarea
            value={selectedCard.text}
            onChange={(e) => updateCardText(selectedCard.id, e.target.value)}
            style={{ width: '100%', minHeight: '60px', color: 'black', marginTop: '8px' }}
          />
        </label>
      </div>
      {selectedCard.type === 'cardio' && selectedCard.duration !== undefined && (
        <div>
          <label>
            Duration (minutes):
            <input
              type="number"
              value={selectedCard.duration}
              onChange={(e) => updateCardDuration(selectedCard.id, Number(e.target.value))}
              min="1"
              style={{ width: '100%', color: 'black', marginTop: '8px', padding: '4px' }}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default Inspector;
