export type Speaker = 'user' | 'mentor';

export interface Dialogue {
  id: number;
  speaker: Speaker;
  important: boolean;
  message: string;
}

export type DialogueState = 'hidden' | 'active' | 'completed' | 'typing';

export interface DialogueWithState extends Dialogue {
  state: DialogueState;
}