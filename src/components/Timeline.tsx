import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useStore } from '../store/useStore';

const Timeline: React.FC = () => {
  const { cards, setSelectedCardId } = useStore();
  
  return (
    <div style={{ padding: '16px', color: 'white' }}>
      <h3>Timeline</h3>
      <Droppable droppableId="timeline">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ minHeight: '200px', border: '2px dashed #ccc', padding: '8px' }}
          >
            {cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => setSelectedCardId(card.id)}
                    style={{
                      padding: '8px',
                      margin: '8px 0',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      color: 'black',
                      cursor: 'pointer',
                      ...provided.draggableProps.style
                    }}
                  >
                    {card.text}
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
