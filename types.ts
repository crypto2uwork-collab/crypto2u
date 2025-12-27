import React from 'react';

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
  level?: 'Beginner' | 'Intermediate' | 'Advanced'; // New property
  views: number;
  content: React.ReactNode;
  date: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface MarketData {
  name: string;
  value: number;
  color: string;
}

export interface NewsItem {
  title: string;
  summary: string;
  source: string;
  time: string;
}

export interface AgentResponse {
  news: NewsItem[];
  sources: { title: string; uri: string }[];
}

// New type for Chat History
export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}