export interface GeneratedStamp {
  id: string;
  imageUrl: string;
  theme: string;
  timestamp: number;
}

export interface StampGenerationError {
  message: string;
  code?: string;
}