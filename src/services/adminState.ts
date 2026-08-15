import { storage } from '@/services/storage';

export interface AdminProfile { name: string; email: string; photo: string; role: string; }
export interface AccountPreferences { rememberSession: boolean; confirmDelete: boolean; successNotifications: boolean; density: 'comfortable' | 'compact'; reducedMotion: boolean; sidebarCollapsed: boolean; theme: 'dark' | 'light' | 'system'; }
export interface WebsiteSettings { title: string; description: string; url: string; email: string; phone: string; address: string; instagram: string; facebook: string; youtube: string; tiktok: string; whatsapp: string; twitter: string; copyright: string; }

export const defaultProfile: AdminProfile = { name: 'Administrator', email: 'admin@deeperdimensions.org', photo: '', role: 'Super Admin' };
export const defaultPreferences: AccountPreferences = { rememberSession: true, confirmDelete: true, successNotifications: true, density: 'comfortable', reducedMotion: false, sidebarCollapsed: false, theme: 'dark' };
export const defaultWebsiteSettings: WebsiteSettings = { title: 'DEEPER DIMENSIONS', description: 'Beyond the Ordinary. Into the Supernatural.', url: 'https://deeper-dimension.vercel.app?utm_source=chatgpt.com', email: 'hello@deeperdimensions.org', phone: '+234 800 000 0000', address: 'The Gathering Hall', instagram: '', facebook: '', youtube: '', tiktok: '', whatsapp: '', twitter: '', copyright: '© 2026 DEEPER DIMENSIONS. All rights reserved.' };

export const adminState = {
  getProfile: () => storage.get('admin_profile', defaultProfile),
  saveProfile: (profile: AdminProfile) => storage.set('admin_profile', profile),
  getPreferences: () => storage.get('admin_preferences', defaultPreferences),
  savePreferences: (preferences: AccountPreferences) => storage.set('admin_preferences', preferences),
  getWebsite: () => storage.get('website_settings', defaultWebsiteSettings),
  saveWebsite: (settings: WebsiteSettings) => storage.set('website_settings', settings),
};
