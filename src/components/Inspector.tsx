import React from 'react';
import { useStore } from '../store/useStore';

const Inspector: React.FC = () => {
  const { cards, selectedCardId, updateCardText, updateCardCue, updateCardDuration, updateCardReps, updateCardWeight, clearAllCards } = useStore();
  
  const selectedCard = cards.find(card => card.id === selectedCardId);
  
  if (!selectedCard) {
    return (
      <div style={{ padding: '16px', color: 'white' }}>
        <p>Select a card to edit</p>
      </div>
    );
  }
  
  return (
    <div style={{ 
      padding: '72px 16px 16px 16px', 
      color: 'white',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Description Field */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Description:</h4>
          <textarea
            value={selectedCard.text}
            onChange={(e) => updateCardText(selectedCard.id, e.target.value)}
            style={{ width: '100%', minHeight: '60px', color: 'black', padding: '4px' }}
          />
        </div>
        
        {/* Cue Field - Always visible for all cards */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Cue:</h4>
          <textarea
            value={selectedCard.cue || ''}
            onChange={(e) => updateCardCue(selectedCard.id, e.target.value)}
            style={{ width: '100%', minHeight: '40px', color: 'black', padding: '4px' }}
            placeholder="Enter cue information"
          />
        </div>
        
        {/* Duration Field for Cardio */}
        {selectedCard.type === 'cardio' && selectedCard.duration !== undefined && (
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Duration (minutes):</h4>
            <input
              type="number"
              value={selectedCard.duration ?? ''}
              onChange={(e) => updateCardDuration(selectedCard.id, Number(e.target.value))}
              min="1"
              style={{ width: '100%', color: 'black', padding: '4px' }}
            />
          </div>
        )}
        
        {/* Duration Field for Strength Rest */}
        {selectedCard.type === 'strength' && selectedCard.strengthSubtype === 'rest' && selectedCard.duration !== undefined && (
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Duration (minutes):</h4>
            <input
              type="number"
              value={selectedCard.duration ?? ''}
              onChange={(e) => updateCardDuration(selectedCard.id, Number(e.target.value))}
              min="1"
              style={{ width: '100%', color: 'black', padding: '4px' }}
            />
          </div>
        )}
        
        {/* Reps and Weight Fields for Strength Set */}
        {selectedCard.type === 'strength' && selectedCard.strengthSubtype === 'set' && selectedCard.reps !== undefined && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Reps:</h4>
              <input
                type="number"
                value={selectedCard.reps ?? ''}
                onChange={(e) => updateCardReps(selectedCard.id, Number(e.target.value))}
                min="1"
                style={{ width: '100%', color: 'black', padding: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Weight (lbs):</h4>
              <input
                type="number"
                value={selectedCard.weight ?? ''}
                onChange={(e) => updateCardWeight(selectedCard.id, Number(e.target.value))}
                min="0"
                style={{ width: '100%', color: 'black', padding: '4px' }}
              />
            </div>
          </>
        )}
      </div>
      
      {/* Clear Workout Button - Fixed at the bottom */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        padding: '16px 0',
        position: 'sticky',
        bottom: '0'
      }}>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear the entire workout?')) {
              clearAllCards();
            }
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(128, 128, 128, 0.2)',
            color: 'rgba(128, 128, 128, 0.8)',
            border: '1px dotted rgba(128, 128, 128, 0.6)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.3)';
            e.currentTarget.style.color = 'rgba(128, 128, 128, 1)';
            e.currentTarget.style.border = '1px dotted rgba(128, 128, 128, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.2)';
            e.currentTarget.style.color = 'rgba(128, 128, 128, 0.8)';
            e.currentTarget.style.border = '1px dotted rgba(128, 128, 128, 0.6)';
          }}
        >
          ⚠️ Clear Workout
        </button>
      </div>
    </div>
  );
};

export default Inspector;
