
export interface Song {
  id: string;
  title: string;
  composer: string;
  arranger: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  key: string;
  uploadDate: string;
  coverUrl: string;
  youtubeUrl: string;
  spotifyUrl?: string;
  audioUrl?: string;
  lyrics?: string;
  parts?: {
    S?: string;
    A?: string;
    T?: string;
    B?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export enum ViewState {
  LOGIN = 'LOGIN',
  USER_INFO = 'USER_INFO',
  DASHBOARD = 'DASHBOARD'
}

export enum DashboardTab {
  REPOSITORY = 'REPOSITORY',
  GENERATOR = 'GENERATOR',
  TUNER = 'TUNER',
  UPLOAD = 'UPLOAD',
  SPOTIFY = 'SPOTIFY',
  GAME = 'GAME'
}
