import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';

const Palette: React.FC = () => {
  return (
    <div style={{ padding: '16px', color: 'white' }}>
      <h3>Palette</h3>
      <Droppable droppableId="palette" isDropDisabled={true}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <Draggable draggableId="card-template" index={0}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    padding: '8px',
                    margin: '8px 0',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    color: 'black',
                    ...provided.draggableProps.style
                  }}
                >
                  Card Template
                </div>
              )}
            </Draggable>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Palette;
