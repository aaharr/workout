import React, { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import Palette from './components/Palette';
import Timeline from './components/Timeline';
import Inspector from './components/Inspector';
import { useStore } from './store/useStore';

function App() {
  const { handleDragEnd } = useStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showInspectorModal, setShowInspectorModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onDragEnd = (result: DropResult) => {
    handleDragEnd(result);
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {/* Timeline takes up most of the screen */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Timeline onBlockClick={() => setShowInspectorModal(true)} />
          </div>
          
          {/* Docked palette at the bottom */}
          <div style={{ 
            height: '80px', 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            overflowX: 'auto',
            overflowY: 'hidden'
          }}>
            <Palette />
          </div>
        </DragDropContext>
        
        {/* Inspector Modal */}
        {showInspectorModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              marginTop: 'auto',
              backgroundColor: '#2a2a2a',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              maxHeight: '80%',
              overflow: 'auto'
            }}>
              <div style={{
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ margin: 0, color: 'white' }}>Edit Block</h3>
                <button 
                  onClick={() => setShowInspectorModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
              <Inspector />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop layout remains the same
  return (
    <div style={{ height: '100vh' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <PanelGroup direction="horizontal">
          {/* Left Panel - Palette */}
          <Panel defaultSize={20} minSize={10}>
            <Palette />
          </Panel>
          
          <PanelResizeHandle style={{ width: '12px', background: 'rgba(255, 255, 255, 0.1)', cursor: 'col-resize' }} />
          
          {/* Center Panel - Timeline */}
          <Panel defaultSize={60} minSize={30}>
            <Timeline onBlockClick={() => {}} />
          </Panel>
          
          <PanelResizeHandle style={{ width: '12px', background: 'rgba(255, 255, 255, 0.1)', cursor: 'col-resize' }} />
          
          {/* Right Panel - Inspector */}
          <Panel defaultSize={20} minSize={10}>
            <Inspector />
          </Panel>
        </PanelGroup>
      </DragDropContext>
    </div>
  );
}

export default App;
