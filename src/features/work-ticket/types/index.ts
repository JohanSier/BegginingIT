export type Speaker = 'user' | 'mentor'
export type DialogueState = 'active' | 'completed'

export interface DialogueEntry {
  id: number
  speaker: Speaker
  important?: boolean
  message: string
}