export interface User {
  id: string;
  email: string;
  username?: string;
}

export interface StyleModel {
  id: string;
  userId: string;
  name: string;
  description?: string;
  tone: 'friendly' | 'professional' | 'humorous' | 'inspirational';
  formality: number;
  humor: number;
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  id: string;
  userId: string;
  styleModelId?: string;
  title: string;
  content: string;
  type: 'script' | 'article';
  duration?: number;
  status: 'draft' | 'published';
  platform?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  contentId?: string;
  platform: string;
  platformCommentId: string;
  author: string;
  text: string;
  aiReply?: string;
  status: 'pending' | 'approved' | 'replied';
  createdAt: string;
}

export interface HotTopic {
  id: string;
  title: string;
  platform: string;
  heat: number;
  category: string;
  trend: 'rising' | 'hot' | 'stable';
}

export interface AnalyticsData {
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  platform: string;
}
