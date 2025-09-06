import React, { useRef } from 'react';
import { useStore } from '../store/useStore';
import type { Card } from '../store/useStore';
import type { WorkoutSchema } from '../types/WorkoutSchema';
import { CURRENT_VERSION } from '../types/WorkoutSchema';

const Inspector: React.FC = () => {
  const { cards: blocks, selectedCardIds: selectedBlockIds, updateCardText: updateBlockText, updateCardCue: updateBlockCue, updateCardDuration: updateBlockDuration, updateCardReps: updateBlockReps, updateCardWeight: updateBlockWeight, updateCardZone: updateBlockZone, updateCardHr: updateBlockHr, updateCardCadence: updateBlockCadence, clearAllCards: clearAllBlocks, workoutTitle, updateWorkoutTitle, importWorkout, addCard } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zwiftFileInputRef = useRef<HTMLInputElement>(null);
  
  // Get all selected blocks
  const selectedBlocks = blocks.filter(block => selectedBlockIds.includes(block.id));
  
  // Check if all selected blocks are of the same type and subtype
  const areAllSameType = selectedBlocks.length > 0 && 
    selectedBlocks.every(block => 
      block.type === selectedBlocks[0].type && 
      block.cardioSubtype === selectedBlocks[0].cardioSubtype && 
      block.strengthSubtype === selectedBlocks[0].strengthSubtype
    );
  
  // Use the first selected block for display when all are the same type
  const firstSelectedBlock = selectedBlocks.length > 0 ? selectedBlocks[0] : null;
  
  // Helper functions to update all selected blocks
  const updateAllSelectedText = (text: string) => {
    selectedBlockIds.forEach(id => updateBlockText(id, text));
  };
  
  const updateAllSelectedCue = (cue: string) => {
    selectedBlockIds.forEach(id => updateBlockCue(id, cue));
  };
  
  const updateAllSelectedDuration = (duration: number) => {
    selectedBlockIds.forEach(id => updateBlockDuration(id, duration));
  };
  
  const updateAllSelectedReps = (reps: number) => {
    selectedBlockIds.forEach(id => updateBlockReps(id, reps));
  };
  
  const updateAllSelectedWeight = (weight: number) => {
    selectedBlockIds.forEach(id => updateBlockWeight(id, weight));
  };
  
  const updateAllSelectedZone = (zone: number) => {
    selectedBlockIds.forEach(id => updateBlockZone(id, zone));
  };
  
  const updateAllSelectedHr = (hr: number | undefined) => {
    selectedBlockIds.forEach(id => updateBlockHr(id, hr));
  };
  
  const updateAllSelectedCadence = (cadence: number | undefined) => {
    selectedBlockIds.forEach(id => updateBlockCadence(id, cadence));
  };
  
  // Helper function to generate Zwift workout XML
  const generateZwiftWorkout = (title: string, cards: Card[]): string => {
    const workoutElements = cards
      .filter(card => card.type === 'cardio' && card.duration)
      .map(card => {
        // Convert duration from minutes to seconds
        const duration = Math.round((card.duration || 0) * 60);
        // Map zone to power (simplified mapping)
        const power = card.zone ? (0.4 + (card.zone - 1) * 0.1).toFixed(2) : '0.50';
        return `<SteadyState Duration="${duration}" Power="${power}"/>`;
      })
      .join('\n        ');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<workout_file>
    <author>Workout Builder</author>
    <name>${title}</name>
    <description>${title}</description>
    <sportType>bike</sportType>
    <tags/>
    <workout>
        ${workoutElements}
    </workout>
</workout_file>`;
  };

  // Helper function to parse Zwift workout XML
  const parseZwiftWorkout = (xmlContent: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      
      const nameElement = xmlDoc.querySelector('name');
      const title = nameElement?.textContent || 'Imported Zwift Workout';
      
      const workoutElement = xmlDoc.querySelector('workout');
      const steadyStateElements = workoutElement?.querySelectorAll('SteadyState');
      
      if (!steadyStateElements || steadyStateElements.length === 0) {
        alert('No valid workout segments found in the Zwift file');
        return;
      }
      
      // Clear existing workout
      clearAllBlocks();
      updateWorkoutTitle(title);
      
      // Add each segment as a cardio interval block
      Array.from(steadyStateElements).forEach((element, index) => {
        const durationAttr = element.getAttribute('Duration');
        const powerAttr = element.getAttribute('Power');
        
        if (durationAttr) {
          const durationMinutes = Math.round(parseInt(durationAttr) / 60);
          // Convert power to zone (simplified mapping)
          const power = powerAttr ? parseFloat(powerAttr) : 0.5;
          const zone = Math.min(6, Math.max(1, Math.round((power - 0.4) / 0.1) + 1));
          
          const newCard: Card = {
            id: `card-${Date.now()}-${index}`,
            text: `Interval Zone ${zone}`,
            type: 'cardio',
            cardioSubtype: 'interval',
            duration: durationMinutes,
            zone: zone
          };
          addCard(newCard);
        }
      });
      
    } catch (error) {
      alert('Error parsing Zwift workout file');
      console.error(error);
    }
  };

  return (
    <div style={{ 
      padding: '72px 16px 16px 16px', 
      color: 'white',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {selectedBlockIds.length === 1 && firstSelectedBlock ? (
          // Single selection - original logic
          <>
            {/* Description Field */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Description</h4>
              <textarea
                value={firstSelectedBlock.text}
                onChange={(e) => updateBlockText(firstSelectedBlock.id, e.target.value)}
                style={{ width: '100%', minHeight: '60px', color: 'black', padding: '4px' }}
              />
            </div>
            
            {/* Cue Field - Always visible for all blocks */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Message</h4>
              <textarea
                value={firstSelectedBlock.cue || ''}
                onChange={(e) => updateBlockCue(firstSelectedBlock.id, e.target.value)}
                style={{ width: '100%', minHeight: '40px', color: 'black', padding: '4px' }}
                placeholder=""
              />
            </div>
            
            {/* Duration Field for Cardio */}
            {firstSelectedBlock.type === 'cardio' && firstSelectedBlock.duration !== undefined && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Minutes</h4>
                <input
                  type="number"
                  value={firstSelectedBlock.duration ?? ''}
                  onChange={(e) => updateBlockDuration(firstSelectedBlock.id, Number(e.target.value))}
                  min="1"
                  style={{ width: '100%', color: 'black', padding: '4px' }}
                />
              </div>
            )}
            
            {/* Zone Field for Interval */}
            {firstSelectedBlock.type === 'cardio' && firstSelectedBlock.cardioSubtype === 'interval' && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Zone</h4>
                <input
                  type="number"
                  value={firstSelectedBlock.zone ?? 1}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateBlockZone(firstSelectedBlock.id, value === '' ? 1 : Number(value));
                  }}
                  min="1"
                  max="6"
                  style={{ width: '100%', color: 'black', padding: '4px' }}
                />
              </div>
            )}
            
            {/* Heart Rate Field for Interval */}
            {firstSelectedBlock.type === 'cardio' && firstSelectedBlock.cardioSubtype === 'interval' && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Heart Rate</h4>
                <input
                  type="number"
                  value={firstSelectedBlock.hr ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateBlockHr(firstSelectedBlock.id, value === '' ? undefined : Number(value));
                  }}
                  min="0"
                  style={{ width: '100%', color: 'black', padding: '4px' }}
                  placeholder="Enter heart rate"
                />
              </div>
            )}
            
            {/* Cadence Field for Interval */}
            {firstSelectedBlock.type === 'cardio' && firstSelectedBlock.cardioSubtype === 'interval' && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Cadence</h4>
                <input
                  type="number"
                  value={firstSelectedBlock.cadence ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateBlockCadence(firstSelectedBlock.id, value === '' ? undefined : Number(value));
                  }}
                  min="0"
                  style={{ width: '100%', color: 'black', padding: '4px' }}
                  placeholder="Enter cadence"
                />
              </div>
            )}
            
            {/* Duration Field for Strength Rest */}
            {firstSelectedBlock.type === 'strength' && firstSelectedBlock.strengthSubtype === 'rest' && firstSelectedBlock.duration !== undefined && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Duration (minutes):</h4>
                <input
                  type="number"
                  value={firstSelectedBlock.duration ?? ''}
                  onChange={(e) => updateBlockDuration(firstSelectedBlock.id, Number(e.target.value))}
                  min="1"
                  style={{ width: '100%', color: 'black', padding: '4px' }}
                />
              </div>
            )}
            
            {/* Reps and Weight Fields for Strength Set */}
            {firstSelectedBlock.type === 'strength' && firstSelectedBlock.strengthSubtype === 'set' && firstSelectedBlock.reps !== undefined && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Reps:</h4>
                  <input
                    type="number"
                    value={firstSelectedBlock.reps ?? ''}
                    onChange={(e) => updateBlockReps(firstSelectedBlock.id, Number(e.target.value))}
                    min="1"
                    style={{ width: '100%', color: 'black', padding: '4px' }}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Weight (lbs):</h4>
                  <input
                    type="number"
                    value={firstSelectedBlock.weight ?? ''}
                    onChange={(e) => updateBlockWeight(firstSelectedBlock.id, Number(e.target.value))}
                    min="0"
                    style={{ width: '100%', color: 'black', padding: '4px' }}
                  />
                </div>
              </>
            )}
          </>
        ) : selectedBlockIds.length > 1 ? (
          areAllSameType && firstSelectedBlock ? (
            // Multiple selection of same type - show all relevant fields for the type, update all on change
            <>
              {/* Description Field */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Description</h4>
                <textarea
                  value={firstSelectedBlock.text}
                  onChange={(e) => updateAllSelectedText(e.target.value)}
                  style={{ width: '100%', minHeight: '60px', color: 'black', padding: '4px' }}
                />
              </div>
              
              {/* Cue Field - Always visible for all blocks */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Message</h4>
                <textarea
                  value={firstSelectedBlock.cue || ''}
                  onChange={(e) => updateAllSelectedCue(e.target.value)}
                  style={{ width: '100%', minHeight: '40px', color: 'black', padding: '4px' }}
                  placeholder=""
                />
              </div>
              
              {/* Duration Field for Cardio */}
              {firstSelectedBlock.type === 'cardio' && firstSelectedBlock.duration !== undefined && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Minutes</h4>
                  <input
                    type="number"
                    value={firstSelectedBlock.duration ?? ''}
                    onChange={(e) => updateAllSelectedDuration(Number(e.target.value))}
                    min="1"
                    style={{ width: '100%', color: 'black', padding: '4px' }}
                  />
                </div>
              )}
              
              {/* Zone Field for Interval */}
              {firstSelectedBlock.type === 'cardio' && firstSelectedBlock.cardioSubtype === 'interval' && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Zone</h4>
                  <input
                    type="number"
                    value={firstSelectedBlock.zone ?? 1}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateAllSelectedZone(value === '' ? 1 : Number(value));
                    }}
                    min="1"
                    max="6"
                    style={{ width: '100%', color: 'black', padding: '4px' }}
                  />
                </div>
              )}
              
              {/* Heart Rate Field for Interval */}
              {firstSelectedBlock.type === 'cardio' && firstSelectedBlock.cardioSubtype === 'interval' && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Heart Rate</h4>
                  <input
                    type="number"
                    value={firstSelectedBlock.hr ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateAllSelectedHr(value === '' ? undefined : Number(value));
                    }}
                    min="0"
                    style={{ width: '100%', color: 'black', padding: '4px' }}
                    placeholder="Enter heart rate"
                  />
                </div>
              )}
              
              {/* Cadence Field for Interval */}
              {firstSelectedBlock.type === 'cardio' && firstSelectedBlock.cardioSubtype === 'interval' && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Cadence</h4>
                  <input
                    type="number"
                    value={firstSelectedBlock.cadence ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateAllSelectedCadence(value === '' ? undefined : Number(value));
                    }}
                    min="0"
                    style={{ width: '100%', color: 'black', padding: '4px' }}
                    placeholder="Enter cadence"
                  />
                </div>
              )}
              
              {/* Duration Field for Strength Rest */}
              {firstSelectedBlock.type === 'strength' && firstSelectedBlock.strengthSubtype === 'rest' && firstSelectedBlock.duration !== undefined && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Duration (minutes):</h4>
                  <input
                    type="number"
                    value={firstSelectedBlock.duration ?? ''}
                    onChange={(e) => updateAllSelectedDuration(Number(e.target.value))}
                    min="1"
                    style={{ width: '100%', color: 'black', padding: '4px' }}
                  />
                </div>
              )}
              
              {/* Reps and Weight Fields for Strength Set */}
              {firstSelectedBlock.type === 'strength' && firstSelectedBlock.strengthSubtype === 'set' && firstSelectedBlock.reps !== undefined && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Reps:</h4>
                    <input
                      type="number"
                      value={firstSelectedBlock.reps ?? ''}
                      onChange={(e) => updateAllSelectedReps(Number(e.target.value))}
                      min="1"
                      style={{ width: '100%', color: 'black', padding: '4px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ margin: '0 0 4px 0', color: '#888888' }}>Weight (lbs):</h4>
                    <input
                      type="number"
                      value={firstSelectedBlock.weight ?? ''}
                      onChange={(e) => updateAllSelectedWeight(Number(e.target.value))}
                      min="0"
                      style={{ width: '100%', color: 'black', padding: '4px' }}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            // Multiple selection of different types
            <div style={{ padding: '16px', textAlign: 'center', color: '#888' }}>
              <p style={{ margin: '24px 0 8px 0', fontSize: '14px', fontStyle: 'italic' }}>
                {selectedBlockIds.length} blocks selected
              </p>
              <p style={{ margin: '8px 0', fontSize: '12px', color: '#ff6b6b' }}>
                Multiple block types selected - cannot edit
              </p>
            </div>
          )
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

        {/* Zwift Export Button */}
        <button
          onClick={() => {
            // Convert blocks to Zwift format
            const zwiftWorkout = generateZwiftWorkout(workoutTitle, blocks);
            const dataStr = zwiftWorkout;
            const dataUri = 'data:application/xml;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `${workoutTitle.replace(/\s+/g, '_')}_zwift_workout.zwo`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(255, 165, 0, 0.2)',
            color: 'rgba(255, 165, 0, 0.8)',
            border: '1px dotted rgba(255, 165, 0, 0.6)',
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
            e.currentTarget.style.backgroundColor = 'rgba(255, 165, 0, 0.3)';
            e.currentTarget.style.color = 'rgba(255, 165, 0, 1)';
            e.currentTarget.style.border = '1px dotted rgba(255, 165, 0, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 165, 0, 0.2)';
            e.currentTarget.style.color = 'rgba(255, 165, 0, 0.8)';
            e.currentTarget.style.border = '1px dotted rgba(255, 165, 0, 0.6)';
          }}
        >
          🚴 Export to Zwift (.zwo)
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

        {/* Zwift Import Button */}
        <input
          type="file"
          accept=".zwo"
          ref={zwiftFileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  const content = event.target?.result;
                  if (typeof content === 'string') {
                    parseZwiftWorkout(content);
                  }
                } catch (error) {
                  alert('Error parsing Zwift workout file');
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
          onClick={() => zwiftFileInputRef.current?.click()}
          style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(255, 140, 0, 0.2)',
            color: 'rgba(255, 140, 0, 0.8)',
            border: '1px dotted rgba(255, 140, 0, 0.6)',
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
            e.currentTarget.style.backgroundColor = 'rgba(255, 140, 0, 0.3)';
            e.currentTarget.style.color = 'rgba(255, 140, 0, 1)';
            e.currentTarget.style.border = '1px dotted rgba(255, 140, 0, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 140, 0, 0.2)';
            e.currentTarget.style.color = 'rgba(255, 140, 0, 0.8)';
            e.currentTarget.style.border = '1px dotted rgba(255, 140, 0, 0.6)';
          }}
        >
          🚴 Import from Zwift (.zwo)
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
