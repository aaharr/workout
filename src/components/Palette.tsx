import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';

const Palette: React.FC = () => {
  return (
    <div style={{ 
      padding: '72px 16px 16px 16px', 
      color: 'white',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Cardio Category */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '10px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#ff6b6b' }}>Cardio</h4>
        
        {/* Warmup */}
        <Droppable droppableId="palette-cardio-warmup" isDropDisabled={true}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <Draggable draggableId="cardio-warmup-template" index={0}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      padding: '8px',
                      margin: '8px 0',
                      border: '1px solid #ffa500',
                      borderRadius: '4px',
                      backgroundColor: '#fff3e0',
                      color: 'black',
                      ...provided.draggableProps.style
                    }}
                  >
                    Warmup
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        
        {/* Cooldown */}
        <Droppable droppableId="palette-cardio-cooldown" isDropDisabled={true}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <Draggable draggableId="cardio-cooldown-template" index={1}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      padding: '8px',
                      margin: '8px 0',
                      border: '1px solid #4169e1',
                      borderRadius: '4px',
                      backgroundColor: '#e3f2fd',
                      color: 'black',
                      ...provided.draggableProps.style
                    }}
                  >
                    Cooldown
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        
        {/* Interval */}
        <Droppable droppableId="palette-cardio-interval" isDropDisabled={true}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <Draggable draggableId="cardio-interval-template" index={2}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      padding: '8px',
                      margin: '8px 0',
                      border: '1px solid #ff6b6b',
                      borderRadius: '4px',
                      backgroundColor: '#ffe6e6',
                      color: 'black',
                      ...provided.draggableProps.style
                    }}
                  >
                    Interval
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      
      {/* Strength Category */}
      <div style={{ 
        padding: '10px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#4ecdc4' }}>Strength</h4>
        
        {/* Set */}
        <Droppable droppableId="palette-strength-set" isDropDisabled={true}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <Draggable draggableId="strength-set-template" index={0}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      padding: '8px',
                      margin: '8px 0',
                      border: '1px solid #4ecdc4',
                      borderRadius: '4px',
                      backgroundColor: '#e0f7fa',
                      color: 'black',
                      ...provided.draggableProps.style
                    }}
                  >
                    Set
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        
        {/* Rest */}
        <Droppable droppableId="palette-strength-rest" isDropDisabled={true}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <Draggable draggableId="strength-rest-template" index={1}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      padding: '8px',
                      margin: '8px 0',
                      border: '1px solid #9b59b6',
                      borderRadius: '4px',
                      backgroundColor: '#f3e5f5',
                      color: 'black',
                      ...provided.draggableProps.style
                    }}
                  >
                    Rest
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      
      {/* Help Text - Anchored to the bottom */}
      <div style={{ 
        marginTop: 'auto',
        padding: '16px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ 
          padding: '16px', 
          textAlign: 'center', 
          color: '#888',
          fontSize: '14px'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
            Welcome to your workout planner!
          </p>
          <p style={{ margin: '0 0 4px 0' }}>
            1. Drag a block from the palette above
          </p>
          <p style={{ margin: '0' }}>
            2. Click on any block to edit its details
          </p>
        </div>
      </div>
    </div>
  );
};

export default Palette;
