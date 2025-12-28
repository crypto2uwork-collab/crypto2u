
import React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  rank: 'Newbie' | 'Explorer' | 'Pro' | 'Whale';
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  icon: string;
}

export interface Term {
  term: string;
  definition: string;
  category?: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: 'huong-dan' | 'nghien-cuu' | 'cong-dong';
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  views: number;
  content: React.ReactNode;
  date: string;
}

export interface CommunityReply {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  upvotes: number;
  tag: 'Kiến thức' | 'Hỏi đáp' | 'Kinh nghiệm';
  replies: CommunityReply[];
}

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// Added missing NewsItem interface
export interface NewsItem {
  title: string;
  summary: string;
  source: string;
  time: string;
  url: string;
  sentiment: string;
}

// Added missing AgentResponse interface
export interface AgentResponse {
  news: NewsItem[];
  sources: { title: string; uri: string }[];
}
