# Workout Builder Application Specification

## Overview
A comprehensive drag-and-drop workout builder application that enables users to create, customize, and manage cardio and strength training workouts through an intuitive visual interface. The application supports both desktop and mobile experiences with responsive design.

## Technology Stack
- **Frontend Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.2
- **State Management**: Zustand 5.0.8 with sessionStorage persistence
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- **UI Components**: Custom CSS with responsive design
- **Icons**: Lucide React 0.542.0
- **Resizable Panels**: react-resizable-panels 3.0.5
- **Deployment**: GitHub Pages with base path configuration

## Core Features

### 1. Workout Composition System
- **Card Types**:
  - Cardio: Warmup, Interval, Cooldown
  - Strength: Set, Rest
- **Block Properties**:
  - Description text (required)
  - Duration (minutes for cardio and rest blocks)
  - Reps (for strength sets)
  - Weight (lbs for strength sets)
  - Zone (1-6 for cardio intervals)
  - Heart rate (bpm, optional)
  - Cadence (rpm, optional)
  - Custom message/cue (optional instructional text)

### 2. Advanced Drag & Drop Interface using dnd-kit
- **Drag Sources**: Palette items with visual feedback
- **Drop Targets**: Timeline area with insertion indicators
- **Sortable Containers**: Reordering within the timeline
- **Touch Support**: Full mobile touch interactions
- **Accessibility**: Keyboard navigation and screen reader support
- **Custom Sensors**: Mouse, touch, and keyboard sensors

### 3. Multi-Selection & Bulk Editing
- **Selection Methods**:
  - Shift+click for range selection
  - Ctrl/Cmd+click for multi-selection
  - Click for single selection
- **Bulk Operations**:
  - Edit common properties across selected blocks
  - Delete multiple blocks
  - Duplicate multiple blocks
- **Visual Feedback**: Highlighted borders and background for selected items

### 4. Responsive Design System
- **Desktop Layout**: Three-panel layout (Palette 20%, Timeline 60%, Inspector 20%)
- **Mobile Layout**: 
  - Timeline-focused view
  - Bottom-docked palette
  - Modal inspector panel
- **Breakpoints**: 
  - Mobile: < 768px width
  - Desktop: ≥ 768px width
- **Touch Optimization**: Larger touch targets, swipe gestures

### 5. Import/Export Functionality
- **JSON Format**: Full workout state preservation
- **Zwift Integration**:
  - Export to .zwo format for cardio workouts
  - Basic import from .zwo files
- **File Validation**: Schema validation and error handling
- **Versioning**: Workout schema version management

### 6. Workout Management Features
- **Editable Title**: In-place editing with validation
- **Block Operations**:
  - Individual block duplication and deletion
  - Multi-block operations
  - Clear entire workout with confirmation
- **Undo/Redo**: History tracking for user actions
- **Workout Statistics**: Total duration, exercise count summary

### 7. User Interface Components
- **Palette**: Categorized draggable templates with visual styling
- **Timeline**: Main workout construction area with visual indicators
- **Inspector**: Context-aware property editor based on selection
- **Action Buttons**: Contextual hover actions for blocks
- **Modal Dialogs**: Mobile-optimized editing interfaces

## Application Architecture

### State Management
- **Zustand Store**: Centralized state with session persistence
- **State Structure**:
  - Workout cards array with full block data
  - Selected card IDs array
  - Workout title string
  - UI state (mobile detection, modal visibility)
- **Actions**: Complete CRUD operations for all workout elements

### Component Hierarchy
```
App
├── PanelGroup (react-resizable-panels)
│   ├── Palette (DndContext, Draggable)
│   ├── Timeline (Droppable, SortableContext, SortableItem)
│   └── Inspector (Property editors, Action buttons)
└── ModalOverlay (Mobile inspector)
```

### Data Model
```typescript
interface Card {
  id: string;
  text: string;
  cue?: string;
  type: 'cardio' | 'strength';
  cardioSubtype?: 'warmup' | 'cooldown' | 'interval';
  strengthSubtype?: 'set' | 'rest';
  duration?: number;
  reps?: number;
  weight?: number;
  zone?: number;
  hr?: number;
  cadence?: number;
}

interface WorkoutSchema {
  version: string;
  title: string;
  cards: Card[];
}

// Current version constant
export const CURRENT_VERSION = '1.0.0';
```

