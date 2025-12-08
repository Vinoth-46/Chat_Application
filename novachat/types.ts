export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // For mock auth verification
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: Date;
  isAi?: boolean; // To distinguish the Gemini bot
  gender?: 'male' | 'female';
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image';
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participants: User[]; // Array of users in the chat
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  name?: string; // For group chats
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface LoginResponse {
  user: User;
  token: string;
}