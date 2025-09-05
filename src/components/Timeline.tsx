import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useStore } from '../store/useStore';

const Timeline: React.FC = () => {
  const { cards, setSelectedCardId, deleteCard, workoutTitle, updateWorkoutTitle } = useStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(workoutTitle);
  
  const getCardStyle = (card: any) => {
    if (card.type === 'lifting') {
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
    <div style={{ padding: '16px', color: 'white' }}>
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
            color: 'white',
            background: 'transparent',
            border: '2px solid #666',
            borderRadius: '4px',
            padding: '4px 8px',
            width: '100%',
            marginBottom: '16px'
          }}
        />
      ) : (
        <h3 
          onClick={() => {
            setTempTitle(workoutTitle);
            setIsEditingTitle(true);
          }}
          style={{
            cursor: 'pointer',
            marginBottom: '16px',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block',
            minWidth: '200px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#333';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {workoutTitle}
        </h3>
      )}
      <Droppable droppableId="timeline">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ minHeight: '200px', border: '2px dashed #ccc', padding: '8px' }}
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
                      ...getCardStyle(card),
                      ...provided.draggableProps.style
                    }}
                    onMouseEnter={(e) => {
                      const deleteButton = e.currentTarget.querySelector('.delete-button') as HTMLElement;
                      if (deleteButton) deleteButton.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      const deleteButton = e.currentTarget.querySelector('.delete-button') as HTMLElement;
                      if (deleteButton) deleteButton.style.opacity = '0';
                    }}
                  >
                    {card.text}
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCard(card.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        opacity: '0',
                        transition: 'opacity 0.2s',
                        fontSize: '14px',
                        padding: '2px 5px',
                        borderRadius: '3px',
                        backgroundColor: '#ff4444',
                        color: 'white'
                      }}
                    >
                      🗑️
                    </button>
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
