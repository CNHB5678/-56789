export interface Tool {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: string;
  subCategory?: string;
  tags: string[];
  features: string[];
  pricing: {
    type: 'free' | 'freemium' | 'paid';
    price?: string;
  };
  officialUrl: string;
  rating: number;
  reviewCount: number;
  views: number;
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  favorites: string[];
  history: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  userId: string;
  toolId: string;
  rating: number;
  content: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subCategories?: string[];
  description: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  toolIds: string[];
  image: string;
}
