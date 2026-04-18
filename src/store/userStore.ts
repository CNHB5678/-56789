import { create } from 'zustand';
import { User } from '../types';
import { supabase } from '../../supabase/supabaseClient';

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  fetchUser: (userId: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  fetchUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      set({ user: data as User, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch user data', loading: false });
      console.error(error);
    }
  },
  updateUser: async (updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', updates.id)
        .single();
      
      if (error) throw error;
      set({ user: data as User, loading: false });
    } catch (error) {
      set({ error: 'Failed to update user data', loading: false });
      console.error(error);
    }
  },
  logout: () => set({ user: null }),
}));