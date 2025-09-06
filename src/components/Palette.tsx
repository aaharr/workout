import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';

const Palette: React.FC = () => {
  return (
    <div style={{ 
      padding: '8px', 
      color: 'white',
      height: '100%',
      display: 'flex',
      flexDirection: window.innerWidth < 768 ? 'row' : 'column',
      alignItems: window.innerWidth < 768 ? 'center' : 'stretch',
      gap: '8px',
      overflowX: window.innerWidth < 768 ? 'auto' : 'visible',
      overflowY: window.innerWidth < 768 ? 'hidden' : 'auto'
    }}>
      
      {/* Cardio Category */}
      {window.innerWidth >= 768 ? (
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
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
                        border: '1px solid #9e9e9e',
                        borderRadius: '4px',
                        backgroundColor: '#f5f5f5',
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
          
          {/* Interval */}
          <Droppable droppableId="palette-cardio-interval" isDropDisabled={true}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <Draggable draggableId="cardio-interval-template" index={1}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: '8px',
                        margin: '8px 0',
                        border: '1px solid #2196f3',
                        borderRadius: '4px',
                        backgroundColor: '#e3f2fd',
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
          
          {/* Cooldown */}
          <Droppable droppableId="palette-cardio-cooldown" isDropDisabled={true}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <Draggable draggableId="cardio-cooldown-template" index={2}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: '8px',
                        margin: '8px 0',
                        border: '1px solid #9e9e9e',
                        borderRadius: '4px',
                        backgroundColor: '#f5f5f5',
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
        </div>
      ) : (
        // Mobile layout for cardio blocks
        <div style={{ 
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          padding: '4px'
        }}>
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
                        padding: '6px 8px',
                        border: '1px solid #9e9e9e',
                        borderRadius: '4px',
                        backgroundColor: '#f5f5f5',
                        color: 'black',
                        fontSize: '12px',
                        minWidth: '60px',
                        textAlign: 'center',
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
          
          {/* Interval */}
          <Droppable droppableId="palette-cardio-interval" isDropDisabled={true}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <Draggable draggableId="cardio-interval-template" index={1}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: '6px 8px',
                        border: '1px solid #2196f3',
                        borderRadius: '4px',
                        backgroundColor: '#e3f2fd',
                        color: 'black',
                        fontSize: '12px',
                        minWidth: '60px',
                        textAlign: 'center',
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
          
          {/* Cooldown */}
          <Droppable droppableId="palette-cardio-cooldown" isDropDisabled={true}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <Draggable draggableId="cardio-cooldown-template" index={2}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: '6px 8px',
                        border: '1px solid #9e9e9e',
                        borderRadius: '4px',
                        backgroundColor: '#f5f5f5',
                        color: 'black',
                        fontSize: '12px',
                        minWidth: '60px',
                        textAlign: 'center',
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
        </div>
      )}
      
      {/* Strength Category */}
      {window.innerWidth >= 768 ? (
        <div style={{ 
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
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
      ) : (
        // Mobile layout for strength blocks
        <div style={{ 
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          padding: '4px'
        }}>
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
                        padding: '6px 8px',
                        border: '1px solid #4ecdc4',
                        borderRadius: '4px',
                        backgroundColor: '#e0f7fa',
                        color: 'black',
                        fontSize: '12px',
                        minWidth: '40px',
                        textAlign: 'center',
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
                        padding: '6px 8px',
                        border: '1px solid #9b59b6',
                        borderRadius: '4px',
                        backgroundColor: '#f3e5f5',
                        color: 'black',
                        fontSize: '12px',
                        minWidth: '40px',
                        textAlign: 'center',
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
      )}
      
      {/* Help Text - Only show on desktop */}
      {window.innerWidth >= 768 && (
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
            <p style={{ margin: '0 0 4px 0' }}>
              Drag a block from the palette above to get started!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Palette;
