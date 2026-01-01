export enum ViewState {
  HOME = 'HOME',
  PROFILE = 'PROFILE',
  MATCHES = 'MATCHES',
  CHAT_LIST = 'CHAT_LIST',
  CHAT_ROOM = 'CHAT_ROOM',
  SUBSCRIPTION = 'SUBSCRIPTION',
  SETTINGS = 'SETTINGS',
  SHOP = 'SHOP'
}

export enum Platform {
  PC = 'PC',
  PS5 = 'PlayStation 5',
  XBOX = 'Xbox Series X',
  SWITCH = 'Nintendo Switch'
}

export interface GameInfo {
  id: string;
  name: string;
  icon: string;
  rank?: string;
  role?: string;
  description?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  image: string;
  bio: string;
  platforms: Platform[];
  games: GameInfo[];
  distance?: string;
  isMatch?: boolean;
  equippedBorderId?: string;
  equippedNameColorId?: string;
}

export interface Cosmetic {
  id: string;
  name: string;
  cost: number;
  type: 'BORDER' | 'NAME_COLOR';
  style: string; // CSS class or hex color
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface ChatThread {
  id: string;
  user: UserProfile;
  lastMessage: string;
  timestamp: string;
  unread: number;
  messages: ChatMessage[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  color: string;
}

export interface Theme {
  id: string;
  name: string;
  cost: number;
  gradient: string;
  previewColor: string;
  accentClass: string;
}