### File Structure
```
src/
  components/
    Palette.tsx           # Draggable block templates
    Timeline.tsx          # Main workout area with sortable items
    Inspector.tsx         # Property editor and actions
  store/
    useStore.ts          # Zustand store with actions
  types/
    WorkoutSchema.ts     # Type definitions
  hooks/
    useMobileDetection.ts # Responsive layout hooks
  utils/
    zwiftParser.ts       # Zwift file import/export utilities
    validation.ts        # Data validation helpers
  App.tsx
  main.tsx
  index.css
```

## UI/UX Design Specifications

### Color Scheme
- **Cardio Blocks**: 
  - Warmup/Cooldown: Gray theme (#9e9e9e border, #f5f5f5 background)
  - Interval: Zone-based colors (1-6: Blue, Green, Orange, Red gradients)
- **Strength Blocks**:
  - Set: Teal theme (#4ecdc4 border, #e0f7fa background)
  - Rest: Purple theme (#9b59b6 border, #f3e5f5 background)
- **UI Elements**: Dark theme background (#2a2a2a) with light text
- **Selection States**: Blue border highlights with shadow effects

### Interaction Patterns
- **Hover Effects**: Smooth transitions for interactive elements
- **Visual Feedback**: Drag previews, drop indicators, selection states
- **Contextual Actions**: Delete/duplicate buttons appear on hover
- **Modal Interactions**: Slide-up panels for mobile, dismissible overlays
- **Form Validation**: Real-time input validation with visual cues

### Responsive Behavior
- **Desktop**: Full three-panel layout with resizable handles
- **Tablet**: Adapted layout with collapsible panels
- **Mobile**: Single-column layout with modal interfaces
- **Touch Optimization**: Larger touch targets, gesture support

## Implementation Details

### Drag & Drop with dnd-kit
- **Core Setup**: DndContext with sensors and accessibility
- **Drag Sources**: useDraggable for palette items
- **Drop Targets**: useDroppable for timeline area
- **Sorting**: useSortable for timeline items with reordering
- **Custom Modifiers**: Custom collision detection and restrictToVerticalAxis

### Persistence Layer
- **Session Storage**: Automatic save/restore of workout state
- **JSON Serialization**: Versioned workout schema
- **Import/Export**: File handling with error recovery
- **Data Validation**: Schema validation on import operations

### Error Handling & Validation
- **File Operations**: Graceful handling of corrupt or invalid files
- **User Input**: Validation for numeric fields and required properties
- **State Recovery**: Automatic backup and restore mechanisms
- **Error Boundaries**: React error boundaries for component-level errors

## Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Support**: iOS Safari, Chrome Mobile
- **Touch Devices**: Full touch event support
- **Accessibility**: WCAG 2.1 Level AA compliance

## Performance Considerations
- **Virtualization**: Large list virtualization for extensive workouts
- **Memoization**: React.memo and useCallback for performance optimization
- **Efficient Rendering**: Selective re-renders based on state changes
- **Bundle Optimization**: Code splitting and tree shaking

## Deployment Configuration
- **GitHub Pages**: Base path configuration for subdirectory hosting
- **Build Optimization**: Vite production builds with compression
- **Open Graph**: Social media meta tags for sharing
- **PWA Ready**: Service worker and manifest configuration ready

## Development Setup
```bash
# Installation
npm install

# Development server
npm run dev

# Production build
npm run build

# Deployment to GitHub Pages
npm run deploy

# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

## Testing Strategy
- **Unit Tests**: Component testing with Jest and React Testing Library
- **Integration Tests**: User flow testing
- **E2E Tests**: Cypress for critical user journeys
- **Performance Testing**: Lighthouse audits and bundle analysis

## Future Enhancement Roadmap
- **Audio Integration**: Voice cues and timer alerts
- **Real-time Features**: Workout timer with progress tracking
- **Social Features**: Workout sharing and community templates
- **Advanced Analytics**: Performance tracking and progress charts
- **Exercise Library**: Pre-defined exercise database
- **Cloud Sync**: User accounts with cloud storage
- **Additional Export Formats**: FIT, TCX, and other fitness formats
- **Offline Support**: Progressive Web App capabilities
- **Voice Commands**: Hands-free operation during workouts
- **AI Integration**: Smart workout suggestions and form analysis

## Support & Maintenance
- **Documentation**: Comprehensive API and user documentation
- **Error Reporting**: Sentry integration for error tracking
- **Analytics**: User behavior tracking for feature improvement
- **Update Strategy**: Semantic versioning and changelog management
