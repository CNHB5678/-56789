import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface Comment {
  id: string;
  resource_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface Store {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Resources state
  resources: Resource[];
  setResources: (resources: Resource[]) => void;
  addResource: (resource: Resource) => void;
  updateResource: (resource: Resource) => void;
  deleteResource: (id: string) => void;
  
  // Comments state
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
  updateComment: (comment: Comment) => void;
  deleteComment: (id: string) => void;
  
  // Messages state
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (message: Message) => void;
  
  // UI state
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useStore = create<Store>((set) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),
  
  // Resources state
  resources: [],
  setResources: (resources) => set({ resources }),
  addResource: (resource) => set((state) => ({ resources: [...state.resources, resource] })),
  updateResource: (resource) => set((state) => ({
    resources: state.resources.map((r) => r.id === resource.id ? resource : r)
  })),
  deleteResource: (id) => set((state) => ({
    resources: state.resources.filter((r) => r.id !== id)
  })),
  
  // Comments state
  comments: [],
  setComments: (comments) => set({ comments }),
  addComment: (comment) => set((state) => ({ comments: [...state.comments, comment] })),
  updateComment: (comment) => set((state) => ({
    comments: state.comments.map((c) => c.id === comment.id ? comment : c)
  })),
  deleteComment: (id) => set((state) => ({
    comments: state.comments.filter((c) => c.id !== id)
  })),
  
  // Messages state
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (message) => set((state) => ({
    messages: state.messages.map((m) => m.id === message.id ? message : m)
  })),
  
  // UI state
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  error: null,
  setError: (error) => set({ error }),
}));
