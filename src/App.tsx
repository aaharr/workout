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

  if (isMobile) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <PanelGroup direction="vertical">
            {/* Top Panel - Palette */}
            <Panel defaultSize={20} minSize={10}>
              <Palette />
            </Panel>
            
            <PanelResizeHandle style={{ height: '12px', background: 'rgba(255, 255, 255, 0.1)', cursor: 'row-resize' }} />
            
            {/* Middle Panel - Timeline */}
            <Panel defaultSize={60} minSize={30}>
              <Timeline />
            </Panel>
            
            <PanelResizeHandle style={{ height: '12px', background: 'rgba(255, 255, 255, 0.1)', cursor: 'row-resize' }} />
            
            {/* Bottom Panel - Inspector */}
            <Panel defaultSize={20} minSize={10}>
              <Inspector />
            </Panel>
          </PanelGroup>
        </DragDropContext>
      </div>
    );
  }

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
            <Timeline />
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
