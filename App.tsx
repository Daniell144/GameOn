import React, { useState, useEffect, useCallback } from 'react';
import { 
  Menu, X, Heart, Star, User, MessageCircle, 
  Gamepad2, ChevronRight, Camera, 
  Settings, MapPin, Send, Plus, Moon, Sun, LogOut,
  Shield, Bell, Smartphone, Monitor, Globe, Search, Minimize2, Maximize2, Layout
} from 'lucide-react';
import { ViewState, UserProfile, ChatThread, Platform, AppTheme } from './types';
import { INITIAL_PROFILE, MOCK_USERS, MOCK_CHATS, PLANS, CURRENT_USER_ID, TRANSLATIONS } from './constants';
import { GameCard } from './components/GameCard';

const App = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [appTheme, setAppTheme] = useState<AppTheme>('xp');
  const [myProfile, setMyProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [chats, setChats] = useState<ChatThread[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [matchAnimation, setMatchAnimation] = useState<'left' | 'right' | 'up' | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('appearance');
  const [language, setLanguage] = useState<'he' | 'en'>('he');

  // --- Helpers ---
  const t = (key: string) => {
    const lang = (language === 'he' || language === 'en') ? language : 'en'; 
    return TRANSLATIONS[lang][key] || key;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    // Manage Body Classes for Theme
    document.body.className = '';
    if (appTheme === 'xp') {
      document.body.classList.add('theme-xp');
    } else {
      document.body.classList.add('theme-modern');
      if (darkMode) document.body.classList.add('dark');
    }
  }, [appTheme, darkMode]);

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up') => {
    if (matchAnimation) return;
    setMatchAnimation(direction);
    setTimeout(() => {
      setSwipeIndex((prev) => (prev + 1) % MOCK_USERS.length);
      setMatchAnimation(null);
    }, 300);
  }, [matchAnimation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view !== ViewState.HOME) return;
      switch(e.key) {
        case 'ArrowLeft': handleSwipe('left'); break;
        case 'ArrowRight': handleSwipe('right'); break;
        case 'ArrowUp': handleSwipe('up'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, handleSwipe]);

  const handleUpdateProfile = (field: keyof UserProfile, value: any) => {
    setMyProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSendMessage = (text: string) => {
    if (!activeChatId || !text.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      senderId: CURRENT_USER_ID,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    setChats(prev => prev.map(chat => chat.id === activeChatId ? { ...chat, messages: [...chat.messages, newMessage], lastMessage: text, timestamp: newMessage.timestamp } : chat));
    setTimeout(() => {
        const replyMessage = {
            id: (Date.now() + 1).toString(),
            senderId: 'ai',
            text: language === 'he' ? `קיבלתי: "${text}". נחזור אליך בקרוב!` : `Received: "${text}". We'll get back to you soon!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false
        };
        setChats(prev => prev.map(chat => chat.id === activeChatId ? { ...chat, messages: [...chat.messages, replyMessage], lastMessage: replyMessage.text, timestamp: replyMessage.timestamp } : chat));
    }, 1500);
  };

  // ==========================================
  // XP THEME COMPONENTS
  // ==========================================

  const XPWindow = ({ title, children, className = '', noPadding = false }: { title: string, children: React.ReactNode, className?: string, noPadding?: boolean }) => (
    <div className={`flex flex-col h-full bg-[#ECE9D8] rounded-t-lg shadow-2xl border border-[#0054E3] overflow-hidden ${className}`}>
        <div className="bg-gradient-to-r from-[#0058EE] via-[#245DDA] to-[#3A93FF] px-3 py-2 flex justify-between items-center select-none shrink-0">
            <span className="text-white font-bold text-sm drop-shadow flex items-center gap-2 truncate">
               <img src="https://w7.pngwing.com/pngs/382/204/png-transparent-globe-world-computer-icons-globe-miscellaneous-blue-globe.png" className="w-4 h-4" alt="" />
               {title}
            </span>
            <div className="flex gap-1">
                <button className="w-5 h-5 bg-[#D6D3CE] rounded-[3px] border border-white border-r-gray-500 border-b-gray-500 flex items-center justify-center hover:bg-[#eaeaea] active:border-gray-500 active:border-r-white active:border-b-white">
                    <Minimize2 size={12} className="text-black opacity-60" />
                </button>
                <button className="w-5 h-5 bg-[#D6D3CE] rounded-[3px] border border-white border-r-gray-500 border-b-gray-500 flex items-center justify-center hover:bg-[#eaeaea] active:border-gray-500 active:border-r-white active:border-b-white">
                    <Maximize2 size={12} className="text-black opacity-60" />
                </button>
                <button 
                    onClick={() => setView(ViewState.HOME)}
                    className="w-5 h-5 bg-[#E53E30] rounded-[3px] border border-[#ff8d86] border-r-[#961b12] border-b-[#961b12] flex items-center justify-center text-white hover:bg-[#ff5a4d] active:bg-[#b02b20]"
                >
                    <X size={14} strokeWidth={3} />
                </button>
            </div>
        </div>
        <div className="bg-[#ECE9D8] border-b border-gray-400 flex items-center px-1 py-0.5 text-xs text-black shrink-0">
            <span className="px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default">File</span>
            <span className="px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default">View</span>
            <span className="px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default">Tools</span>
            <span className="px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default">Help</span>
        </div>
        <div className={`flex-1 overflow-auto bg-white ${noPadding ? '' : 'p-4'} text-black scrollbar-xp`}>
            {children}
        </div>
    </div>
  );

  const XPButton = ({ onClick, children, active = false }: any) => (
      <button 
        onClick={onClick}
        className={`px-4 py-2 text-sm font-normal text-black transition-none
        ${active ? 'font-bold bg-white' : 'bg-transparent'}
        hover:underline hover:text-[#0054E3] cursor-pointer flex items-center gap-2 w-full`}
      >
        {children}
      </button>
  );

  const XPSidebar = () => (
    <div className="w-64 bg-[#7A96DF] bg-gradient-to-b from-[#7A96DF] to-[#98B4E2] p-3 flex flex-col gap-4 overflow-y-auto h-full">
        <div className="rounded-t-lg overflow-hidden bg-white shadow-md">
            <div className="bg-gradient-to-r from-white to-[#C6D3F7] p-1">
                 <div className="bg-gradient-to-r from-[#225ACA] to-[#88A9E6] px-3 py-1 rounded-t-md flex justify-between items-center cursor-pointer">
                    <span className="text-white font-bold text-sm">System Tasks</span>
                    <ChevronRight className="text-white w-3 h-3 rotate-90" />
                 </div>
            </div>
            <div className="bg-[#D6DFF7] p-2 space-y-1">
                <XPButton onClick={() => setView(ViewState.HOME)} active={view === ViewState.HOME}><Gamepad2 size={16} /> {t('nav_discover')}</XPButton>
                <XPButton onClick={() => setView(ViewState.PROFILE)} active={view === ViewState.PROFILE}><User size={16} /> {t('nav_profile')}</XPButton>
                <XPButton onClick={() => setView(ViewState.SETTINGS)} active={view === ViewState.SETTINGS}><Settings size={16} /> {t('nav_settings')}</XPButton>
            </div>
        </div>
        <div className="rounded-t-lg overflow-hidden bg-white shadow-md">
            <div className="bg-gradient-to-r from-white to-[#C6D3F7] p-1">
                 <div className="bg-gradient-to-r from-[#225ACA] to-[#88A9E6] px-3 py-1 rounded-t-md flex justify-between items-center cursor-pointer">
                    <span className="text-white font-bold text-sm">Other Places</span>
                    <ChevronRight className="text-white w-3 h-3 rotate-90" />
                 </div>
            </div>
            <div className="bg-[#D6DFF7] p-2 space-y-1">
                <XPButton onClick={() => setView(ViewState.MATCHES)} active={view === ViewState.MATCHES}><Heart size={16} /> {t('nav_matches')}</XPButton>
                <XPButton onClick={() => setView(ViewState.CHAT_LIST)} active={view === ViewState.CHAT_LIST}><MessageCircle size={16} /> {t('nav_chats')}</XPButton>
                <XPButton onClick={() => setView(ViewState.SUBSCRIPTION)} active={view === ViewState.SUBSCRIPTION}><Star size={16} /> {t('nav_subs')}</XPButton>
            </div>
        </div>
    </div>
  );

  const XPTaskbar = () => (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-[#245DDA] border-t-2 border-[#3A93FF] flex items-center px-1 z-50 shadow-2xl">
        <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-8 px-2 bg-[#3C9E36] hover:bg-[#4CB845] rounded-r-[10px] rounded-l-md flex items-center gap-2 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.5)] border border-[#2B7924] mr-2 ml-0"
            style={{ 
                background: 'linear-gradient(to bottom, #3C9E36 0%, #3C9E36 50%, #2B7924 100%)',
                boxShadow: '2px 2px 2px rgba(0,0,0,0.5)'
            }}
        >
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[#E53E30] italic font-serif font-black shadow-inner border border-red-200">W</div>
            <span className="text-white font-bold italic text-shadow pr-2">Start</span>
        </button>
        <div className="h-full border-r border-[#1B46A0] border-l border-[#3A93FF] mx-1"></div>
        <div className="flex-1 flex gap-1 px-1 overflow-x-auto">
             {[
               { v: ViewState.HOME, i: <Gamepad2 size={16}/>, l: t('bn_home') },
               { v: ViewState.MATCHES, i: <Heart size={16}/>, l: t('bn_matches') },
               { v: ViewState.CHAT_LIST, i: <MessageCircle size={16}/>, l: t('bn_chat') },
               { v: ViewState.SUBSCRIPTION, i: <Star size={16}/>, l: t('bn_subs') }
             ].map(item => (
                <button key={item.v} onClick={() => setView(item.v)} className={`flex items-center gap-2 px-4 h-8 rounded text-white text-xs ${view === item.v ? 'bg-[#1845A3] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]' : 'hover:bg-[#316AC5]'}`}>
                    {item.i} {item.l}
                </button>
             ))}
        </div>
        <div className="bg-[#0B9CEE] h-full px-3 flex items-center gap-2 border-l border-[#194086] border-t border-[#194086] shadow-inner ml-auto">
             <span className="text-white text-xs">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
    </div>
  );

  // ==========================================
  // MODERN THEME COMPONENTS
  // ==========================================

  const ModernSidebar = () => (
    <div className="w-20 lg:w-64 bg-slate-900 dark:bg-black border-r border-slate-800 flex flex-col h-full shrink-0 transition-all duration-300">
        <div className="p-4 flex items-center gap-3 border-b border-slate-800">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                <Gamepad2 className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-white hidden lg:block tracking-tight">GameOn</span>
        </div>
        <div className="flex-1 p-3 space-y-2">
            {[
                { v: ViewState.HOME, i: Gamepad2, l: t('nav_discover') },
                { v: ViewState.MATCHES, i: Heart, l: t('nav_matches') },
                { v: ViewState.CHAT_LIST, i: MessageCircle, l: t('nav_chats') },
                { v: ViewState.SUBSCRIPTION, i: Star, l: t('nav_subs') },
                { v: ViewState.PROFILE, i: User, l: t('nav_profile') },
                { v: ViewState.SETTINGS, i: Settings, l: t('nav_settings') },
            ].map((item) => (
                <button
                    key={item.v}
                    onClick={() => setView(item.v)}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200
                    ${view === item.v 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                    <item.i size={24} />
                    <span className="hidden lg:block font-medium">{item.l}</span>
                </button>
            ))}
        </div>
    </div>
  );

  const ModernBottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center z-50 px-2 pb-safe">
        {[
            { v: ViewState.HOME, i: Gamepad2, l: t('bn_home') },
            { v: ViewState.MATCHES, i: Heart, l: t('bn_matches') },
            { v: ViewState.CHAT_LIST, i: MessageCircle, l: t('bn_chat') },
            { v: ViewState.SUBSCRIPTION, i: Star, l: t('bn_subs') },
            { v: ViewState.PROFILE, i: User, l: t('bn_profile') },
        ].map(item => (
            <button
                key={item.v}
                onClick={() => setView(item.v)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors
                ${view === item.v ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
            >
                <item.i size={20} strokeWidth={view === item.v ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.l}</span>
            </button>
        ))}
    </div>
  );

  // ==========================================
  // VIEW RENDERERS (Adaptable)
  // ==========================================

  const renderHome = () => {
    const activeUser = MOCK_USERS[swipeIndex];
    
    if (appTheme === 'xp') {
        return (
            <XPWindow title="GameOn Discovery" className="max-w-4xl mx-auto h-[600px] my-auto">
                <div className="flex h-full">
                    <div className="w-1/3 bg-[#D6DFF7] border-r border-white p-4 hidden md:block">
                        <h3 className="font-bold text-[#1E3C7B] mb-2">{t('nav_discover')}</h3>
                        <div className="mt-8 bg-white border border-gray-400 p-2 shadow-sm">
                            <img src={activeUser.image} className="w-full h-auto object-cover border border-gray-600 mb-2" alt="" />
                            <div className="text-center font-bold">{activeUser.name}</div>
                        </div>
                    </div>
                    <div className="flex-1 bg-white p-8 flex flex-col items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                         <div className={`relative bg-[#ECE9D8] border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] p-1 w-full max-w-sm transform transition-all duration-300
                            ${matchAnimation === 'left' ? '-translate-x-full rotate-[-10deg] opacity-0' : ''}
                            ${matchAnimation === 'right' ? 'translate-x-full rotate-[10deg] opacity-0' : ''}
                            ${matchAnimation === 'up' ? '-translate-y-full opacity-0' : ''}
                         `}>
                            <div className="bg-gradient-to-r from-[#0058EE] to-[#3A93FF] text-white px-2 py-1 font-bold flex justify-between">
                                <span>{activeUser.name}.exe</span>
                                <X size={16} />
                            </div>
                            <div className="bg-white border border-gray-500 p-4">
                                <img src={activeUser.image} className="w-full h-64 object-cover border-2 border-inset border-gray-300 mb-4" alt="" />
                                <div className="space-y-2">
                                     <div className="flex justify-between border-b border-gray-300 pb-1">
                                        <span>Age:</span> <span className="font-bold">{activeUser.age}</span>
                                     </div>
                                     <div className="bg-[#FFFFE1] border border-gray-300 p-2 text-sm">{activeUser.bio}</div>
                                </div>
                            </div>
                         </div>
                         <div className="flex gap-4 mt-6">
                             <button onClick={() => handleSwipe('left')} className="px-6 py-2 bg-[#ECE9D8] border-2 border-white border-r-black border-b-black active:border-t-black active:border-l-black text-black">Pass</button>
                             <button onClick={() => handleSwipe('right')} className="px-6 py-2 bg-[#ECE9D8] border-2 border-white border-r-black border-b-black active:border-t-black active:border-l-black font-bold text-black">Like</button>
                         </div>
                    </div>
                </div>
            </XPWindow>
        );
    }

    // Modern Home
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md relative aspect-[3/4]">
             <div className={`absolute inset-0 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ease-out transform
                 ${matchAnimation === 'left' ? '-translate-x-[150%] rotate-[-20deg] opacity-0' : ''}
                 ${matchAnimation === 'right' ? 'translate-x-[150%] rotate-[20deg] opacity-0' : ''}
                 ${matchAnimation === 'up' ? '-translate-y-[150%] opacity-0' : ''}
             `}>
                 <div className="absolute inset-0">
                     <img src={activeUser.image} className="w-full h-full object-cover" alt="" />
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                     <div className="flex items-end gap-3 mb-2">
                         <h2 className="text-3xl font-bold">{activeUser.name}</h2>
                         <span className="text-xl opacity-80 mb-1">{activeUser.age}</span>
                     </div>
                     <p className="text-sm opacity-90 mb-4 line-clamp-2">{activeUser.bio}</p>
                     <div className="flex flex-wrap gap-2 mb-4">
                         {activeUser.games.map(g => (
                             <span key={g.id} className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">{g.name}</span>
                         ))}
                     </div>
                 </div>
             </div>
          </div>
          <div className="flex items-center gap-6 mt-8">
              <button onClick={() => handleSwipe('left')} className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 text-red-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><X size={28} /></button>
              <button onClick={() => handleSwipe('up')} className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><Star size={24} /></button>
              <button onClick={() => handleSwipe('right')} className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/20 text-green-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><Heart size={28} fill="currentColor" /></button>
          </div>
      </div>
    );
  };

  const renderProfile = () => {
      if (appTheme === 'xp') {
        return (
          <XPWindow title="User Properties">
             <div className="p-4 max-w-2xl mx-auto">
                <div className="flex gap-1 border-b border-gray-400 mb-4 px-2">
                    <div className="bg-white border-t border-l border-r border-gray-400 px-4 py-1 rounded-t relative top-[1px] z-10">General</div>
                </div>
                <div className="bg-white border border-gray-400 p-6 flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <img src={myProfile.image} className="w-32 h-32 object-cover border-2 border-gray-300 p-1 bg-white shadow-sm" alt="" />
                        <label className="px-3 py-1 bg-[#ECE9D8] border border-gray-500 text-xs cursor-pointer hover:bg-white">Browse...</label>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                            <label className="text-right text-sm">Name:</label>
                            <input type="text" value={myProfile.name} onChange={(e) => handleUpdateProfile('name', e.target.value)} className="border border-gray-400 p-1 text-sm outline-none" />
                        </div>
                        <div className="border border-gray-300 p-2 bg-white relative mt-4">
                            <span className="absolute -top-2 right-2 bg-white px-1 text-xs text-[#0054E3]">Bio</span>
                            <textarea value={myProfile.bio} onChange={(e) => handleUpdateProfile('bio', e.target.value)} className="w-full h-20 text-sm outline-none resize-none" />
                        </div>
                    </div>
                </div>
             </div>
          </XPWindow>
        );
      }
      
      // Modern Profile
      return (
          <div className="max-w-2xl mx-auto p-4 md:p-8">
              <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">{t('edit_profile_title')}</h1>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <div className="px-8 pb-8">
                      <div className="relative -mt-16 mb-6">
                          <img src={myProfile.image} className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 object-cover" alt="" />
                          <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700">
                              <Camera size={18} />
                          </button>
                      </div>
                      <div className="grid gap-6">
                          <div>
                              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('label_display_name')}</label>
                              <input value={myProfile.name} onChange={(e) => handleUpdateProfile('name', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('label_bio')}</label>
                              <textarea value={myProfile.bio} onChange={(e) => handleUpdateProfile('bio', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none" />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const renderMatches = () => {
     if (appTheme === 'xp') {
         return (
            <XPWindow title={`My Matches (${MOCK_USERS.length})`}>
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {MOCK_USERS.map(user => (
                        <div key={user.id} className="flex flex-col items-center group cursor-pointer p-2 hover:bg-[#316AC5] hover:border-[#316AC5] border border-transparent rounded-sm hover:text-white">
                            <img src={user.image} className="w-16 h-16 object-cover mb-1 border border-gray-300 bg-white p-0.5 shadow-sm" alt="" />
                            <span className="text-xs text-center line-clamp-2">{user.name}</span>
                        </div>
                    ))}
                </div>
            </XPWindow>
         );
     }
     
     // Modern Matches
     return (
         <div className="p-4 md:p-8">
             <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{t('matches_title')}</h1>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {MOCK_USERS.map((user) => (
                     <div key={user.id} className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all">
                         <img src={user.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                             <span className="text-white font-bold">{user.name}</span>
                             <span className="text-white/80 text-xs">{user.age}</span>
                         </div>
                     </div>
                 ))}
             </div>
         </div>
     );
  };

  const renderChatList = () => {
    if (appTheme === 'xp') {
        return (
            <XPWindow title="MSN Messenger - Chat">
                <div className="flex h-full">
                    <div className="w-64 bg-[#F0F2F5] border-r border-gray-300 p-2 hidden md:flex flex-col gap-2">
                        <div className="bg-gradient-to-r from-[#D7E4F2] to-[#A3C3E5] p-2 flex items-center gap-2 border border-[#8DA9D4] rounded-t">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Windows_Live_Messenger_logo.svg/1024px-Windows_Live_Messenger_logo.svg.png" className="w-6 h-6" alt="MSN" />
                            <span className="font-bold text-[#1F3B5F] text-sm">Contacts</span>
                        </div>
                        <div className="flex-1 bg-white border border-[#8DA9D4] overflow-y-auto p-1">
                            {chats.map(chat => (
                                <div key={chat.id} onClick={() => { setActiveChatId(chat.id); setView(ViewState.CHAT_ROOM); }} className="flex items-center gap-2 p-1 hover:bg-[#CEE5F2] cursor-pointer">
                                    <img src={chat.user.image} className="w-8 h-8 border border-gray-300" alt="" />
                                    <div className="text-xs font-bold text-[#1F3B5F] truncate">{chat.user.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 bg-white flex flex-col items-center justify-center p-8">
                         <span className="text-[#1F3B5F] font-bold">Select a contact to start chatting</span>
                    </div>
                </div>
            </XPWindow>
        );
    }
    
    // Modern Chat List
    return (
        <div className="max-w-3xl mx-auto p-4 h-full flex flex-col">
            <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{t('messages_title')}</h1>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex-1 overflow-hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
                {chats.map((chat) => (
                    <div key={chat.id} onClick={() => { setActiveChatId(chat.id); setView(ViewState.CHAT_ROOM); }} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                        <div className="relative">
                            <img src={chat.user.image} className="w-12 h-12 rounded-full object-cover" alt="" />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-slate-900 dark:text-white truncate">{chat.user.name}</h3>
                                <span className="text-xs text-slate-500">{chat.timestamp}</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{chat.lastMessage}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  const renderChatRoom = () => {
      const activeChat = chats.find(c => c.id === activeChatId);
      if (!activeChat) return null;

      if (appTheme === 'xp') {
        return (
            <XPWindow title={`Conversation with ${activeChat.user.name}`} noPadding>
                <div className="flex flex-col h-full bg-[#F6F9FC]">
                    <div className="bg-gradient-to-r from-[#EBF3FA] to-[#CEDEF2] p-2 border-b border-[#96B5D7] flex items-center gap-2">
                        <button onClick={() => setView(ViewState.CHAT_LIST)} className="md:hidden text-xs border p-1">Back</button>
                        <img src={activeChat.user.image} className="w-10 h-10 border border-white shadow-sm" alt="" />
                        <div className="text-[#1F3B5F] font-bold text-sm">{activeChat.user.name}</div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-white border border-[#96B5D7] m-2">
                        {activeChat.messages.map(msg => (
                            <div key={msg.id} className="mb-2 text-sm">
                                <span className={`font-bold ${msg.isMe ? 'text-[#0000FF]' : 'text-[#FF0000]'}`}>{msg.isMe ? 'You' : activeChat.user.name} says:</span>
                                <span className="text-black ml-1 font-tahoma">{msg.text}</span>
                            </div>
                        ))}
                    </div>
                    <form className="h-24 m-2 mt-0 border border-[#96B5D7] bg-white flex flex-col" onSubmit={(e) => { e.preventDefault(); handleSendMessage((e.target as any).msg.value); (e.target as any).msg.value=''; }}>
                        <input name="msg" className="flex-1 p-2 outline-none font-tahoma text-sm" placeholder="Type a message..." />
                        <button type="submit" className="bg-gray-100 border-t p-1 text-xs">Send</button>
                    </form>
                </div>
            </XPWindow>
        );
      }

      // Modern Chat Room
      return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-900">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                 <button onClick={() => setView(ViewState.CHAT_LIST)} className="md:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ChevronRight className="rotate-180" /></button>
                 <img src={activeChat.user.image} className="w-10 h-10 rounded-full" alt="" />
                 <span className="font-bold text-slate-900 dark:text-white">{activeChat.user.name}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeChat.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${msg.isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <form className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" onSubmit={(e) => { e.preventDefault(); handleSendMessage((e.target as any).msg.value); (e.target as any).msg.value=''; }}>
                <div className="flex gap-2">
                    <input name="msg" className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 outline-none text-slate-900 dark:text-white" placeholder={t('type_message')} />
                    <button type="submit" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white"><Send size={18} /></button>
                </div>
            </form>
        </div>
      );
  };

  const renderSettings = () => {
      // 1. XP SETTINGS (Control Panel)
      if (appTheme === 'xp') {
        return (
            <XPWindow title="Control Panel">
                 <div className="flex h-full">
                    <div className="w-48 bg-gradient-to-b from-[#7A96DF] to-[#98B4E2] p-4 text-white hidden md:block">
                        <div className="font-bold mb-2">Control Panel</div>
                        <div className="text-xs mb-4">Switch to Classic View</div>
                        <div className="border-t border-[#98B4E2] my-2"></div>
                    </div>
                    <div className="flex-1 bg-white p-6 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-6 text-black">Pick a category</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="flex gap-3 items-start cursor-pointer group">
                                <img src="https://w7.pngwing.com/pngs/382/204/png-transparent-globe-world-computer-icons-globe-miscellaneous-blue-globe.png" className="w-12 h-12" alt="" />
                                <div>
                                    <h3 className="font-bold text-[#1F3B5F] group-hover:underline group-hover:text-[#E68B2C]">Appearance and Themes</h3>
                                    <p className="text-xs text-gray-500">Change the computer's theme.</p>
                                    <div className="mt-2 flex flex-col gap-2">
                                        <button onClick={() => setAppTheme('modern')} className="text-xs text-left px-2 py-1 border bg-gray-100 hover:bg-[#316AC5] hover:text-white">
                                            Switch to Modern View
                                        </button>
                                        <div className="flex gap-1">
                                            <button onClick={() => setLanguage('he')} className={`text-xs px-2 border ${language === 'he' ? 'bg-[#316AC5] text-white' : 'bg-gray-100'}`}>Heb</button>
                                            <button onClick={() => setLanguage('en')} className={`text-xs px-2 border ${language === 'en' ? 'bg-[#316AC5] text-white' : 'bg-gray-100'}`}>Eng</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
            </XPWindow>
        );
      }

      // 2. MODERN SETTINGS (Discord Style)
      return (
        <div className="flex h-full bg-[#313338] text-gray-200 font-sans">
             <div className="w-60 bg-[#2B2D31] flex flex-col text-xs font-medium">
                <div className="p-4 pt-8">
                     <div className="text-gray-400 font-bold mb-2 px-2 text-[11px] uppercase">{t('user_settings')}</div>
                     {[
                        { id: 'account', l: t('set_account') },
                        { id: 'profile', l: t('set_profile') },
                        { id: 'privacy', l: t('set_privacy') },
                        { id: 'subs', l: t('set_subs') }
                     ].map(item => (
                         <div 
                             key={item.id} 
                             onClick={() => setSettingsTab(item.id)}
                             className={`px-2 py-1.5 mb-0.5 rounded cursor-pointer ${settingsTab === item.id ? 'bg-[#3F4147] text-white' : 'text-gray-400 hover:bg-[#35373C] hover:text-gray-200'}`}
                         >
                             {item.l}
                         </div>
                     ))}
                     <div className="border-b border-[#3F4147] my-2 mx-2"></div>
                     <div className="text-gray-400 font-bold mb-2 px-2 text-[11px] uppercase">{t('app_settings')}</div>
                     {[
                        { id: 'appearance', l: t('set_appearance') },
                        { id: 'language', l: t('set_language') },
                     ].map(item => (
                         <div 
                             key={item.id} 
                             onClick={() => setSettingsTab(item.id)}
                             className={`px-2 py-1.5 mb-0.5 rounded cursor-pointer ${settingsTab === item.id ? 'bg-[#3F4147] text-white' : 'text-gray-400 hover:bg-[#35373C] hover:text-gray-200'}`}
                         >
                             {item.l}
                         </div>
                     ))}
                </div>
             </div>
             <div className="flex-1 bg-[#313338] p-10 overflow-y-auto">
                 {settingsTab === 'appearance' && (
                     <div className="max-w-2xl">
                         <h2 className="text-xl font-bold text-white mb-6">{t('set_appearance')}</h2>
                         <div className="mb-8">
                             <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">{t('theme')}</h3>
                             <div className="flex gap-4">
                                 <div 
                                    onClick={() => setDarkMode(false)} 
                                    className={`flex-1 p-4 bg-white rounded-lg cursor-pointer border-2 ${!darkMode ? 'border-green-500' : 'border-transparent'}`}
                                 >
                                     <div className="w-full h-24 bg-gray-100 rounded mb-2 border border-gray-300"></div>
                                     <div className="text-center text-black font-bold">{t('theme_light')}</div>
                                 </div>
                                 <div 
                                    onClick={() => setDarkMode(true)} 
                                    className={`flex-1 p-4 bg-[#2B2D31] rounded-lg cursor-pointer border-2 ${darkMode ? 'border-green-500' : 'border-transparent'}`}
                                 >
                                     <div className="w-full h-24 bg-[#313338] rounded mb-2"></div>
                                     <div className="text-center text-white font-bold">{t('theme_dark')}</div>
                                 </div>
                             </div>
                         </div>
                         <div className="mb-8">
                             <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Retro Mode</h3>
                             <div className="flex items-center justify-between p-4 bg-[#2B2D31] rounded-lg border border-[#1F2023]">
                                 <div className="flex items-center gap-3">
                                     <Monitor className="text-blue-400" />
                                     <div>
                                         <div className="text-white font-medium">Windows XP Theme</div>
                                         <div className="text-xs text-gray-400">Experience the nostalgia of 2001</div>
                                     </div>
                                 </div>
                                 <button 
                                     onClick={() => setAppTheme('xp')}
                                     className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                                 >
                                     Switch to XP
                                 </button>
                             </div>
                         </div>
                     </div>
                 )}
                 {settingsTab === 'language' && (
                     <div className="max-w-2xl">
                         <h2 className="text-xl font-bold text-white mb-6">{t('set_language')}</h2>
                         <div className="space-y-2">
                             {[
                                 { code: 'he', label: 'עברית', native: 'Hebrew' },
                                 { code: 'en', label: 'English', native: 'US' }
                             ].map((lang) => (
                                 <div 
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.code as any)}
                                    className={`flex items-center justify-between p-4 rounded bg-[#2B2D31] cursor-pointer border ${language === lang.code ? 'border-green-500' : 'border-transparent hover:bg-[#35373C]'}`}
                                 >
                                     <span className="text-white">{lang.label}</span>
                                     {language === lang.code && <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-[#2B2D31]"></div>}
                                 </div>
                             ))}
                         </div>
                     </div>
                 )}
             </div>
        </div>
      );
  };

  const renderSubscription = () => {
    // Shared Logic/Data, different render
    if (appTheme === 'xp') {
        return (
            <XPWindow title="GameOn Gold">
                <div className="p-8 bg-white h-full overflow-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {PLANS.map(plan => (
                            <div key={plan.id} className="bg-[#ECE9D8] border-2 border-white border-r-gray-500 border-b-gray-500 p-1">
                                <div className="border border-gray-400 p-4 h-full text-center">
                                    <h3 className="font-bold">{plan.name}</h3>
                                    <div className="text-xl text-[#0054E3] font-bold">${plan.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </XPWindow>
        );
    }
    return (
        <div className="p-8 h-full overflow-y-auto">
            <h1 className="text-3xl font-bold text-center mb-10 text-slate-900 dark:text-white">{t('gold_title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {PLANS.map((plan) => (
                    <div key={plan.id} className={`relative rounded-2xl p-6 flex flex-col bg-white dark:bg-slate-800 border-2 ${plan.isPopular ? 'border-yellow-500 scale-105 shadow-xl z-10' : 'border-transparent shadow-lg'}`}>
                        {plan.isPopular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">{t('most_popular')}</div>}
                        <h3 className={`text-xl font-bold mb-2 bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>{plan.name}</h3>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-6">${plan.price}<span className="text-sm font-normal text-slate-500"> {t('plan_per_month')}</span></div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center shrink-0`}>
                                        <Shield size={10} className="text-white" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105 bg-gradient-to-r ${plan.color}`}>{t('select_plan')}</button>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div className={`flex flex-col h-screen w-full font-sans overflow-hidden ${appTheme === 'modern' ? (darkMode ? 'dark bg-slate-900' : 'bg-slate-100') : ''}`}>
      
      {/* Container */}
      <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebars */}
          <aside className="hidden md:block shrink-0 h-full relative z-10">
              {appTheme === 'xp' ? <XPSidebar /> : <ModernSidebar />}
          </aside>

          {/* Main Area */}
          <main className={`flex-1 overflow-hidden relative ${appTheme === 'xp' ? 'p-2 md:p-8 pb-12' : 'pb-16 md:pb-0'}`}>
              {view === ViewState.HOME && renderHome()}
              {view === ViewState.PROFILE && renderProfile()}
              {view === ViewState.MATCHES && renderMatches()}
              {view === ViewState.CHAT_LIST && renderChatList()}
              {view === ViewState.CHAT_ROOM && renderChatRoom()}
              {view === ViewState.SUBSCRIPTION && renderSubscription()}
              {view === ViewState.SETTINGS && renderSettings()}
          </main>
      </div>

      {/* Navigations */}
      {appTheme === 'xp' ? <XPTaskbar /> : <div className="md:hidden"><ModernBottomNav /></div>}
      
      {/* Mobile Drawer (XP Only) */}
      {isMobileMenuOpen && appTheme === 'xp' && (
        <div className="fixed bottom-10 left-0 bg-white border-2 border-[#0054E3] rounded-t-lg shadow-2xl z-50 w-64">
             <div className="bg-[#245DDA] p-2 flex items-center gap-2 rounded-t text-white font-bold border-b-2 border-[#E68B2C]">
                 <img src={myProfile.image} className="w-10 h-10 rounded border-2 border-white" alt="" />
                 <span>{myProfile.name}</span>
             </div>
             <div className="flex">
                 <div className="w-1/2 bg-white p-2 text-sm text-black space-y-2 border-r border-gray-200">
                     <div onClick={() => { setView(ViewState.HOME); setIsMobileMenuOpen(false); }} className="hover:bg-[#316AC5] hover:text-white p-1 cursor-pointer font-bold">Internet</div>
                     <div onClick={() => { setView(ViewState.SETTINGS); setIsMobileMenuOpen(false); }} className="hover:bg-[#316AC5] hover:text-white p-1 cursor-pointer">Settings</div>
                 </div>
                 <div className="w-1/2 bg-[#D3E5FA] p-2 text-sm text-[#1E3C7B] space-y-2">
                     <div onClick={() => { setIsMobileMenuOpen(false); }} className="hover:bg-[#316AC5] hover:text-white p-1 cursor-pointer">Log Off</div>
                 </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default App;