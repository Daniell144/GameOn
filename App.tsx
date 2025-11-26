import React, { useState, useEffect, useCallback } from 'react';
import { 
  Menu, X, Heart, Star, User, MessageCircle, 
  Gamepad2, ChevronRight, Camera, 
  Settings, MapPin, Send, Plus, Moon, Sun, LogOut,
  Shield, Bell, Smartphone, Monitor, Hash, Search, Circle, Globe
} from 'lucide-react';
import { ViewState, UserProfile, ChatThread, Platform } from './types';
import { INITIAL_PROFILE, MOCK_USERS, MOCK_CHATS, PLANS, CURRENT_USER_ID, TRANSLATIONS } from './constants';
import { GameCard } from './components/GameCard';

const App = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [myProfile, setMyProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [chats, setChats] = useState<ChatThread[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [matchAnimation, setMatchAnimation] = useState<'left' | 'right' | 'up' | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('account');
  const [language, setLanguage] = useState<'he' | 'en' | 'es' | 'fr'>('he');

  // --- Helpers ---

  // Translation helper
  const t = (key: string) => {
    // Default to Hebrew if language not found, or English if key missing in current lang
    const lang = (language === 'he' || language === 'en') ? language : 'en'; 
    return TRANSLATIONS[lang][key] || key;
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Wrapped in useCallback to maintain reference stability for dependency arrays
  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up') => {
    if (matchAnimation) return; // Debounce: prevent spamming actions while animating

    setMatchAnimation(direction);
    setTimeout(() => {
      setSwipeIndex((prev) => (prev + 1) % MOCK_USERS.length); // Loop for demo
      setMatchAnimation(null);
    }, 300);
  }, [matchAnimation]);

  // Keyboard Event Listener Implementation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view !== ViewState.HOME) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          handleSwipe('left');
          break;
        case 'ArrowRight':
          handleSwipe('right');
          break;
        case 'ArrowUp':
          handleSwipe('up');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup function to remove listener when component unmounts or dependencies change
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, handleSwipe]);

  const handleUpdateProfile = (field: keyof UserProfile, value: any) => {
    setMyProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateProfile('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: text,
          timestamp: newMessage.timestamp
        };
      }
      return chat;
    }));

    // AI Auto Reply Simulation
    setTimeout(() => {
        const replyMessage = {
            id: (Date.now() + 1).toString(),
            senderId: 'ai',
            text: language === 'he' ? `קיבלתי: "${text}". נחזור אליך בקרוב!` : `Received: "${text}". We'll get back to you soon!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false
        };
        setChats(prev => prev.map(chat => {
            if (chat.id === activeChatId) {
              return {
                ...chat,
                messages: [...chat.messages, replyMessage],
                lastMessage: replyMessage.text,
                timestamp: replyMessage.timestamp
              };
            }
            return chat;
        }));
    }, 1500);
  };

  const handleViewChange = (newView: ViewState) => {
    setView(newView);
    setIsMobileMenuOpen(false);
  };

  // --- Components ---

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-500 italic tracking-tighter cursor-pointer" onClick={() => handleViewChange(ViewState.HOME)}>
            GameOn
        </h2>
        {isMobile && (
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300">
                <X size={24} />
            </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button 
            onClick={() => handleViewChange(ViewState.HOME)} 
            className={`flex items-center gap-4 text-lg font-medium transition-all px-4 py-3 rounded-xl ${view === ViewState.HOME ? 'bg-violet-100 dark:bg-violet-600/20 text-violet-600 dark:text-violet-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <Gamepad2 /> {t('nav_discover')}
        </button>
        <button 
            onClick={() => handleViewChange(ViewState.PROFILE)} 
            className={`flex items-center gap-4 text-lg font-medium transition-all px-4 py-3 rounded-xl ${view === ViewState.PROFILE ? 'bg-violet-100 dark:bg-violet-600/20 text-violet-600 dark:text-violet-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <User /> {t('nav_profile')}
        </button>
        <button 
            onClick={() => handleViewChange(ViewState.MATCHES)} 
            className={`flex items-center gap-4 text-lg font-medium transition-all px-4 py-3 rounded-xl ${view === ViewState.MATCHES ? 'bg-violet-100 dark:bg-violet-600/20 text-violet-600 dark:text-violet-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <Heart /> {t('nav_matches')}
        </button>
        <button 
            onClick={() => handleViewChange(ViewState.CHAT_LIST)} 
            className={`flex items-center gap-4 text-lg font-medium transition-all px-4 py-3 rounded-xl ${(view === ViewState.CHAT_LIST || view === ViewState.CHAT_ROOM) ? 'bg-violet-100 dark:bg-violet-600/20 text-violet-600 dark:text-violet-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <MessageCircle /> {t('nav_chats')}
        </button>
        <button 
            onClick={() => handleViewChange(ViewState.SUBSCRIPTION)} 
            className={`flex items-center gap-4 text-lg font-medium transition-all px-4 py-3 rounded-xl ${view === ViewState.SUBSCRIPTION ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-yellow-600 dark:hover:text-yellow-500'}`}
        >
          <Star className={view === ViewState.SUBSCRIPTION ? "fill-yellow-600 dark:fill-yellow-500" : ""} /> {t('nav_subs')}
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 px-4 uppercase tracking-wider">{t('system')}</h3>
        <button 
            onClick={() => handleViewChange(ViewState.SETTINGS)}
            className={`flex items-center gap-4 text-lg font-medium transition-all px-4 py-3 rounded-xl w-full ${view === ViewState.SETTINGS ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
            <Settings size={24} />
            <span>{t('nav_settings')}</span>
        </button>
        <button className="flex items-center gap-4 text-lg font-medium transition-all px-4 py-3 rounded-xl w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 mt-2">
            <LogOut size={24} />
            <span>{t('nav_logout')}</span>
        </button>
      </div>

      {!isMobile && (
        <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors" onClick={() => handleViewChange(ViewState.PROFILE)}>
                <img src={myProfile.image} className="w-10 h-10 rounded-full object-cover border border-violet-500" alt="" />
                <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate text-slate-900 dark:text-white">{myProfile.name}</p>
                    <p className="text-xs text-green-500 dark:text-green-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" /> {t('connected')}
                    </p>
                </div>
            </div>
        </div>
      )}
    </div>
  );

  const MobileMenu = () => (
    <>
        {/* Overlay */}
        <div 
            className={`md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Drawer */}
        <div className={`md:hidden fixed inset-y-0 ${language === 'he' ? 'right-0' : 'left-0'} z-50 w-3/4 max-w-sm bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : (language === 'he' ? 'translate-x-full' : '-translate-x-full')}`}>
            <div className="p-6 h-full overflow-y-auto">
                <SidebarContent isMobile={true} />
            </div>
        </div>
    </>
  );

  const BottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 flex justify-around items-center p-2 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <button onClick={() => setView(ViewState.HOME)} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${view === ViewState.HOME ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500'}`}>
        <Gamepad2 size={24} />
        <span className="text-[10px] font-medium">{t('bn_home')}</span>
      </button>
      <button onClick={() => setView(ViewState.MATCHES)} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${view === ViewState.MATCHES ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500'}`}>
        <Heart size={24} />
        <span className="text-[10px] font-medium">{t('bn_matches')}</span>
      </button>
      <button onClick={() => setView(ViewState.CHAT_LIST)} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${(view === ViewState.CHAT_LIST || view === ViewState.CHAT_ROOM) ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500'}`}>
        <MessageCircle size={24} />
        <span className="text-[10px] font-medium">{t('bn_chat')}</span>
      </button>
      <button onClick={() => setView(ViewState.SUBSCRIPTION)} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${view === ViewState.SUBSCRIPTION ? 'text-yellow-600 dark:text-yellow-500' : 'text-slate-500'}`}>
        <Star size={24} className={view === ViewState.SUBSCRIPTION ? "fill-yellow-600 dark:fill-yellow-500" : ""} />
        <span className="text-[10px] font-medium">{t('bn_subs')}</span>
      </button>
      <button onClick={() => setView(ViewState.PROFILE)} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${view === ViewState.PROFILE ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500'}`}>
        <User size={24} />
        <span className="text-[10px] font-medium">{t('bn_profile')}</span>
      </button>
    </div>
  );

  const HeaderButton = () => (
      <button 
        onClick={() => setIsMobileMenuOpen(true)}
        className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors md:hidden"
      >
        <Menu size={24} />
      </button>
  );

  const renderHome = () => {
    const activeUser = MOCK_USERS[swipeIndex];
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 w-full pb-20 md:pb-4">
        {/* Top Bar - Mobile Only */}
        <div className="w-full flex justify-between items-center mb-4 md:hidden">
            <HeaderButton />
            <h1 className="text-2xl font-black italic tracking-tighter">
                <span className="text-violet-600 dark:text-violet-500">Game</span>
                <span className="text-slate-900 dark:text-white">On</span>
            </h1>
            <div className="w-10"></div> {/* Spacer */}
        </div>

        <div className="flex-1 flex flex-col justify-center w-full max-w-md relative">
            {/* Card Stack */}
            <div className="relative w-full aspect-[3/4] max-h-[55vh] md:max-h-[600px]">
                {/* Background Card Effect */}
                <div className="absolute top-2 left-2 w-full h-full bg-slate-200 dark:bg-slate-800 rounded-3xl opacity-50 transform scale-95" />
                
                {/* Main Card */}
                <div className={`relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-slate-400/50 dark:shadow-black/50 bg-white dark:bg-slate-800 transition-all duration-300 transform 
                    ${matchAnimation === 'left' ? '-translate-x-full -rotate-12 opacity-0' : ''}
                    ${matchAnimation === 'right' ? 'translate-x-full rotate-12 opacity-0' : ''}
                    ${matchAnimation === 'up' ? '-translate-y-full opacity-0' : ''}
                `}>
                    <img src={activeUser.image} alt={activeUser.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-0 w-full p-6 text-white">
                        <div className="flex items-end gap-3 mb-2">
                            <h2 className="text-4xl font-bold drop-shadow-lg">{activeUser.name}</h2>
                            <span className="text-2xl font-light mb-1 drop-shadow-md">{activeUser.age}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4 text-slate-200 text-sm font-medium shadow-black drop-shadow-md">
                            <MapPin size={16} />
                            <span>{activeUser.distance} {t('distance_away')}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {activeUser.platforms.map(p => (
                                <span key={p} className="px-3 py-1 bg-violet-600/90 backdrop-blur-md rounded-full text-xs font-bold shadow-sm border border-violet-400/30">
                                    {p}
                                </span>
                            ))}
                        </div>

                        <p className="text-slate-100 line-clamp-2 mb-4 text-sm font-medium drop-shadow-md">
                            {activeUser.bio}
                        </p>

                        {/* Quick Games Preview */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {activeUser.games.map(g => (
                                <div key={g.id} className="text-2xl bg-black/60 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md border border-white/20 shrink-0 shadow-lg">
                                    {g.icon}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-8 mt-6 w-full">
                <button onClick={() => handleSwipe('left')} className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white dark:bg-slate-800/80 border-2 border-red-500 text-red-500 flex items-center justify-center text-3xl hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/30 hover:scale-110 backdrop-blur-sm group" title="Pass (Left Arrow)">
                    <X className="group-active:scale-90 transition-transform" />
                </button>
                <button onClick={() => handleSwipe('up')} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white dark:bg-slate-800/80 border-2 border-blue-400 text-blue-400 flex items-center justify-center text-xl hover:bg-blue-400 hover:text-white transition-all shadow-lg hover:shadow-blue-400/30 hover:scale-110 -mt-4 backdrop-blur-sm group" title="Super Like (Up Arrow)">
                    <Star fill="currentColor" className="group-active:scale-90 transition-transform" />
                </button>
                <button onClick={() => handleSwipe('right')} className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white dark:bg-slate-800/80 border-2 border-green-500 text-green-500 flex items-center justify-center text-3xl hover:bg-green-500 hover:text-white transition-all shadow-lg hover:shadow-green-500/30 hover:scale-110 backdrop-blur-sm group" title="Like (Right Arrow)">
                    <Heart fill="currentColor" className="group-active:scale-90 transition-transform" />
                </button>
            </div>
            
            <div className="hidden md:block text-center mt-4 text-xs text-slate-400 dark:text-slate-600 font-mono">
                {t('keyboard_shortcuts')}
            </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="h-full overflow-y-auto pb-24 md:pb-10 w-full">
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 md:hidden">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('nav_profile')}</h2>
        <HeaderButton />
      </div>

      <div className="p-6 md:p-10 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 hidden md:block text-slate-900 dark:text-white">{t('edit_profile_title')}</h2>

        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Image Section */}
            <div className="w-full md:w-auto flex flex-col items-center">
                <div className="relative w-40 h-40 group">
                    <div className="w-full h-full rounded-full p-1 bg-gradient-to-tr from-violet-500 to-fuchsia-500">
                        <img src={myProfile.image} className="w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-900" alt="Profile" />
                    </div>
                    <label className="absolute bottom-0 right-2 bg-white text-slate-900 p-2 rounded-full cursor-pointer shadow-lg hover:bg-slate-200 transition-colors border border-slate-200 dark:border-none">
                        <Camera size={20} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                </div>
                <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm">{t('change_photo')}</p>
            </div>

            {/* Form Section */}
            <div className="flex-1 space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('label_display_name')}</label>
                        <input 
                        type="text" 
                        value={myProfile.name}
                        onChange={(e) => handleUpdateProfile('name', e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('label_age')}</label>
                        <input 
                        type="number" 
                        value={myProfile.age}
                        onChange={(e) => handleUpdateProfile('age', parseInt(e.target.value))}
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('label_bio')}</label>
                    <textarea 
                        value={myProfile.bio}
                        onChange={(e) => handleUpdateProfile('bio', e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 transition-all h-32 resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('label_platforms')}</label>
                    <div className="flex flex-wrap gap-2">
                        {Object.values(Platform).map(p => {
                            const isActive = myProfile.platforms.includes(p);
                            return (
                                <button
                                    key={p}
                                    onClick={() => {
                                        const newPlatforms = isActive 
                                            ? myProfile.platforms.filter(pl => pl !== p)
                                            : [...myProfile.platforms, p];
                                        handleUpdateProfile('platforms', newPlatforms);
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${isActive ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'}`}
                                >
                                    {p === Platform.PS5 ? 'PlayStation' : p}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('label_my_games')}</label>
                        <button className="text-xs text-violet-600 dark:text-violet-400 flex items-center gap-1 hover:text-violet-500 bg-violet-100 dark:bg-violet-500/10 px-3 py-1 rounded-full">
                            <Plus size={14} /> {t('add_game')}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {myProfile.games.map(game => (
                            <GameCard 
                              key={game.id} 
                              game={game} 
                              labels={{
                                rank: t('game_rank'),
                                role: t('game_role'),
                                noInfo: t('no_info')
                              }}
                            />
                        ))}
                    </div>
                </div>

                <button 
                    onClick={() => handleViewChange(ViewState.HOME)}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-lg py-4 rounded-xl mt-8 shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                    {t('save_changes')}
                </button>
            </div>
        </div>
      </div>
    </div>
  );

  const renderMatches = () => (
    <div className="h-full flex flex-col w-full pb-20 md:pb-0">
       <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10 md:hidden">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('people_liked_you')}</h2>
         <HeaderButton />
      </div>
      
      <div className="p-6 md:p-10 flex-1 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 hidden md:block text-slate-900 dark:text-white">{t('matches_title')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {MOCK_USERS.map((user, idx) => (
                <div key={user.id} className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-violet-900/20 transition-all border border-transparent hover:border-violet-500/50" onClick={() => {
                    alert(`Opened profile: ${user.name}`);
                }}>
                    <img src={user.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-0 w-full p-4">
                        <p className="font-bold text-white text-lg">{user.name}, {user.age}</p>
                        <div className="flex gap-1 mt-2 text-xs text-slate-300">
                            {user.games.slice(0, 3).map(g => (
                                <span key={g.id} className="bg-slate-800/80 p-1 rounded backdrop-blur-sm">{g.icon}</span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="absolute top-3 right-3 bg-rose-500 p-2 rounded-full shadow-lg">
                        <Heart size={14} fill="white" className="text-white" />
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderChatList = () => (
    <div className="h-full flex flex-col w-full max-w-5xl mx-auto pb-20 md:pb-0">
       <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 md:bg-transparent md:pt-8 md:px-8">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white">{t('messages_title')}</h2>
          </div>
           <HeaderButton />
      </div>
      <div className="overflow-y-auto flex-1 p-0 md:p-8">
        <div className="flex flex-col gap-2">
            {chats.map(chat => (
                <div 
                    key={chat.id} 
                    onClick={() => { setActiveChatId(chat.id); setView(ViewState.CHAT_ROOM); }}
                    className="flex items-center gap-4 p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer border-b md:border border-slate-100 dark:border-slate-800/50 transition-colors md:rounded-2xl"
                >
                    <div className="relative">
                        <img src={chat.user.image} className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover" alt="" />
                        {chat.unread > 0 && (
                            <span className="absolute -top-1 -right-1 bg-violet-600 dark:bg-violet-500 text-white text-xs w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full border-4 border-white dark:border-slate-900">
                                {chat.unread}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-lg md:text-xl truncate text-slate-900 dark:text-white">{chat.user.name}</h3>
                            <span className="text-xs md:text-sm text-slate-500">{chat.timestamp}</span>
                        </div>
                        <p className={`text-sm md:text-base truncate ${chat.unread > 0 ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                            {chat.lastMessage}
                        </p>
                    </div>
                    <ChevronRight className={`text-slate-400 hidden md:block ${language === 'he' ? 'rotate-180' : ''}`} />
                </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderChatRoom = () => {
    const activeChat = chats.find(c => c.id === activeChatId);
    if (!activeChat) return null;

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 w-full max-w-4xl mx-auto border-x border-slate-200 dark:border-slate-800 md:shadow-2xl pb-20 md:pb-0">
            {/* Header */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900 shadow-sm md:p-4">
                <button onClick={() => setView(ViewState.CHAT_LIST)} className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-white ${language === 'he' ? '' : 'rotate-180'}`}><ChevronRight /></button>
                <img src={activeChat.user.image} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-violet-500" alt="" />
                <div>
                    <h3 className="font-bold text-sm md:text-base leading-tight text-slate-900 dark:text-white">{activeChat.user.name}</h3>
                    <span className="text-xs text-green-500 dark:text-green-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></span> {t('online_now')}
                    </span>
                </div>
                <div className="mr-auto" style={{ marginLeft: language === 'he' ? 'auto' : '0', marginRight: language === 'he' ? '0' : 'auto' }}>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><Settings className="text-slate-500 dark:text-slate-400 w-5 h-5" /></button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100 dark:bg-slate-950/50">
                {activeChat.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] md:max-w-[60%] px-5 py-3 rounded-2xl text-sm md:text-base leading-relaxed ${
                            msg.isMe 
                                ? `bg-violet-600 text-white ${language === 'he' ? 'rounded-tl-none' : 'rounded-tr-none'} shadow-md shadow-violet-900/20` 
                                : `bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 ${language === 'he' ? 'rounded-tr-none' : 'rounded-tl-none'} border border-slate-200 dark:border-slate-700 shadow-sm`
                        }`}>
                            {msg.text}
                            <span className={`text-[10px] block mt-2 opacity-70 ${msg.isMe ? 'text-violet-200' : 'text-slate-500 dark:text-slate-400'} ${language === 'he' ? 'text-left' : 'text-right'}`}>
                                {msg.timestamp}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        const input = (e.target as HTMLFormElement).elements.namedItem('msg') as HTMLInputElement;
                        handleSendMessage(input.value);
                        input.value = '';
                    }}
                    className="flex gap-3 items-center"
                >
                    <input 
                        name="msg"
                        type="text" 
                        placeholder={t('type_message')} 
                        autoComplete="off"
                        className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 border border-slate-300 dark:border-slate-700 transition-all hover:border-slate-400"
                    />
                    <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white p-4 rounded-full transition-colors shadow-lg shadow-violet-600/30 hover:scale-105 active:scale-95">
                        <Send size={20} className={language === 'he' ? 'transform rotate-180' : ''} />
                    </button>
                </form>
            </div>
        </div>
    );
  };

  const renderSubscription = () => (
    <div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 w-full pb-20 md:pb-0">
        <div className="p-4 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur z-20 md:hidden">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('upgrade_experience')}</h2>
             <HeaderButton />
        </div>
        
        <div className="p-6 md:p-12 space-y-6 max-w-6xl mx-auto pb-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500">{t('gold_title')}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">{t('gold_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {PLANS.map(plan => (
                    <div 
                        key={plan.id} 
                        className={`relative rounded-3xl p-1 bg-gradient-to-br ${plan.color} ${plan.isPopular ? 'shadow-2xl shadow-yellow-500/20 md:-mt-8 z-10' : 'opacity-90 grayscale-[30%] hover:grayscale-0 transition-all hover:scale-105 duration-300'}`}
                    >
                        {plan.isPopular && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                                {t('most_popular')}
                            </div>
                        )}
                        <div className="bg-white dark:bg-slate-900 rounded-[22px] p-6 md:p-8 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                                <div className="text-right">
                                    <span className="text-3xl font-bold text-slate-900 dark:text-white">${plan.price}</span>
                                    <span className="text-sm text-slate-500 block">{t('plan_per_month')}</span>
                                </div>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                        <div className={`mt-0.5 min-w-[20px] h-5 rounded-full flex items-center justify-center bg-gradient-to-br ${plan.color}`}>
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="font-medium">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r ${plan.color} shadow-lg hover:opacity-90 transition-all transform active:scale-95`}>
                                {t('select_plan')} {plan.name}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderSettings = () => {
    const MenuItem = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
        <button 
            onClick={() => setSettingsTab(id)}
            className={`flex items-center gap-3 w-full p-2.5 rounded transition-all mb-1 ${settingsTab === id ? 'bg-slate-300 dark:bg-[#3F4147] text-slate-900 dark:text-white' : 'text-slate-600 dark:text-[#949BA4] hover:bg-slate-200 dark:hover:bg-[#35373C] hover:text-slate-800 dark:hover:text-[#DBDEE1]'}`}
        >
            <Icon size={20} />
            <span className="font-medium text-sm">{label}</span>
        </button>
    );

    return (
        <div className="flex h-full w-full bg-[#F2F3F5] dark:bg-[#313338] text-slate-900 dark:text-[#DBDEE1] font-sans pb-20 md:pb-0">
            {/* Settings Sidebar */}
            <div className="w-full md:w-64 bg-slate-100 dark:bg-[#2B2D31] flex flex-col pt-4 md:pt-14 px-3 shrink-0 overflow-y-auto border-r border-slate-200 dark:border-none">
                 <div className="md:hidden flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg dark:text-white px-2">{t('settings_title')}</h2>
                    <HeaderButton />
                 </div>

                 <div className="px-2 mb-4">
                    <div className="relative">
                        <input 
                            placeholder={t('search_settings')} 
                            className="w-full bg-[#E3E5E8] dark:bg-[#1E1F22] p-1.5 px-3 rounded text-sm text-slate-900 dark:text-white focus:outline-none" 
                        />
                        <Search className={`absolute ${language === 'he' ? 'left-2' : 'right-2'} top-1.5 text-gray-500`} size={16} />
                    </div>
                 </div>

                 <div className="px-2 mb-2">
                    <h3 className="text-xs font-bold text-gray-500 dark:text-[#949BA4] uppercase mb-2 px-2">{t('user_settings')}</h3>
                    <MenuItem id="account" label={t('set_account')} icon={User} />
                    <MenuItem id="profile" label={t('set_profile')} icon={User} />
                    <MenuItem id="privacy" label={t('set_privacy')} icon={Shield} />
                    <MenuItem id="subscription" label={t('set_subs')} icon={Star} />
                 </div>

                 <div className="px-2 mb-2">
                    <h3 className="text-xs font-bold text-gray-500 dark:text-[#949BA4] uppercase mb-2 px-2 mt-4">{t('app_settings')}</h3>
                    <MenuItem id="appearance" label={t('set_appearance')} icon={Monitor} />
                    <MenuItem id="language" label={t('set_language')} icon={Globe} />
                    <MenuItem id="notifications" label={t('set_notifications')} icon={Bell} />
                    <MenuItem id="devices" label={t('set_devices')} icon={Smartphone} />
                 </div>

                 <div className="mt-auto mb-4 px-2">
                    <button className="flex items-center gap-3 w-full p-2.5 rounded text-red-500 hover:bg-red-500/10 transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium text-sm">{t('nav_logout')}</span>
                    </button>
                 </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white dark:bg-[#313338] p-6 md:p-14 overflow-y-auto">
                <div className="max-w-3xl">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                        {settingsTab === 'account' && t('set_account')}
                        {settingsTab === 'profile' && t('set_profile')}
                        {settingsTab === 'appearance' && t('set_appearance')}
                        {settingsTab === 'language' && t('set_language')}
                        {settingsTab === 'privacy' && t('set_privacy')}
                        {settingsTab === 'subscription' && t('set_subs')}
                    </h2>

                    {settingsTab === 'language' && (
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-gray-500 dark:text-[#B5BAC1] uppercase mb-4">{t('choose_lang')}</h3>
                            <div className="bg-[#F2F3F5] dark:bg-[#2B2D31] rounded-lg p-1 max-w-lg">
                                {[
                                    { code: 'he', label: 'עברית', flag: '🇮🇱' },
                                    { code: 'en', label: 'English', flag: '🇺🇸' },
                                    { code: 'es', label: 'Español', flag: '🇪🇸' },
                                    { code: 'fr', label: 'Français', flag: '🇫🇷' }
                                ].map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code as any)}
                                        className={`w-full flex items-center justify-between p-4 rounded-md transition-all ${language === lang.code ? 'bg-white dark:bg-[#404249] shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-[#35373C]'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{lang.flag}</span>
                                            <span className={`font-medium ${language === lang.code ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-[#949BA4]'}`}>{lang.label}</span>
                                        </div>
                                        {language === lang.code && (
                                            <div className="w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-[#313338] flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {settingsTab === 'appearance' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 dark:text-[#B5BAC1] uppercase mb-4">{t('theme')}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div 
                                        onClick={() => setDarkMode(false)}
                                        className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center gap-3 bg-white ${!darkMode ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-gray-200 dark:border-[#1E1F22]'}`}
                                    >
                                        <div className="w-full h-24 bg-[#F2F3F5] rounded flex items-center justify-center">
                                            <div className="bg-white w-3/4 h-3/4 rounded shadow-sm"></div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Sun size={16} />
                                            <span className="font-medium">{t('theme_light')}</span>
                                        </div>
                                    </div>

                                    <div 
                                        onClick={() => setDarkMode(true)}
                                        className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center gap-3 bg-[#2B2D31] ${darkMode ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-gray-200 dark:border-[#1E1F22]'}`}
                                    >
                                        <div className="w-full h-24 bg-[#313338] rounded flex items-center justify-center">
                                             <div className="bg-[#2B2D31] w-3/4 h-3/4 rounded shadow-sm"></div>
                                        </div>
                                        <div className="flex items-center gap-2 text-white">
                                            <Moon size={16} />
                                            <span className="font-medium">{t('theme_dark')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {settingsTab === 'account' && (
                         <div className="bg-[#F2F3F5] dark:bg-[#2B2D31] rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <img src={myProfile.image} className="w-20 h-20 rounded-full object-cover border-4 border-[#313338]" alt="" />
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{myProfile.name}</h3>
                                        <p className="text-gray-500 text-sm">#{Math.floor(Math.random() * 9000) + 1000}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleViewChange(ViewState.PROFILE)} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                                    {t('edit_profile_title')}
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-white dark:bg-[#1E1F22] p-4 rounded flex justify-between items-center">
                                    <div>
                                        <p className="text-xs uppercase font-bold text-gray-500 mb-1">{t('username')}</p>
                                        <p className="text-slate-900 dark:text-white font-medium">{myProfile.name}</p>
                                    </div>
                                    <button className="bg-slate-200 dark:bg-[#313338] hover:bg-slate-300 dark:hover:bg-[#404249] px-4 py-1.5 rounded text-sm transition-colors text-slate-900 dark:text-white">{t('edit')}</button>
                                </div>
                                <div className="bg-white dark:bg-[#1E1F22] p-4 rounded flex justify-between items-center">
                                    <div>
                                        <p className="text-xs uppercase font-bold text-gray-500 mb-1">{t('email')}</p>
                                        <p className="text-slate-900 dark:text-white font-medium">gamer@example.com</p>
                                    </div>
                                    <button className="bg-slate-200 dark:bg-[#313338] hover:bg-slate-300 dark:hover:bg-[#404249] px-4 py-1.5 rounded text-sm transition-colors text-slate-900 dark:text-white">{t('edit')}</button>
                                </div>
                                <div className="bg-white dark:bg-[#1E1F22] p-4 rounded flex justify-between items-center">
                                    <div>
                                        <p className="text-xs uppercase font-bold text-gray-500 mb-1">{t('phone')}</p>
                                        <p className="text-slate-900 dark:text-white font-medium">*********05</p>
                                    </div>
                                    <button className="bg-slate-200 dark:bg-[#313338] hover:bg-slate-300 dark:hover:bg-[#404249] px-4 py-1.5 rounded text-sm transition-colors text-slate-900 dark:text-white">{t('edit')}</button>
                                </div>
                            </div>
                         </div>
                    )}
                </div>
            </div>

            {/* Right Panel (Active Now style from image) */}
            <div className="hidden xl:block w-80 bg-slate-100 dark:bg-[#2B2D31] p-4 border-l border-slate-200 dark:border-[#1E1F22]">
                <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">{t('preview_title')}</h3>
                
                {/* Mini Profile Card */}
                <div className="bg-white dark:bg-[#111214] rounded-lg p-0 overflow-hidden shadow-lg border border-slate-200 dark:border-none">
                     <div className="h-16 bg-violet-600"></div>
                     <div className="px-4 pb-4">
                        <div className="relative -mt-8 mb-3">
                             <img src={myProfile.image} className="w-16 h-16 rounded-full border-4 border-white dark:border-[#111214]" alt="" />
                             <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#111214]"></div>
                        </div>
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">{myProfile.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-[#B5BAC1] mb-4 border-b border-gray-200 dark:border-[#2F3136] pb-3">
                            {myProfile.bio}
                        </p>
                        
                        <h5 className="uppercase text-xs font-bold text-gray-500 dark:text-[#B5BAC1] mb-2">{t('playing_on')}</h5>
                        <div className="flex gap-2 mb-4">
                            {myProfile.platforms.map(p => (
                                <div key={p} className="bg-slate-100 dark:bg-[#2F3136] p-1.5 rounded text-slate-600 dark:text-[#B5BAC1]">
                                    <Gamepad2 size={16} />
                                </div>
                            ))}
                        </div>
                     </div>
                </div>

                <div className="mt-6 bg-slate-200 dark:bg-[#1E1F22] rounded-lg p-4">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">{t('active_now')}</h4>
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded bg-green-600 flex items-center justify-center text-white">
                             <Gamepad2 />
                         </div>
                         <div>
                             <p className="text-sm font-bold text-slate-900 dark:text-white">Warzone</p>
                             <p className="text-xs text-gray-500">{t('playing_for')} 2h</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans overflow-hidden transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 shrink-0 relative z-20 shadow-2xl transition-colors duration-200">
         <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
         {/* Views */}
         {view === ViewState.HOME && renderHome()}
         {view === ViewState.PROFILE && renderProfile()}
         {view === ViewState.MATCHES && renderMatches()}
         {view === ViewState.CHAT_LIST && renderChatList()}
         {view === ViewState.CHAT_ROOM && renderChatRoom()}
         {view === ViewState.SUBSCRIPTION && renderSubscription()}
         {view === ViewState.SETTINGS && renderSettings()}
         
         {/* Mobile Bottom Navigation */}
         <BottomNav />
         
         {/* Mobile Drawer */}
         <MobileMenu />
      </main>
    </div>
  );
};

export default App;