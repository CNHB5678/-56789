export interface User {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  level: number;
  experience: number;
  online_time: number;
  learning_time: number;
  created_at: string;
  updated_at: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description?: string;
  content: string;
  cover_image?: string;
  category: string;
  difficulty: string;
  duration?: number;
  author_id: string;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  author?: User;
}

export interface Resource {
  id: string;
  name: string;
  description?: string;
  url: string;
  category: string;
  icon?: string;
  author_id: string;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  author?: User;
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  target_id: string;
  target_type: 'tutorial' | 'resource';
  image_url?: string;
  video_url?: string;
  like_count: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface LearningProgress {
  id: string;
  user_id: string;
  tutorial_id: string;
  progress: number;
  completed: boolean;
  last_accessed: string;
  created_at: string;
  updated_at: string;
  tutorial?: Tutorial;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  sender?: User;
  receiver?: User;
}

export interface Friend {
  id: string;
  user_id1: string;
  user_id2: string;
  created_at: string;
  friend?: User;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: User;
  receiver?: User;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
}