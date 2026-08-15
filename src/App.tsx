import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Activity, Archive, ArrowUpRight, BarChart3, Bell, BookOpen, CalendarDays, Camera, Check, ChevronDown, CircleUserRound, ClipboardList, Clock3, FileText, Film, GalleryHorizontalEnd, HeartHandshake, Image, LayoutDashboard, LifeBuoy, Link2, ListFilter, LogOut, Menu, MessageCircle, Megaphone, MoreHorizontal, Newspaper, Play, Plus, Radio, Search, Settings, Shield, Sparkles, Tags, Trash2, UserRound, Users, Video, WandSparkles, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { mockData } from '@/data/mock';
import { createLocalService, createSupabaseService, storage, type SupabaseService } from '@/services/storage';
import type { Collection } from '@/types';
import { supabase } from '@/lib/supabase';
import { AdminProfileProvider } from '@/context/AdminProfileContext';
import { useAdminProfile } from '@/context/useAdminProfile';
import { notificationService } from '@/services/notificationService';
import { NotificationsPage, ProfileSettings, WebsiteSettings, IntegrationsPage, PreviewPage } from '@/components/AdminPages';
import SettingsCenter from '@/components/SettingsCenter';

const sermonSupabase = createSupabaseService<Collection>('sermons', {
  title: 'title',
  description: 'description',
  preacher: 'preacher',
  series: 'series',
  youtube_url: 'youtube_url',
  category: 'category',
  duration: 'duration',
  views: 'views',
  status: 'status',
  featured: 'featured',
});

const localServices = { series:createLocalService('series',mockData.series), preachers:createLocalService('preachers',mockData.preachers), events:createLocalService('events',mockData.events), photos:createLocalService('photos',mockData.photos), videos:createLocalService('videos',mockData.videos), registrations:createLocalService('registrations',mockData.registrations), prayers:createLocalService('prayers',mockData.prayers), members:createLocalService('members',mockData.members), ministries:createLocalService('ministries',mockData.ministries) };
type Key = keyof typeof localServices | 'sermons';

type AnyService = SupabaseService<Collection> | ReturnType<typeof createLocalService<Collection>>;
const services: Record<Key, AnyService> = { sermons: sermonSupabase, ...localServices };

type NavItem = [string, string, LucideIcon];
const navGroups: { label: string; items: NavItem[] }[] = [
 { label:'Overview', items:[['Dashboard','/admin',LayoutDashboard]] },
 { label:'Website & Content', items:[['Website','/admin/website',WandSparkles],['Sermons','/admin/sermons',BookOpen],['Sermon Series','/admin/series',Tags],['Preachers','/admin/preachers',UserRound],['Events','/admin/events',CalendarDays],['Schedule','/admin/schedule',Clock3]] },
 { label:'Media', items:[['Live','/admin/live',Radio],['Photos','/admin/photos',Image],['Videos','/admin/videos',Video],['Trailers','/admin/trailers',Film],['Galleries','/admin/galleries',GalleryHorizontalEnd]] },
 { label:'Community', items:[['Announcements','/admin/announcements',Megaphone],['Testimonials','/admin/testimonials',MessageCircle],['Prayer Requests','/admin/prayers',HeartHandshake],['Members','/admin/members',Users],['Ministries','/admin/ministries',Shield],['Registrations','/admin/registrations',ClipboardList]] },
 { label:'Operations', items:[['Giving','/admin/giving',HeartHandshake],['News / Blog','/admin/news',Newspaper],['Devotionals','/admin/devotionals',BookOpen],['Resources','/admin/resources',FileText],['Contact Requests','/admin/contacts',LifeBuoy],['Social Media','/admin/social',Link2]] },
 { label:'Insights', items:[['Analytics','/admin/analytics',BarChart3],['Notifications','/admin/notifications',Bell],['Settings','/admin/settings',Settings]] }
];
const allItems: NavItem[] = navGroups.flatMap(g=>g.items);

