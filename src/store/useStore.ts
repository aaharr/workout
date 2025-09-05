import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DropResult } from '@hello-pangea/dnd';

export type CardType = 'cardio' | 'strength';
export type CardioSubtype = 'warmup' | 'cooldown' | 'interval';
export type StrengthSubtype = 'set' | 'rest';

export interface Card {
  id: string;
  text: string;
  type: CardType;
  cardioSubtype?: CardioSubtype;
  strengthSubtype?: StrengthSubtype;
  duration?: number; // in minutes
  reps?: number;
  weight?: number; // in arbitrary units
}

interface Store {
  cards: Card[];
  selectedCardId: string | null;
  workoutTitle: string;
  addCard: (card: Card) => void;
  updateCardText: (id: string, text: string) => void;
  setSelectedCardId: (id: string | null) => void;
  reorderCards: (startIndex: number, endIndex: number) => void;
  deleteCard: (id: string) => void;
  updateWorkoutTitle: (title: string) => void;
  updateCardDuration: (id: string, duration: number) => void;
  handleDragEnd: (result: DropResult) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      cards: [],
      selectedCardId: null,
      workoutTitle: 'My Workout',
  
  addCard: (card: Card) => set((state) => ({ 
    cards: [...state.cards, card],
    selectedCardId: card.id
  })),
  
  updateCardText: (id: string, text: string) => set((state) => ({
    cards: state.cards.map(card => 
      card.id === id ? { ...card, text } : card
    )
  })),
  
  setSelectedCardId: (id: string | null) => set({ selectedCardId: id }),
  
  reorderCards: (startIndex: number, endIndex: number) => set((state) => {
    const result = Array.from(state.cards);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return { cards: result };
  }),
  
  deleteCard: (id: string) => set((state) => ({
    cards: state.cards.filter(card => card.id !== id),
    selectedCardId: state.selectedCardId === id ? null : state.selectedCardId
  })),
  
  updateWorkoutTitle: (title: string) => set({ workoutTitle: title }),
  
  updateCardDuration: (id: string, duration: number) => set((state) => ({
    cards: state.cards.map(card => 
      card.id === id ? { ...card, duration } : card
    )
  })),
  
  updateCardReps: (id: string, reps: number) => set((state) => ({
    cards: state.cards.map(card => 
      card.id === id ? { ...card, reps } : card
    )
  })),
  
  updateCardWeight: (id: string, weight: number) => set((state) => ({
    cards: state.cards.map(card => 
      card.id === id ? { ...card, weight } : card
    )
  })),
  
  duplicateCard: (id: string) => set((state) => {
    const cardToDuplicate = state.cards.find(card => card.id === id);
    if (!cardToDuplicate) return state;
    
    const index = state.cards.findIndex(card => card.id === id);
    const newCard: Card = {
      ...cardToDuplicate,
      id: `card-${Date.now()}`
    };
    
    const newCards = [...state.cards];
    newCards.splice(index + 1, 0, newCard);
    
    return {
      cards: newCards,
      selectedCardId: newCard.id
    };
  }),
  
  clearAllCards: () => set({ cards: [], selectedCardId: null }),
  
  handleDragEnd: (result: DropResult) => {
    const { source, destination } = result;
    
    // Dropped outside a valid drop target
    if (!destination) return;
    
    // Handle palette to timeline drop
    if (source.droppableId.startsWith('palette-') && destination.droppableId === 'timeline') {
      const [_, category, subtype] = source.droppableId.split('-');
      const cardType = category as CardType;
      
      let defaultText: string;
      let cardioSubtype: CardioSubtype | undefined;
      let duration: number | undefined;
      let reps: number | undefined;
      let weight: number | undefined;
      
      switch (cardType) {
        case 'cardio':
          cardioSubtype = subtype as CardioSubtype;
          defaultText = `${cardioSubtype.charAt(0).toUpperCase() + cardioSubtype.slice(1)}`;
          // Set default duration to 4 minutes for all cardio subtypes
          duration = 4;
          break;
        case 'strength':
          const strengthSubtype = subtype as StrengthSubtype;
          if (strengthSubtype === 'rest') {
            defaultText = 'Rest';
            // Set default duration to 1 minute for rest
            duration = 1;
          } else {
            defaultText = 'Set';
            // Set default reps to 10 and weight to 100 for sets
            reps = 10;
            weight = 100;
          }
          break;
        default:
          defaultText = 'Exercise';
          break;
      }
      
      const newCard: Card = {
        id: `card-${Date.now()}`,
        text: defaultText,
        type: cardType,
        cardioSubtype,
        strengthSubtype: cardType === 'strength' ? (subtype as StrengthSubtype) : undefined,
        duration,
        reps
      };
      
      // Insert the new card at the drop position
      set((state) => {
        const newCards = Array.from(state.cards);
        newCards.splice(destination.index, 0, newCard);
        return { 
          cards: newCards,
          selectedCardId: newCard.id
        };
      });
      return;
    }
    
    // Handle reordering within timeline
    if (source.droppableId === 'timeline' && destination.droppableId === 'timeline') {
      get().reorderCards(source.index, destination.index);
      return;
    }
  }
}),
  {
    name: 'workout-store',
    getStorage: () => sessionStorage,
  }
));
