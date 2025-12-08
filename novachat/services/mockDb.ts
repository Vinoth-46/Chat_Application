import { User, Message, Conversation, LoginResponse } from '../types';

// Initial Mock Data
const MOCK_USERS: User[] = [
  {
    id: 'user-gemini',
    username: 'AI Assistant',
    email: 'ai@novachat.com',
    password: 'secure-ai-password',
    avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=gemini',
    status: 'online',
    isAi: true,
  },
  {
    id: 'user-2',
    username: 'Alice Wonderland',
    email: 'alice@example.com',
    password: 'password123',
    // Using v9 API with specific styles
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alice&top=longHair,longHairBob,longHairBun&accessories=prescription01',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60),
    gender: 'female',
  },
  {
    id: 'user-3',
    username: 'Bob Builder',
    email: 'bob@example.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Bob&top=shortHair,shortHairTheCaesar&facialHair=beardLight,beardMedium',
    status: 'online',
    gender: 'male',
  },
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class MockDBService {
  private users: User[] = [];
  private messages: Message[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const storedUsers = localStorage.getItem('nova_users');
    const storedMessages = localStorage.getItem('nova_messages');
    
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      this.users = [...MOCK_USERS];
      this.saveUsers();
    }

    if (storedMessages) {
      this.messages = JSON.parse(storedMessages);
    }
  }

  private saveUsers() {
    localStorage.setItem('nova_users', JSON.stringify(this.users));
  }

  private saveMessages() {
    localStorage.setItem('nova_messages', JSON.stringify(this.messages));
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    await delay(800);
    const user = this.users.find((u) => u.email === email);
    
    // Privacy Check: Validate user exists AND password matches
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }

    this.currentUser = user;
    user.status = 'online';
    this.saveUsers();
    return { user, token: 'mock-jwt-token-' + user.id };
  }

  async register(username: string, email: string, password: string, gender: 'male' | 'female'): Promise<LoginResponse> {
    await delay(1000);
    if (this.users.some((u) => u.email === email)) {
      throw new Error('Email already in use');
    }

    // Generate gender-specific avatar with DiceBear v9
    // We construct the URL carefully to ensure valid parameters
    let avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(username)}`;
    
    if (gender === 'male') {
        // Male: Short hair styles, various beard options
        avatarUrl += '&top=shortHair,shortHairTheCaesar,shortHairFrizzle,shortHairShaggy&facialHair=beardLight,beardMajestic,beardMedium';
    } else {
        // Female: Long hair styles, no facial hair, some accessories
        avatarUrl += '&top=longHair,longHairBob,longHairBun,longHairCurly&facialHair=none&accessories=kurt,prescription01,none';
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      email,
      password, // Store password
      avatar: avatarUrl,
      status: 'online',
      gender,
    };
    this.users.push(newUser);
    this.saveUsers();
    this.currentUser = newUser;
    return { user: newUser, token: 'mock-jwt-token-' + newUser.id };
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    await delay(300);
    // In this mock, everyone has a conversation with everyone else
    return this.users
      .filter((u) => u.id !== userId)
      .map((contact) => {
        const convId = this.getConversationId(userId, contact.id);
        const msgs = this.messages.filter((m) => m.conversationId === convId);
        const lastMessage = msgs.length > 0 ? msgs[msgs.length - 1] : undefined;
        
        // Calculate unread count
        const unreadCount = msgs.filter(
            m => m.senderId !== userId && m.status !== 'read'
        ).length;
        
        return {
          id: convId,
          participants: [contact],
          lastMessage,
          unreadCount,
          isGroup: false,
        };
      })
      .sort((a, b) => {
        const timeA = a.lastMessage?.timestamp || 0;
        const timeB = b.lastMessage?.timestamp || 0;
        return timeB - timeA;
      });
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    await delay(200);
    return this.messages
        .filter((m) => m.conversationId === conversationId)
        .sort((a,b) => a.timestamp - b.timestamp);
  }

  async markAsRead(conversationId: string, userId: string): Promise<void> {
      // Find messages in this conversation sent by OTHERS that are NOT read
      let updated = false;
      this.messages.forEach(msg => {
          if (msg.conversationId === conversationId && msg.senderId !== userId && msg.status !== 'read') {
              msg.status = 'read';
              updated = true;
          }
      });
      
      if (updated) {
          this.saveMessages();
      }
  }

  async sendMessage(senderId: string, receiverId: string, content: string, type: 'text'|'image' = 'text'): Promise<Message> {
    await delay(300);
    const conversationId = this.getConversationId(senderId, receiverId);
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      conversationId,
      senderId,
      content,
      type,
      timestamp: Date.now(),
      status: 'sent', // Initially sent
    };
    this.messages.push(newMessage);
    this.saveMessages();
    
    // Simulate delivery after a short delay
    setTimeout(() => {
        const m = this.messages.find(x => x.id === newMessage.id);
        if (m && m.status === 'sent') {
            m.status = 'delivered';
            this.saveMessages();
        }
    }, 1000);

    return newMessage;
  }

  // Simulate AI Reply persistence
  async saveAiMessage(aiId: string, receiverId: string, content: string): Promise<Message> {
     const conversationId = this.getConversationId(aiId, receiverId);
     const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      conversationId,
      senderId: aiId,
      content,
      type: 'text',
      timestamp: Date.now(),
      status: 'read', // AI msgs are auto-read usually
    };
    this.messages.push(newMessage);
    this.saveMessages();
    return newMessage;
  }

  private getConversationId(userA: string, userB: string): string {
    return [userA, userB].sort().join('-');
  }
}

export const mockDb = new MockDBService();