function Button({children, variant='primary', onClick, type='button', className='', disabled }: {children:React.ReactNode; variant?:'primary'|'ghost'|'danger'|'soft'; onClick?:()=>void; type?:'button'|'submit'; className?:string; disabled?:boolean}) { return <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none ${variant==='primary'?'bg-amber-500 text-[#1b120a] shadow-[0_8px_24px_rgba(199,138,73,.2)] hover:bg-amber-400':variant==='danger'?'bg-red-500/10 text-red-300 hover:bg-red-500/20':variant==='soft'?'bg-white/[.07] text-stone-200 hover:bg-white/[.12]':'text-stone-400 hover:bg-white/[.07]'} ${className}`}>{children}</button> }
function Badge({children, tone='neutral'}:{children:React.ReactNode;tone?:'neutral'|'green'|'amber'|'red'|'blue'}) { const c={neutral:'bg-white/[.07] text-stone-300',green:'bg-emerald-500/10 text-emerald-300',amber:'bg-amber-500/10 text-amber-300',red:'bg-red-500/10 text-red-300',blue:'bg-sky-500/10 text-sky-300'}[tone]; return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${c}`}>{children}</span> }
function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"><div className="glass max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-[#17110e] p-6"><div className="mb-6 flex items-center justify-between"><h2 className="font-display text-2xl text-stone-50">{title}</h2><button onClick={onClose} className="rounded-lg p-2 text-stone-500 hover:bg-white/10 hover:text-white"><X size={18}/></button></div>{children}</div></div> }
function Toast({message,onClose}:{message:string;onClose:()=>void}) { return <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-[#1c2a20] px-4 py-3 text-sm text-emerald-100 shadow-xl"><Check size={17} className="text-emerald-400"/>{message}<button onClick={onClose}><X size={14}/></button></div> }

function Login({onLogin}:{onLogin:()=>void}) { const [email,setEmail]=useState('admin@deeperdimensions.org'); const [password,setPassword]=useState('demo123'); const [forgot,setForgot]=useState(false); return <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d0b09] px-4"><div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(161,96,38,.18),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(123,68,30,.12),transparent_38%)]"/><div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#15100d]/80 shadow-2xl lg:grid-cols-2"><div className="hidden min-h-[620px] flex-col justify-between bg-[linear-gradient(145deg,rgba(103,62,30,.72),rgba(16,12,9,.8)),url('https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center p-10 lg:flex"><div><div className="mb-16 flex items-center gap-3"><div className="rounded-xl bg-amber-400 p-2 text-[#1a1109]"><Sparkles size={20}/></div><span className="font-display text-xl">DEEPER DIMENSIONS</span></div><p className="eyebrow">Admin console</p><h1 className="mt-4 max-w-sm font-display text-5xl leading-[1.05]">Steward the story.<br/><span className="text-amber-300">Shape the encounter.</span></h1></div><p className="max-w-xs text-sm leading-6 text-stone-300">Beyond the Ordinary. Into the Supernatural.<br/><span className="text-stone-500">August 24–28, 2026</span></p></div><div className="p-8 sm:p-12"><div className="mb-10 flex items-center gap-3 lg:hidden"><div className="rounded-xl bg-amber-400 p-2 text-[#1a1109]"><Sparkles size={20}/></div><span className="font-display text-xl">DEEPER DIMENSIONS</span></div><p className="eyebrow">Welcome back</p><h2 className="mt-3 font-display text-3xl text-stone-50">Enter the console</h2><p className="mt-2 text-sm text-stone-500">Manage your church website and community.</p><form className="mt-8 space-y-5" onSubmit={e=>{e.preventDefault();onLogin()}}><label className="block text-sm text-stone-300">Email<input className="input-field mt-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} /></label><label className="block text-sm text-stone-300">Password<input className="input-field mt-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label><div className="flex items-center justify-between text-xs"><label className="flex items-center gap-2 text-stone-500"><input type="checkbox" defaultChecked className="accent-amber-500"/> Remember this session</label><button type="button" onClick={()=>setForgot(!forgot)} className="text-amber-400 hover:text-amber-300">Forgot password?</button></div>{forgot&&<div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200">Password recovery will connect to your church account when production authentication is enabled.</div>}<Button type="submit" className="mt-2 w-full py-3">Open Admin Console <ArrowUpRight size={16}/></Button></form><p className="mt-8 text-center text-xs text-stone-600">Demo mode · Local authentication only</p></div></div></div> }

function Shell({children,onLogout}:{children:React.ReactNode;onLogout:()=>void}) { const { profile, preferences } = useAdminProfile(); const [,setNotificationVersion] = useState(0); const unread = notificationService.getAll().filter(item => !item.read).length; useEffect(() => { const refresh = () => setNotificationVersion(version => version + 1); window.addEventListener('dd-notifications', refresh); return () => window.removeEventListener('dd-notifications', refresh); }, []); const [open,setOpen]=useState(false); const [search,setSearch]=useState(''); const location=useLocation(); const page=allItems.find(i=>i[1]===location.pathname)?.[0] || 'Dashboard'; const results=search?allItems.filter(i=>i[0].toLowerCase().includes(search.toLowerCase())):[]; return <div className="min-h-screen bg-[#0d0b09] text-stone-200"><div className={`fixed inset-0 z-30 bg-black/60 lg:hidden ${open?'block':'hidden'}`} onClick={()=>setOpen(false)}/><aside className={`fixed inset-y-0 left-0 z-40 ${preferences.sidebarCollapsed?'w-20':'w-72'} border-r border-white/[.07] bg-[#120e0b] transition-transform lg:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}><div className="flex h-full flex-col"><div className="flex items-center justify-between border-b border-white/[.07] px-6 py-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-amber-400 p-2 text-[#1a1109]"><Sparkles size={16}/></div><div><div className="font-display text-sm text-stone-100">DEEPER DIMENSIONS</div><div className="text-[9px] uppercase tracking-[.2em] text-stone-600">Admin console</div></div></div><button className="text-stone-500 lg:hidden" onClick={()=>setOpen(false)}><X size={18}/></button></div><nav className="scrollbar-hide flex-1 overflow-y-auto px-3 py-5">{navGroups.map(group=><div key={group.label} className="mb-6"><p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[.2em] text-stone-600">{group.label}</p>{group.items.map(([label,path,Icon])=><NavLink onClick={()=>setOpen(false)} key={path} to={path} end={path==='/admin'} className={({isActive})=>`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${isActive?'bg-amber-500/10 text-amber-300':'text-stone-500 hover:bg-white/[.04] hover:text-stone-200'}`}><Icon size={16}/><span className={preferences.sidebarCollapsed?'sr-only':''}>{label}</span>{label==='Live'&&<span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400"/>}</NavLink>)}</div>)}</nav><div className="border-t border-white/[.07] p-4"><div className="flex items-center gap-3 rounded-xl bg-white/[.04] p-3"><div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-amber-500/20 text-amber-300">{profile.photo?<img src={profile.photo} className="h-full w-full object-cover"/>:<CircleUserRound size={18}/>}</div><div className="min-w-0"><p className="truncate text-xs font-semibold text-stone-200">{profile.name}</p><p className="text-[10px] text-stone-600">{profile.role}</p></div><button onClick={onLogout} className="ml-auto text-stone-600 hover:text-red-300"><LogOut size={15}/></button></div></div></div></aside><main className={preferences.sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}><header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-white/[.07] bg-[#0d0b09]/85 px-4 backdrop-blur-xl sm:px-8"><div className="flex items-center gap-3"><button className="text-stone-400 lg:hidden" onClick={()=>setOpen(true)}><Menu size={22}/></button><div><div className="text-[10px] uppercase tracking-[.18em] text-stone-600">Deeper Dimensions / <span className="text-stone-400">{page}</span></div><h1 className="mt-1 text-sm font-semibold text-stone-100">{page}</h1></div></div><div className="flex items-center gap-2 sm:gap-4"><div className="relative hidden sm:block"><Search size={15} className="absolute left-3 top-3 text-stone-600"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search console..." className="w-48 rounded-xl border border-white/[.08] bg-white/[.04] py-2.5 pl-9 pr-3 text-xs outline-none focus:border-amber-500/50 lg:w-64"/>{results.length>0&&<div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-white/10 bg-[#1b1410] p-2 shadow-xl">{results.map(r=><NavLink key={r[1]} to={r[1]} onClick={()=>setSearch('')} className="block rounded-lg px-3 py-2 text-xs text-stone-300 hover:bg-white/10">{r[0]}</NavLink>)}</div>}</div><NavLink to="/admin/notifications" className="relative rounded-xl p-2.5 text-stone-500 hover:bg-white/[.06] hover:text-stone-200"><Bell size={18}/>{unread>0&&<span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-[#1c120a]">{unread}</span>}</NavLink><NavLink to="/admin/preview" className="hidden sm:inline-flex"><Button variant="soft"><ArrowUpRight size={15}/> Preview Website</Button></NavLink></div></header><div className="p-4 sm:p-8">{children}</div></main></div> }

function Dashboard() { const { profile } = useAdminProfile(); const hour = new Date().getHours(); const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'; const counts: [string, number, LucideIcon, string, string][] =[['Total registrations',services.registrations.getAll().length+344,ClipboardList,'+18%','amber'],['Sermons',services.sermons.getAll().length+42,BookOpen,'+6 this month','green'],['Media library',services.photos.getAll().length+services.videos.getAll().length+26,Image,'+12%','blue'],['Community members',services.members.getAll().length+184,Users,'+24 this month','orange']]; return <div className="space-y-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Tuesday, August 18, 2026</p><h2 className="page-title mt-2">{greeting}, {profile.name}.</h2><p className="mt-2 text-sm text-stone-500">Here’s what’s happening across your church today.</p></div><div className="flex gap-2"><Button variant="soft"><Activity size={15}/> Activity log</Button><Button><Plus size={16}/> Create new</Button></div></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{counts.map(([label,value,Icon,trend,tone])=><div key={label as string} className="glass group rounded-2xl p-5 transition hover:-translate-y-1 hover:border-amber-500/20"><div className="flex items-start justify-between"><div className={`rounded-xl p-3 ${tone==='amber'?'bg-amber-500/10 text-amber-300':tone==='green'?'bg-emerald-500/10 text-emerald-300':tone==='blue'?'bg-sky-500/10 text-sky-300':'bg-orange-500/10 text-orange-300'}`}><Icon size={19}/></div><MoreHorizontal size={17} className="text-stone-700"/></div><div className="mt-6 text-3xl font-semibold text-stone-100">{value}</div><div className="mt-1 flex items-center justify-between"><span className="text-xs text-stone-500">{label}</span><span className="text-[10px] text-emerald-400">{trend}</span></div></div>)}</div><div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]"><div className="glass rounded-2xl p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">At a glance</p><h3 className="mt-2 font-display text-xl text-stone-100">Program momentum</h3></div><Badge tone="green">Live data</Badge></div><div className="mt-8 flex h-44 items-end gap-2 sm:gap-4">{[35,48,42,67,58,75,62,88,70,92,82,100].map((h,i)=><div key={i} className="group flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-md bg-gradient-to-t from-amber-600/50 to-amber-300/80 transition group-hover:from-amber-500 group-hover:to-amber-200" style={{height:`${h}%`}}/><span className="text-[9px] text-stone-700">{['S','M','T','W','T','F','S','S','M','T','W','T'][i]}</span></div>)}</div><div className="mt-4 flex items-center gap-2 text-xs text-stone-500"><span className="h-2 w-2 rounded-full bg-amber-400"/> Engagement this month <span className="ml-auto text-stone-300">8,642 interactions</span></div></div><div className="glass rounded-2xl p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Coming up</p><h3 className="mt-2 font-display text-xl text-stone-100">Deeper Dimensions</h3></div><CalendarDays size={19} className="text-amber-400"/></div><div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/[.06] p-4"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-stone-100">Opening Night</p><p className="mt-1 text-xs text-stone-500">Aug 24 · 6:00 PM</p></div><Badge tone="amber">In 6 days</Badge></div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[69%] rounded-full bg-amber-400"/></div><p className="mt-2 text-[10px] text-stone-600">347 of 500 registrations</p></div><div className="mt-6 space-y-3">{([['New prayer request','2 minutes ago',HeartHandshake],['Photo added to library','18 minutes ago',Image],['New registration','42 minutes ago',ClipboardList]] as [string,string,LucideIcon][]).map(([a,b,I])=><div className="flex items-center gap-3" key={a as string}><div className="rounded-lg bg-white/[.06] p-2 text-stone-400"><I size={14}/></div><div><p className="text-xs text-stone-300">{a}</p><p className="text-[10px] text-stone-600">{b}</p></div></div>)}</div></div></div><div><div className="mb-4 flex items-center justify-between"><div><p className="eyebrow">Quick actions</p><h3 className="mt-2 font-display text-xl text-stone-100">Move things forward</h3></div></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{([['Upload photo',Camera,'/admin/photos'],['Add sermon',BookOpen,'/admin/sermons'],['Create event',CalendarDays,'/admin/events'],['Review prayers',HeartHandshake,'/admin/prayers']] as [string,LucideIcon,string][]).map(([label,I,path]: [string, LucideIcon, string])=><NavLink key={label as string} to={path as string} className="glass flex items-center gap-3 rounded-xl p-4 transition hover:-translate-y-0.5 hover:border-amber-500/30"><div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-300"><I size={17}/></div><span className="text-sm text-stone-300">{label}</span><ArrowUpRight size={14} className="ml-auto text-stone-600"/></NavLink>)}</div></div></div> }

function isSupabaseService(s: AnyService): s is SupabaseService<Collection> { return 'load' in s && typeof (s as SupabaseService<Collection>).load === 'function'; }

function Manager({kind,title,subtitle,icon:Icon,fields=['Title','Description'], upload=false}:{kind:Key;title:string;subtitle:string;icon:LucideIcon;fields?:string[];upload?:boolean}) {
  const service = services[kind];
  const isSupabase = isSupabaseService(service);
  const [records,setRecords]=useState<Collection[]>(()=>service.getAll());
  const [query,setQuery]=useState('');
  const [modal,setModal]=useState(false);
  const [toast,setToast]=useState('');
  const [errorToast,setErrorToast]=useState('');
  const [loading,setLoading]=useState(false);
  const [saving,setSaving]=useState(false);
  const [draft,setDraft]=useState<Record<string,string>>({});
  const fileRef=useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSupabase) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await (service as SupabaseService<Collection>).load();
        if (!cancelled) setRecords(service.getAll());
      } catch (err) {
        if (!cancelled) setErrorToast('Unable to load data from database.');
        console.error(`Failed to load ${kind}:`, err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [kind]);

  const filtered=records.filter(r=>JSON.stringify(r).toLowerCase().includes(query.toLowerCase()));

  const save=async()=>{
    setSaving(true);
    try {
      const base: Record<string, unknown> = { title:draft.Title||draft.Name||'Untitled item', description:draft.Description||'', status:'Draft' };
      if (kind==='sermons') { base.preacher = draft['Preacher']||''; base.series = draft['Series']||''; base.youtube_url = draft['YouTube URL']||''; }
      if (kind==='photos') { base.name = draft.Title||'local-media'; base.type='JPG'; base.size='Local preview'; }
      const record = { id:`${kind}-${Date.now()}`, ...base } as unknown as Collection;
      if (isSupabase) {
        await (service as SupabaseService<Collection>).create(record);
      } else {
        (service as ReturnType<typeof createLocalService<Collection>>).create(record);
      }
      if (['registrations','prayers','sermons','events','photos','videos'].includes(kind)) {
        const notificationMap: Record<string, { title: string; category: 'Registrations'|'Prayer Requests'|'Media'|'Events'; route: string }> = { registrations: { title: 'New event registration', category: 'Registrations', route: '/admin/registrations' }, prayers: { title: 'New prayer request received', category: 'Prayer Requests', route: '/admin/prayers' }, sermons: { title: 'New sermon added', category: 'Media', route: '/admin/sermons' }, photos: { title: 'New photo uploaded', category: 'Media', route: '/admin/photos' }, videos: { title: 'New video uploaded', category: 'Media', route: '/admin/videos' }, events: { title: 'New event created', category: 'Events', route: '/admin/events' } };
        const notice = notificationMap[kind];
        if (notice) notificationService.add({ title: notice.title, description: `A new item was added to ${title}.`, category: notice.category, route: notice.route });
      }
      setRecords(service.getAll());
      setModal(false);
      setDraft({});
      setToast(isSupabase ? 'Saved to database' : 'Saved locally');
    } catch (err) {
      console.error(`Failed to save ${kind}:`, err);
      setErrorToast('Unable to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const remove=async(id:string)=>{
    if(!window.confirm('Delete this item? This cannot be undone.')) return;
    try {
      if (isSupabase) { await (service as SupabaseService<Collection>).delete(id); }
      else { (service as ReturnType<typeof createLocalService<Collection>>).delete(id); }
      setRecords(service.getAll());
      setToast('Item deleted');
    } catch (err) {
      console.error(`Failed to delete ${kind}:`, err);
      setErrorToast('Unable to delete item.');
    }
  };

  const togglePublish=async(r:Collection)=>{
    try {
      const newStatus = r.status==='Published'?'Draft':'Published';
      if (isSupabase) { await (service as SupabaseService<Collection>).update(r.id, { status: newStatus }); }
      else { (service as ReturnType<typeof createLocalService<Collection>>).update(r.id, { status: newStatus }); }
      setRecords(service.getAll());
      setToast(newStatus==='Published'?'Published':'Unpublished');
    } catch (err) {
      console.error(`Failed to update ${kind}:`, err);
      setErrorToast('Unable to update item.');
    }
  };

  const onFile=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const files=Array.from(e.target.files||[]);
    if(!files.length) return;
    files.forEach(file=>{
      const url=URL.createObjectURL(file);
      const record={id:`${kind}-${Date.now()}-${file.name}`,title:file.name.split('.')[0],name:file.name,type:file.type,size:`${(file.size/1024/1024).toFixed(1)} MB`,image:kind==='photos'?url:undefined,status:'Draft'} as unknown as Collection;
      (service as ReturnType<typeof createLocalService<Collection>>).create(record as Collection);
      if (kind === 'photos' || kind === 'videos') {
        notificationService.add({ title: kind === 'photos' ? 'New photo uploaded' : 'New video uploaded', description: `${files.length} local file${files.length > 1 ? 's' : ''} added to the media library.`, category: 'Media', route: `/admin/${kind}` });
      }
    });
    setRecords(service.getAll());
    setToast(`${files.length} file${files.length>1?'s':''} added to local library`);
    e.target.value='';
  };

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300"><Icon size={21}/></div>
        <p className="eyebrow">Content manager</p>
        <h2 className="page-title mt-2">{title}</h2>
        <p className="mt-2 text-sm text-stone-500">{subtitle}</p>
      </div>
      <div className="flex gap-2">
        {upload&&<><input ref={fileRef} type="file" accept={kind==='photos'?'image/jpeg,image/png,image/webp':'video/mp4,video/webm,video/quicktime'} multiple={kind==='photos'} onChange={onFile} className="hidden"/><Button variant="soft" onClick={()=>fileRef.current?.click()}><UploadIcon kind={kind}/> Upload</Button></>}
        <Button onClick={()=>setModal(true)}><Plus size={16}/> Add new</Button>
      </div>
    </div>
    <div className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row">
      <div className="relative flex-1"><Search size={16} className="absolute left-3 top-3 text-stone-600"/><input className="input-field pl-9" value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Search ${title.toLowerCase()}...`}/></div>
      <Button variant="soft"><ListFilter size={15}/> Filters</Button>
      <Button variant="ghost"><MoreHorizontal size={17}/></Button>
    </div>
    <div className="glass overflow-hidden rounded-2xl">
      <div className="hidden grid-cols-[1fr_180px_120px_100px] gap-4 border-b border-white/[.07] px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-600 md:grid"><span>Content</span><span>Details</span><span>Status</span><span/></div>
      {loading ? <div className="p-16 text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-400"/><p className="mt-3 text-sm text-stone-500">Loading from database...</p></div>
      : filtered.length ? filtered.map((r)=><div key={r.id} className="grid gap-3 border-b border-white/[.06] px-5 py-4 last:border-0 md:grid-cols-[1fr_180px_120px_100px] md:items-center">
        <div className="flex items-center gap-3">{'image' in r&&r.image?<img src={r.image} className="h-11 w-14 rounded-lg object-cover"/>:<div className="flex h-11 w-14 items-center justify-center rounded-lg bg-amber-500/10 text-amber-300"><Icon size={17}/></div>}<div className="min-w-0"><p className="truncate text-sm font-semibold text-stone-200">{r.title||('name' in r?r.name:'Untitled')}</p><p className="mt-1 truncate text-xs text-stone-600">{r.description||('category' in r?r.category:isSupabase?'Database record':'Local record')}</p></div></div>
        <div className="text-xs text-stone-500">{kind==='photos'&&'size' in r?r.size:kind==='events'&&'startDate' in r?r.startDate:kind==='sermons'&&'preacher' in r?r.preacher:'Updated recently'}</div>
        <div><Badge tone={r.status==='Published'?'green':r.status==='Draft'?'amber':'neutral'}>{r.status||'Draft'}</Badge></div>
        <div className="flex gap-1 md:justify-end">
          <button className="rounded-lg p-2 text-stone-600 hover:bg-white/10 hover:text-stone-200" onClick={()=>togglePublish(r)}><Check size={15}/></button>
          <button className="rounded-lg p-2 text-stone-600 hover:bg-red-500/10 hover:text-red-300" onClick={()=>remove(r.id)}><Trash2 size={15}/></button>
        </div>
      </div>)
      : <div className="p-16 text-center"><Archive size={30} className="mx-auto text-stone-700"/><p className="mt-3 text-sm text-stone-400">Nothing here yet</p><p className="mt-1 text-xs text-stone-600">Create your first item to get started.</p></div>}
    </div>
    {modal&&<Modal title={`Add ${title.slice(0,-1)}`} onClose={()=>setModal(false)}>
      <div className="space-y-4">{fields.map(f=><label className="block text-sm text-stone-300" key={f}>{f}<input className="input-field mt-2" value={draft[f]||''} onChange={e=>setDraft({...draft,[f]:e.target.value})} placeholder={`Enter ${f.toLowerCase()}`}/></label>)}<div className="flex justify-end gap-2 pt-3"><Button variant="ghost" onClick={()=>setModal(false)}>Cancel</Button><Button onClick={save} disabled={saving}>{saving ? 'Saving...' : (isSupabase ? <>Save <Check size={15}/></> : <>Save locally <Check size={15}/></>)}</Button></div></div>
    </Modal>}
    {toast&&<Toast message={toast} onClose={()=>setToast('')}/>}
    {errorToast&&<div className="fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-xl border border-red-400/20 bg-[#2a1a1a] px-4 py-3 text-sm text-red-100 shadow-xl"><X size={16} className="text-red-400"/>{errorToast}<button onClick={()=>setErrorToast('')}><X size={14}/></button></div>}
  </div>;
}
function UploadIcon({kind}:{kind:Key}){return kind==='photos'?<Camera size={16}/>:<Video size={16}/>}

function LivePage(){const [live,setLive]=useState(mockData.live);const [toast,setToast]=useState('');return <div className="space-y-6"><div><p className="eyebrow">Broadcast control</p><h2 className="page-title mt-2">Live control center</h2><p className="mt-2 text-sm text-stone-500">Manage links and status without hosting a stream here.</p></div><div className={`relative overflow-hidden rounded-2xl border p-8 ${live.status==='LIVE'?'border-red-400/30 bg-red-500/[.06]':'glass'}`}><div className="absolute right-8 top-8"><Badge tone={live.status==='LIVE'?'red':'amber'}>{live.status==='LIVE'?'● LIVE NOW':live.status}</Badge></div><Radio size={30} className={live.status==='LIVE'?'text-red-300':'text-amber-300'}/><h3 className="mt-8 font-display text-3xl text-stone-100">{live.title}</h3><p className="mt-2 max-w-lg text-sm leading-6 text-stone-500">{live.description}</p><div className="mt-8 flex flex-wrap gap-3"><Button onClick={()=>{setLive({...live,status:live.status==='LIVE'?'Ended':'LIVE'});setToast(live.status==='LIVE'?'Stream marked ended':'Stream marked LIVE')}} variant={live.status==='LIVE'?'danger':'primary'}>{live.status==='LIVE'?<><X size={16}/> End live</>:<><Play size={16}/> Start live</>}</Button><Button variant="soft"><Settings size={16}/> Stream settings</Button></div><div className="mt-10 grid gap-4 border-t border-white/[.08] pt-6 sm:grid-cols-3"><label className="text-xs text-stone-500">Provider<select className="input-field mt-2"><option>YouTube</option><option>Facebook Live</option><option>External stream</option></select></label><label className="text-xs text-stone-500 sm:col-span-2">Live URL<input className="input-field mt-2" placeholder="Paste provider URL"/></label></div></div>{toast&&<Toast message={toast} onClose={()=>setToast('')}/>}</div>}
function Website(){const [saved,setSaved]=useState(false);const [hero,setHero]=useState('Beyond the Ordinary. Into the Supernatural.');return <div className="space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Public website</p><h2 className="page-title mt-2">Website manager</h2><p className="mt-2 text-sm text-stone-500">Shape the experience visitors encounter first.</p></div><div className="flex gap-2"><Button variant="soft" onClick={()=>window.open('/?preview=true','_blank')}><ArrowUpRight size={15}/> Preview</Button><Button onClick={()=>{storage.set('hero',hero);setSaved(true)}}><Check size={15}/> Save changes</Button></div></div><div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]"><div className="glass rounded-2xl p-6"><div className="mb-6 flex items-center gap-3"><Sparkles size={18} className="text-amber-300"/><div><h3 className="font-display text-xl">Homepage hero</h3><p className="text-xs text-stone-600">The first story your visitors see.</p></div></div><div className="space-y-5"><label className="block text-sm text-stone-300">Hero title<textarea rows={3} className="input-field mt-2 resize-none font-display text-2xl" value={hero} onChange={e=>setHero(e.target.value)}/></label><label className="block text-sm text-stone-300">Supporting description<textarea rows={3} className="input-field mt-2 resize-none" defaultValue="Five unforgettable days of worship, teaching, prayer, and encounters with God."/></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm text-stone-300">Primary button<input className="input-field mt-2" defaultValue="Register now"/></label><label className="text-sm text-stone-300">Secondary button<input className="input-field mt-2" defaultValue="Explore the program"/></label></div></div></div><div className="overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(77,48,27,.7),rgba(15,11,8,.95)),url('https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center p-6"><div className="flex h-full min-h-[360px] flex-col justify-between"><Badge tone="amber">Live preview</Badge><div><p className="eyebrow">August 24–28, 2026</p><h3 className="mt-3 max-w-sm font-display text-4xl leading-tight">{hero}</h3><p className="mt-4 max-w-sm text-sm leading-6 text-stone-300">Five unforgettable days of worship, teaching, prayer, and encounters with God.</p><Button className="mt-6">Register now <ArrowUpRight size={15}/></Button></div></div></div></div>{saved&&<Toast message="Homepage changes saved locally" onClose={()=>setSaved(false)}/>}</div>}

function Generic({name}:{name:string}){const info:Record<string,[string,LucideIcon,string[]]>= {schedule:['Schedule',CalendarDays,['Session title','Date','Start time','Speaker']],trailers:['Trailers',Film,['Title','Description','Release date']],galleries:['Galleries',GalleryHorizontalEnd,['Title','Description','Category']],announcements:['Announcements',Megaphone,['Title','Description','Button URL']],testimonials:['Testimonials',MessageCircle,['Name','Testimonial','Date']],giving:['Giving',HeartHandshake,['Campaign name','Category','Description']],news:['News / Blog',Newspaper,['Title','Content','Category']],devotionals:['Devotionals',BookOpen,['Title','Scripture','Content']],resources:['Resources',FileText,['Title','Description','Resource type']],contacts:['Contact Requests',LifeBuoy,['Name','Email','Request']],social:['Social Media',Link2,['Instagram URL','Facebook URL','YouTube URL']],analytics:['Analytics',BarChart3,[]],settings:['Settings',Settings,['Website title','Contact email']]}; const [title,Icon,fields]=info[name]||[name,FileText,['Title','Description']]; if(name==='analytics')return <div className="space-y-6"><div><p className="eyebrow">Insights</p><h2 className="page-title mt-2">Analytics</h2><p className="mt-2 text-sm text-stone-500">Demo / Local Analytics — not connected to live website data.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[['Visitors','12,480','+18.2%'],['Popular pages','Homepage','Sermon archive'],['Popular sermon','The Language of the Spirit','1,240 views'],['Media uploads','48','this month']].map(x=><div className="glass rounded-2xl p-5" key={x[0]}><p className="text-xs text-stone-500">{x[0]}</p><p className="mt-5 font-display text-2xl text-stone-100">{x[1]}</p><p className="mt-1 text-xs text-emerald-400">{x[2]}</p></div>)}</div><div className="glass rounded-2xl p-6"><h3 className="font-display text-xl">Visitor activity</h3><div className="mt-8 flex h-56 items-end gap-2">{[42,55,48,70,62,80,76,92,68,86,74,100,82,90].map((h,i)=><div key={i} className="flex-1 rounded-t bg-amber-500/70" style={{height:`${h}%`}}/>)}</div></div></div>; if(name==='settings')return <div className="space-y-6"><div><p className="eyebrow">Console configuration</p><h2 className="page-title mt-2">Settings</h2><p className="mt-2 text-sm text-stone-500">Manage preferences for your local admin workspace.</p></div><div className="grid gap-5 lg:grid-cols-2">{[['Admin profile','Name, email, and profile photo'],['Account settings','Preferences and local session'],['Appearance','Theme and interface preferences'],['Notifications','Notification preferences'],['Website settings','Title, description, and contact details'],['Integrations','Future connections: Supabase, payments, email, SMS']].map(([a,b])=><div className="glass rounded-2xl p-5" key={a}><div className="flex items-center gap-3"><div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-300"><Settings size={17}/></div><div><h3 className="text-sm font-semibold text-stone-200">{a}</h3><p className="mt-1 text-xs text-stone-600">{b}</p></div><ChevronDown size={16} className="ml-auto text-stone-600"/></div></div>)}</div></div>; return <Manager kind="sermons" title={title} subtitle={`Manage ${title.toLowerCase()} for your church website.`} icon={Icon} fields={fields}/>}

function App(){const [authed,setAuthed]=useState(()=>storage.get('auth',false));const login=()=>{storage.set('auth',true);setAuthed(true)};const logout=()=>{storage.set('auth',false);setAuthed(false)};return <AdminProfileProvider><BrowserRouter>{!authed?<Login onLogin={login}/>:<Shell onLogout={logout}><Routes><Route path="/admin" element={<Dashboard/>}/><Route path="/admin/website" element={<Website/>}/><Route path="/admin/settings" element={<SettingsCenter/>}/><Route path="/admin/preview" element={<PreviewPage/>}/><Route path="/admin/notifications" element={<NotificationsPage/>}/><Route path="/admin/profile" element={<ProfileSettings/>}/><Route path="/admin/website-settings" element={<WebsiteSettings/>}/><Route path="/admin/integrations" element={<IntegrationsPage/>}/><Route path="/admin/live" element={<LivePage/>}/><Route path="/admin/photos" element={<Manager kind="photos" title="Photos" subtitle="Your visual story, kept beautifully organized." icon={Image} upload fields={['Title','Description']}/>}/><Route path="/admin/videos" element={<Manager kind="videos" title="Videos" subtitle="Manage teaching, worship, and community stories." icon={Video} upload fields={['Title','Description','Category']}/>}/><Route path="/admin/sermons" element={<Manager kind="sermons" title="Sermons" subtitle="Build an archive that keeps the word moving." icon={BookOpen} fields={['Title','Description','Preacher','Series','YouTube URL']}/>}/><Route path="/admin/series" element={<Manager kind="series" title="Sermon Series" subtitle="Organize teaching journeys for your church." icon={Tags} fields={['Title','Description','Start date','End date']}/>}/><Route path="/admin/preachers" element={<Manager kind="preachers" title="Preachers" subtitle="Introduce the voices carrying the message." icon={UserRound} fields={['Name','Role','Biography','Ministry']}/>}/><Route path="/admin/events" element={<Manager kind="events" title="Events" subtitle="Plan gatherings, services, and moments that matter." icon={CalendarDays} fields={['Title','Description','Start date','Venue','Capacity']}/>}/><Route path="/admin/registrations" element={<Manager kind="registrations" title="Registrations" subtitle="Keep every attendee experience intentional." icon={ClipboardList} fields={['Name','Email','Event']}/>}/><Route path="/admin/prayers" element={<Manager kind="prayers" title="Prayer Requests" subtitle="A private space to steward every request with care." icon={HeartHandshake} fields={['Name','Prayer request','Category']}/>}/><Route path="/admin/members" element={<Manager kind="members" title="Members" subtitle="See and serve your church community." icon={Users} fields={['Name','Email','Ministry']}/>}/><Route path="/admin/ministries" element={<Manager kind="ministries" title="Ministries" subtitle="Support the teams making ministry happen." icon={Shield} fields={['Title','Description','Leader']}/>}/>{['schedule','trailers','galleries','announcements','testimonials','giving','news','devotionals','resources','contacts','social','analytics'].map(n=><Route key={n} path={`/admin/${n}`} element={<Generic name={n}/>}/>)}<Route path="*" element={<Navigate to="/admin" replace/>}/></Routes></Shell>}</BrowserRouter></AdminProfileProvider>}
export default App;
