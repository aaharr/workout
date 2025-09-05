import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import Palette from './components/Palette';
import Timeline from './components/Timeline';
import Inspector from './components/Inspector';
import { useStore } from './store/useStore';

function App() {
  const { handleDragEnd } = useStore();

  const onDragEnd = (result: DropResult) => {
    handleDragEnd(result);
  };

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
