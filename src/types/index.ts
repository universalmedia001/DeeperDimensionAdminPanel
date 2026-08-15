export type Status = 'Published' | 'Draft' | 'Scheduled' | 'Archived' | 'New' | 'Praying' | 'Completed';
export interface BaseRecord { id: string; title: string; description?: string; status?: string; featured?: boolean; date?: string; image?: string; }
export interface Sermon extends BaseRecord { preacher: string; series: string; category: string; duration: string; views: number; }
export interface SermonSeries extends BaseRecord { sermons: number; startDate: string; endDate: string; }
export interface Preacher extends BaseRecord { name: string; role: string; ministry: string; bio: string; }
export interface Event extends BaseRecord { startDate: string; time: string; venue: string; category: string; registrations: number; capacity: number; }
export interface Photo extends BaseRecord { name: string; type: string; size: string; }
export interface Video extends BaseRecord { name: string; category: string; duration: string; views: number; }
export interface Registration extends BaseRecord { name: string; email: string; event: string; status: 'New'|'Approved'|'Rejected'; }
export interface PrayerRequest extends BaseRecord { name: string; category: string; privacy: 'Private'|'Public'; }
export interface Member extends BaseRecord { name: string; email: string; ministry: string; memberStatus: string; }
export interface Ministry extends BaseRecord { leader: string; members: number; }
export interface LiveEvent { title: string; description: string; provider: string; url: string; status: 'Upcoming'|'LIVE'|'Ended'; }
export interface AdminUser { name: string; email: string; role: string; }
export type Collection = Sermon | SermonSeries | Preacher | Event | Photo | Video | Registration | PrayerRequest | Member | Ministry;
