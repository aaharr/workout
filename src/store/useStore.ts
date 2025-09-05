import { create } from 'zustand';
import type { DropResult } from '@hello-pangea/dnd';

export interface Card {
  id: string;
  text: string;
}

interface Store {
  cards: Card[];
  selectedCardId: string | null;
  addCard: (card: Card) => void;
  updateCardText: (id: string, text: string) => void;
  setSelectedCardId: (id: string | null) => void;
  reorderCards: (startIndex: number, endIndex: number) => void;
  handleDragEnd: (result: DropResult) => void;
}

export const useStore = create<Store>((set, get) => ({
  cards: [],
  selectedCardId: null,
  
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
  
  handleDragEnd: (result: DropResult) => {
    const { source, destination } = result;
    
    // Dropped outside a valid drop target
    if (!destination) return;
    
    // Handle palette to timeline drop
    if (source.droppableId === 'palette' && destination.droppableId === 'timeline') {
      const newCard: Card = {
        id: `card-${Date.now()}`,
        text: 'New Card'
      };
      get().addCard(newCard);
      return;
    }
    
    // Handle reordering within timeline
    if (source.droppableId === 'timeline' && destination.droppableId === 'timeline') {
      get().reorderCards(source.index, destination.index);
      return;
    }
  }
}));
