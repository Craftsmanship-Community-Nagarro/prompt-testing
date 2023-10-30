export interface Character {
    name: string;
    description: string;
    exampleSentences: string;
    scenario: string;
  }

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
  }
  
export interface GptMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }
  