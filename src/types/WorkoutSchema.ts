import type { Card } from '../store/useStore';

export interface WorkoutSchema {
  version: string;
  title: string;
  cards: Card[];
}

// Current version of the schema
export const CURRENT_VERSION = '1.0.0';
