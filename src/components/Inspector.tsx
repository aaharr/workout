import React, { useRef } from 'react';
import { useStore } from '../store/useStore';
import type { Card } from '../store/useStore';

const Inspector: React.FC = () => {
  const { cards, selectedCardId, updateCardText, updateCardCue, updateCardDuration, updateCardReps, updateCardWeight, clearAllCards, workoutTitle, updateWorkoutTitle, importWorkout } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      
      {/* Action Buttons - Fixed at the bottom */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '8px',
        padding: '16px 0',
        position: 'sticky',
        bottom: '0'
      }}>
        {/* Export Button */}
        <button
          onClick={() => {
            const workoutData = {
              version: '1.0.0',
              title: workoutTitle,
              cards: cards
            };
            const dataStr = JSON.stringify(workoutData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `${workoutTitle.replace(/\s+/g, '_')}_workout.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(100, 149, 237, 0.2)',
            color: 'rgba(100, 149, 237, 0.8)',
            border: '1px dotted rgba(100, 149, 237, 0.6)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(100, 149, 237, 0.3)';
            e.currentTarget.style.color = 'rgba(100, 149, 237, 1)';
            e.currentTarget.style.border = '1px dotted rgba(100, 149, 237, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(100, 149, 237, 0.2)';
            e.currentTarget.style.color = 'rgba(100, 149, 237, 0.8)';
            e.currentTarget.style.border = '1px dotted rgba(100, 149, 237, 0.6)';
          }}
        >
          💾 Export Workout
        </button>
        
        {/* Import Button */}
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  const content = event.target?.result;
                  if (typeof content === 'string') {
                    const workoutData = JSON.parse(content);
                    
                    // Validate basic structure
                    if (workoutData && Array.isArray(workoutData.cards)) {
                      if (confirm('Importing a workout will replace your current workout. Continue?')) {
                        // Use the importWorkout function from the store
                        importWorkout(workoutData.title || 'Imported Workout', workoutData.cards);
                      }
                    } else {
                      alert('Invalid workout file format');
                    }
                  }
                } catch (error) {
                  alert('Error parsing JSON file');
                  console.error(error);
                }
              };
              reader.readAsText(file);
            }
            // Reset the file input
            if (e.target) {
              e.target.value = '';
            }
          }}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(106, 168, 79, 0.2)',
            color: 'rgba(106, 168, 79, 0.8)',
            border: '1px dotted rgba(106, 168, 79, 0.6)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(106, 168, 79, 0.3)';
            e.currentTarget.style.color = 'rgba(106, 168, 79, 1)';
            e.currentTarget.style.border = '1px dotted rgba(106, 168, 79, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(106, 168, 79, 0.2)';
            e.currentTarget.style.color = 'rgba(106, 168, 79, 0.8)';
            e.currentTarget.style.border = '1px dotted rgba(106, 168, 79, 0.6)';
          }}
        >
          📥 Import Workout
        </button>
        
        {/* Clear Workout Button */}
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
            justifyContent: 'center',
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
