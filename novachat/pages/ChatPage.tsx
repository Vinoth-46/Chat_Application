import React, { useState, useEffect, useRef } from 'react';
import { User, Conversation, Message } from '../types';
import { mockDb } from '../services/mockDb';
import { generateAIResponse } from '../services/gemini';
import { Avatar } from '../components/Avatar';
import { 
  LogOut, 
  Send, 
  Image as ImageIcon, 
  MoreVertical, 
  Phone, 
  Video, 
  Search,
  ChevronLeft,
  Bot,
  MessageSquare,
  Check,
  CheckCheck
} from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';

interface ChatPageProps {
  currentUser: User;
  onLogout: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ currentUser, onLogout }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Unified Polling Logic
  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch conversations (for sidebar list & unread counts)
      const convs = await mockDb.getConversations(currentUser.id);
      setConversations(convs);

      // 2. If chat selected, fetch messages and mark as read
      if (selectedChat) {
        // Mark messages as read for the current chat
        await mockDb.markAsRead(selectedChat.id, currentUser.id);
        
        // Fetch latest messages
        const msgs = await mockDb.getMessages(selectedChat.id);
        
        // Only update if messages have changed (length check is a simple heuristic for this mock)
        setMessages(prev => {
            if (prev.length !== msgs.length || JSON.stringify(prev) !== JSON.stringify(msgs)) {
                return msgs;
            }
            return prev;
        });
      }
    };

    fetchData(); // Initial load
    pollingRef.current = setInterval(fetchData, 2000); // Poll every 2s for "real-time" feel

    return () => {
        if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [currentUser.id, selectedChat?.id]); // Re-create poll if user or chat changes

  // Auto-scroll to bottom only on new message addition
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, selectedChat?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChat) return;

    const content = inputText;
    setInputText('');

    const receiver = selectedChat.participants.find(p => p.id !== currentUser.id);
    if (!receiver) return;

    // 1. Optimistic UI Update
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      conversationId: selectedChat.id,
      senderId: currentUser.id,
      content: content,
      type: 'text',
      timestamp: Date.now(),
      status: 'sent'
    };
    setMessages(prev => [...prev, optimisticMsg]);
    scrollToBottom();

    // 2. Persist to Mock DB
    await mockDb.sendMessage(currentUser.id, receiver.id, content);

    // 3. Handle AI Response if chatting with Gemini
    if (receiver.isAi) {
      setIsTyping(true);
      
      // Construct history for better context
      const history = messages.map(m => ({
          role: m.senderId === currentUser.id ? 'user' : 'model',
          parts: [{ text: m.content }]
      }));

      // Call Gemini API
      const aiResponseText = await generateAIResponse(history, content);
      
      setIsTyping(false);
      
      const aiMsg = await mockDb.saveAiMessage(receiver.id, currentUser.id, aiResponseText);
      setMessages(prev => [...prev, aiMsg]);
    }
  };

  const handleSelectChat = (chat: Conversation) => {
    setSelectedChat(chat);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    // Optimistic unread clear
    setConversations(prev => prev.map(c => c.id === chat.id ? { ...c, unreadCount: 0 } : c));
  };

  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'read':
        return <CheckCheck size={16} className="text-blue-300" />;
      case 'delivered':
        return <CheckCheck size={16} className="text-gray-300" />;
      case 'sent':
      default:
        return <Check size={16} className="text-gray-300" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* Sidebar - Conversation List */}
      <aside 
        className={clsx(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 absolute inset-y-0 left-0 z-20 md:relative w-full md:w-80 lg:w-96",
          !isSidebarOpen && "hidden md:flex",
          selectedChat && "hidden md:flex" // Hide on mobile if chat selected
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <Avatar user={currentUser} size="sm" showStatus />
            <span className="font-semibold text-gray-800">{currentUser.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <MoreVertical size={20} />
            </button>
            <button 
                onClick={onLogout}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map(chat => {
            const contact = chat.participants.find(p => p.id !== currentUser.id) || currentUser;
            const isActive = selectedChat?.id === chat.id;
            
            return (
              <div 
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={clsx(
                  "flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors",
                  isActive && "bg-primary-50 hover:bg-primary-50"
                )}
              >
                <Avatar user={contact} showStatus />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-medium text-gray-900 truncate flex items-center gap-1">
                        {contact.username}
                        {contact.isAi && <Bot size={14} className="text-blue-500" />}
                    </h3>
                    {chat.lastMessage && (
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatTime(chat.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={clsx(
                        "text-sm truncate flex-1",
                        chat.unreadCount > 0 ? "font-semibold text-gray-900" : "text-gray-500"
                    )}>
                        {chat.lastMessage?.senderId === currentUser.id && "You: "}
                        {chat.lastMessage?.content || "Start a conversation"}
                    </p>
                    {chat.unreadCount > 0 && (
                        <span className="ml-2 bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                            {chat.unreadCount}
                        </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Chat Window */}
      <main className={clsx(
        "flex-1 flex flex-col bg-[#e5ddd5] relative w-full h-full",
        !selectedChat && "hidden md:flex"
      )}>
        {!selectedChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
               <MessageSquare size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Welcome to NovaChat</h2>
            <p className="text-sm">Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <header className="h-16 bg-white flex items-center justify-between px-4 border-b border-gray-200 shadow-sm z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden p-2 -ml-2 text-gray-600"
                >
                  <ChevronLeft size={24} />
                </button>
                {(() => {
                    const contact = selectedChat.participants.find(p => p.id !== currentUser.id);
                    if (!contact) return null;
                    return (
                        <>
                            <Avatar user={contact} size="sm" />
                            <div>
                                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                    {contact.username}
                                    {contact.isAi && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded font-bold">AI</span>}
                                </h2>
                                <p className="text-xs text-gray-500">
                                    {contact.isAi ? 'Always active' : contact.status}
                                </p>
                            </div>
                        </>
                    )
                })()}
              </div>
              <div className="flex items-center gap-4 text-primary-600">
                <Phone size={20} className="cursor-pointer hover:text-primary-700" />
                <Video size={20} className="cursor-pointer hover:text-primary-700" />
                <Search size={20} className="cursor-pointer hover:text-primary-700" />
              </div>
            </header>

            {/* Chat Messages */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat' }}
            >
              {messages.map((msg, index) => {
                const isMe = msg.senderId === currentUser.id;
                const showAvatar = !isMe && (index === 0 || messages[index - 1].senderId !== msg.senderId);
                const contact = selectedChat.participants.find(p => p.id === msg.senderId);

                return (
                  <div 
                    key={msg.id} 
                    className={clsx(
                      "flex gap-2 max-w-[85%] md:max-w-[70%]",
                      isMe ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    {!isMe && (
                        <div className="w-8 flex-shrink-0 flex flex-col justify-end">
                            {showAvatar && contact && <Avatar user={contact} size="sm" />}
                        </div>
                    )}
                    
                    <div 
                      className={clsx(
                        "rounded-2xl px-4 py-2 shadow-sm relative text-sm md:text-base break-words",
                        isMe 
                          ? "bg-primary-600 text-white rounded-br-none" 
                          : "bg-white text-gray-900 rounded-bl-none"
                      )}
                    >
                      {msg.content}
                      <div className={clsx(
                        "text-[10px] mt-1 flex items-center justify-end gap-1 opacity-70",
                        isMe ? "text-primary-100" : "text-gray-400"
                      )}>
                        {formatTime(msg.timestamp)}
                        {isMe && getStatusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                  <div className="flex gap-2 max-w-[85%]">
                      <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                          <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                          </div>
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-3 md:p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2 max-w-4xl mx-auto w-full">
                <button 
                  type="button" 
                  className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ImageIcon size={20} />
                </button>
                <div className="flex-1 bg-gray-100 rounded-2xl flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-primary-200 transition-all">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 outline-none max-h-32 py-2"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!inputText.trim()}
                  className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <Send size={20} className={inputText.trim() ? "ml-0.5" : ""} />
                </button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
};