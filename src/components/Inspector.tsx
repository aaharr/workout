import React, { useRef } from 'react';
import { useStore } from '../store/useStore';
import type { Card } from '../store/useStore';
import type { WorkoutSchema } from '../types/WorkoutSchema';
import { CURRENT_VERSION } from '../types/WorkoutSchema';

const Inspector: React.FC = () => {
  const { cards: blocks, selectedCardIds: selectedBlockIds, updateCardText: updateBlockText, updateCardCue: updateBlockCue, updateCardDuration: updateBlockDuration, updateCardReps: updateBlockReps, updateCardWeight: updateBlockWeight, updateCardZone: updateBlockZone, updateCardHr: updateBlockHr, updateCardCadence: updateBlockCadence, clearAllCards: clearAllBlocks, workoutTitle, updateWorkoutTitle, importWorkout } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // For now, only show inspector for single selection
  const selectedBlock = selectedBlockIds.length === 1 ? blocks.find(block => block.id === selectedBlockIds[0]) : null;
  
  return (
    <div style={{ 
      padding: '72px 16px 16px 16px', 
      color: 'white',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {selectedBlock ? (
          <>
            {/* Description Field */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Description</h4>
              <textarea
                value={selectedBlock.text}
                onChange={(e) => updateBlockText(selectedBlock.id, e.target.value)}
                style={{ width: '100%', minHeight: '60px', color: 'black', padding: '4px' }}
              />
            </div>
            
            {/* Cue Field - Always visible for all blocks */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Message</h4>
              <textarea
                value={selectedBlock.cue || ''}
                onChange={(e) => updateBlockCue(selectedBlock.id, e.target.value)}
                style={{ width: '100%', minHeight: '40px', color: 'black', padding: '4px' }}
                placeholder=""
              />
            </div>
            
            {/* Duration Field for Cardio */}
            {selectedBlock.type === 'cardio' && selectedBlock.duration !== undefined && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Minutes</h4>
                <input
                  type="number"
                  value={selectedBlock.duration ?? ''}
                  onChange={(e) => updateBlockDuration(selectedBlock.id, Number(e.target.value))}
                  min="1"
                  style={{ width: '100%', color: 'black', padding: '4px' }}
                />
              </div>
            )}
            
            {/* Zone Field for Interval */}
            {selectedBlock.type === 'cardio' && selectedBlock.cardioSubtype === 'interval' && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Zone</h4>
                <input
                  type="number"
                  value={selectedBlock.zone ?? 1}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Handle empty input by setting to default of 1
                    updateBlockZone(selectedBlock.id, value === '' ? 1 : Number(value));
                  }}
                  min="1"
                  max="6"
                  style={{ width: '100%', color: 'black', padding: '4px' }}
                />
              </div>
            )}
            
            {/* Heart Rate Field for Interval */}
            {selectedBlock.type === 'cardio' && selectedBlock.cardioSubtype === 'interval' && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Heart Rate</h4>
                <input
                  type="number"
                  value={selectedBlock.hr ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Handle empty input by setting to undefined
                    updateBlockHr(selectedBlock.id, value === '' ? undefined : Number(value));
                  }}
                  min="0"
                  style={{ width: '100%', color: 'black', padding: '4px' }}
                  placeholder="Enter heart rate"
                />
              </div>
            )}
            
            {/* Cadence Field for Interval */}
            {selectedBlock.type === 'cardio' && selectedBlock.cardioSubtype === 'interval' && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Cadence</h4>
                <input
                  type="number"
                  value={selectedBlock.cadence ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Handle empty input by setting to undefined
                    updateBlockCadence(selectedBlock.id, value === '' ? undefined : Number(value));
                  }}
                  min="0"
                  style={{ width: '100%', color: 'black', padding: '4px' }}
                  placeholder="Enter cadence"
                />
              </div>
            )}
            
            {/* Duration Field for Strength Rest */}
            {selectedBlock.type === 'strength' && selectedBlock.strengthSubtype === 'rest' && selectedBlock.duration !== undefined && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Duration (minutes):</h4>
                <input
                  type="number"
                  value={selectedBlock.duration ?? ''}
                  onChange={(e) => updateBlockDuration(selectedBlock.id, Number(e.target.value))}
                  min="1"
                  style={{ width: '100%', color: 'black', padding: '4px' }}
                />
              </div>
            )}
            
            {/* Reps and Weight Fields for Strength Set */}
            {selectedBlock.type === 'strength' && selectedBlock.strengthSubtype === 'set' && selectedBlock.reps !== undefined && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Reps:</h4>
                  <input
                    type="number"
                    value={selectedBlock.reps ?? ''}
                    onChange={(e) => updateBlockReps(selectedBlock.id, Number(e.target.value))}
                    min="1"
                    style={{ width: '100%', color: 'black', padding: '4px' }}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Weight (lbs):</h4>
                  <input
                    type="number"
                    value={selectedBlock.weight ?? ''}
                    onChange={(e) => updateBlockWeight(selectedBlock.id, Number(e.target.value))}
                    min="0"
                    style={{ width: '100%', color: 'black', padding: '4px' }}
                  />
                </div>
              </>
            )}
          </>
        ) : selectedBlockIds.length > 1 ? (
          <div style={{ padding: '16px', textAlign: 'center', color: '#888' }}>
            <p style={{ margin: '24px 0 8px 0', fontSize: '14px', fontStyle: 'italic' }}>
              {selectedBlockIds.length} blocks selected
            </p>
          </div>
        ) : (
          <div style={{ padding: '16px', textAlign: 'center', color: '#888' }}>
            <p style={{ margin: '24px 0 8px 0', fontSize: '14px', fontStyle: 'italic' }}>
              Select a block to edit its properties
            </p>
          </div>
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
            const workoutData: WorkoutSchema = {
              version: CURRENT_VERSION,
              title: workoutTitle,
              cards: blocks
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
                    const parsedData = JSON.parse(content);
                    const workoutData = parsedData as WorkoutSchema;
                    
                    // Simple check for basic structure
                    if (workoutData && Array.isArray(workoutData.cards)) {
                      if (confirm('Importing a workout will replace your current workout. Continue?')) {
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
              clearAllBlocks();
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
