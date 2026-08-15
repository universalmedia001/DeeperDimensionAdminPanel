import { storage } from '@/services/storage';

export type NotificationCategory = 'Registrations' | 'Prayer Requests' | 'Messages' | 'Media' | 'Events' | 'System';
export interface AppNotification { id: string; title: string; description: string; time: string; category: NotificationCategory; route: string; read: boolean; }
const seed: AppNotification[] = [
  { id: 'welcome', title: 'Welcome to your console', description: 'Your local admin workspace is ready to shape the story.', time: 'Just now', category: 'System', route: '/admin/settings', read: false },
  { id: 'prayer-1', title: 'New prayer request received', description: 'A private request is waiting for your care.', time: '12 minutes ago', category: 'Prayer Requests', route: '/admin/prayers', read: false },
  { id: 'registration-1', title: 'New event registration', description: 'Grace Mensah registered for Deeper Dimensions 2026.', time: '42 minutes ago', category: 'Registrations', route: '/admin/registrations', read: true },
];
export const notificationService = {
  getAll: () => storage.get<AppNotification[]>('notifications', seed),
  save: (items: AppNotification[]) => { storage.set('notifications', items); window.dispatchEvent(new Event('dd-notifications')); },
  add: (notification: Omit<AppNotification, 'id' | 'read' | 'time'>) => { const item: AppNotification = { ...notification, id: `notification-${Date.now()}`, read: false, time: 'Just now' }; notificationService.save([item, ...notificationService.getAll()]); return item; },
  markRead: (id: string) => notificationService.save(notificationService.getAll().map(item => item.id === id ? { ...item, read: true } : item)),
  markUnread: (id: string) => notificationService.save(notificationService.getAll().map(item => item.id === id ? { ...item, read: false } : item)),
  markAllRead: () => notificationService.save(notificationService.getAll().map(item => ({ ...item, read: true }))),
  remove: (id: string) => notificationService.save(notificationService.getAll().filter(item => item.id !== id)),
  clear: () => notificationService.save([]),
};
