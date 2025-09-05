import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useStore } from '../store/useStore';
import { Copy, Trash2 } from 'lucide-react';

const Timeline: React.FC = () => {
  const { cards, setSelectedCardId, deleteCard, duplicateCard, workoutTitle, updateWorkoutTitle, clearAllCards } = useStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(workoutTitle);
  
  const getCardStyle = (card: any) => {
    if (card.type === 'strength') {
      if (card.strengthSubtype === 'rest') {
        return {
          border: '1px solid #9b59b6',
          backgroundColor: '#f3e5f5',
        };
      }
      return {
        border: '1px solid #4ecdc4',
        backgroundColor: '#e0f7fa',
      };
    }
    
    // Cardio styles based on subtype
    switch (card.cardioSubtype) {
      case 'warmup':
        return {
          border: '1px solid #ffa500',
          backgroundColor: '#fff3e0',
        };
      case 'cooldown':
        return {
          border: '1px solid #4169e1',
          backgroundColor: '#e3f2fd',
        };
      case 'interval':
        return {
          border: '1px solid #ff6b6b',
          backgroundColor: '#ffe6e6',
        };
      default:
        return {
          border: '1px solid #ccc',
          backgroundColor: 'white',
        };
    }
  };

  const handleTitleSave = () => {
    updateWorkoutTitle(tempTitle);
    setIsEditingTitle(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setTempTitle(workoutTitle);
      setIsEditingTitle(false);
    }
  };

  return (
    <div style={{ 
      padding: '16px', 
      color: 'white',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        {isEditingTitle ? (
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleKeyPress}
            autoFocus
            style={{
              fontSize: '1.5em',
              fontWeight: 'bold',
              color: '#333',
              background: 'transparent',
              border: 'none',
              padding: '0',
              margin: '0',
              width: '100%',
              maxWidth: '400px',
              textAlign: 'center',
              outline: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
            }}
            placeholder="Workout Title"
          />
        ) : (
          <h3 
            onClick={() => {
              setTempTitle(workoutTitle);
              setIsEditingTitle(true);
            }}
            style={{
              cursor: 'pointer',
              margin: '0',
              padding: '0',
              display: 'block',
              color: '#333',
              backgroundColor: 'transparent',
              minHeight: '1.5em',
              border: 'none',
              fontSize: '1.5em',
              fontWeight: 'bold',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
              textAlign: 'center'
            }}
          >
            <style>
              {`
                ::-webkit-scrollbar {
                  display: none; /* Chrome, Safari and Opera */
                }
              `}
            </style>
            {workoutTitle || 'Workout Title'}
          </h3>
        )}
      </div>
      <Droppable droppableId="timeline">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flex: 1,
              padding: '8px',
              overflowY: 'auto',
              minHeight: '200px',
              scrollbarWidth: 'none',  /* Firefox */
              msOverflowStyle: 'none',  /* IE and Edge */
            }}
          >
            {cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => setSelectedCardId(card.id)}
                    style={{
                      padding: '8px',
                      margin: '8px 0',
                      borderRadius: '4px',
                      color: 'black',
                      cursor: 'pointer',
                      position: 'relative',
                      minHeight: card.duration ? `${Math.max(20, card.duration * 10)}px` : 'auto',
                      marginRight: '72px', // Make space for the action buttons
                      ...getCardStyle(card),
                      ...provided.draggableProps.style
                    }}
                    onMouseEnter={(e) => {
                      const actionsContainer = e.currentTarget.querySelector('.card-actions') as HTMLElement;
                      if (actionsContainer) actionsContainer.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      const actionsContainer = e.currentTarget.querySelector('.card-actions') as HTMLElement;
                      if (actionsContainer) actionsContainer.style.opacity = '0';
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', height: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1 }}>{card.text}</div>
                        {card.duration && (
                          <div style={{ fontSize: '12px', opacity: 0.8, whiteSpace: 'nowrap' }}>
                            {card.duration} min
                          </div>
                        )}
                        {card.reps && (
                          <div style={{ fontSize: '12px', opacity: 0.8, whiteSpace: 'nowrap' }}>
                            {card.reps} reps
                          </div>
                        )}
                        {card.weight && (
                          <div style={{ fontSize: '12px', opacity: 0.8, whiteSpace: 'nowrap' }}>
                            {card.weight} lbs
                          </div>
                        )}
                      </div>
                      {card.cue && (
                        <div style={{ fontSize: '12px', opacity: 0.7, fontStyle: 'italic' }}>
                          {card.cue}
                        </div>
                      )}
                    </div>
                    {/* Action buttons container */}
                    <div
                      className="card-actions"
                      style={{
                        position: 'absolute',
                        right: '-72px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        opacity: '0',
                        transition: 'opacity 0.2s',
                        pointerEvents: 'none'
                      }}
                    >
                      <button
                        className="duplicate-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateCard(card.id);
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          border: '1px solid rgba(0, 0, 0, 0.2)',
                          cursor: 'pointer',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '4px',
                          color: 'black',
                          pointerEvents: 'auto'
                        }}
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCard(card.id);
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          border: '1px solid rgba(0, 0, 0, 0.2)',
                          cursor: 'pointer',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '4px',
                          color: 'black',
                          pointerEvents: 'auto'
                        }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Timeline;
