import { glossaryVi, glossaryEn } from './glossaryData';
import { articlesVi, articlesEn } from './articlesData';

// Helper functions to get data based on language
export const getArticles = (lang: 'vi' | 'en') => lang === 'vi' ? articlesVi : articlesEn;
export const getGlossary = (lang: 'vi' | 'en') => lang === 'vi' ? glossaryVi : glossaryEn;

// Default exports for backward compatibility (defaults to VN)
export const articles = articlesVi;
export const glossary = glossaryVi;
