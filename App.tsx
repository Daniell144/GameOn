import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  X, Heart, Star, User, MessageCircle, 
  Gamepad2, ChevronRight, Camera, 
  Settings, Send, Sun, Moon, Shield, Globe, Search, Users, ChevronLeft,
  Monitor, ChevronDown, Coins, Trophy, CalendarCheck, CheckCircle2, ShoppingBag, Palette, Check, Eye, EyeOff, Sparkles, Layout, Gem, FilterX, SearchCode
} from 'lucide-react';
import { ViewState, UserProfile, ChatThread, Theme, Cosmetic } from './types';
import { INITIAL_PROFILE, MOCK_USERS, MOCK_CHATS, PLANS, CURRENT_USER_ID, TRANSLATIONS, POPULAR_GAMES, SHOP_THEMES, PROFILE_COSMETICS } from './constants';

const App = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [shopTab, setShopTab] = useState<'themes' | 'borders' | 'colors'>('themes');
  const [myProfile, setMyProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('gameon_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [chats, setChats] = useState<ChatThread[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [matchAnimation, setMatchAnimation] = useState<'left' | 'right' | 'up' | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('gameon_dark_mode') === 'true';
  });
  const [settingsTab, setSettingsTab] = useState('appearance');
  const [language, setLanguage] = useState<'he' | 'en'>('he');
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Currency (Crystals/Diamonds) State
  const [userCurrency, setUserCurrency] = useState(() => {
    const saved = localStorage.getItem('gameon_currency');
    const oldSaved = localStorage.getItem('gameon_points');
    return saved ? parseInt(saved, 10) : (oldSaved ? parseInt(oldSaved, 10) : 200);
  });
  const [sentMessagesCounter, setSentMessagesCounter] = useState(() => {
    const saved = localStorage.getItem('gameon_msg_counter');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Daily Login System State
  const [loginStreak, setLoginStreak] = useState(() => {
    const saved = localStorage.getItem('gameon_login_streak');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lastLoginDate, setLastLoginDate] = useState(() => {
    return localStorage.getItem('gameon_last_login');
  });
  const [superLikesCount, setSuperLikesCount] = useState(() => {
    const saved = localStorage.getItem('gameon_super_likes');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showRewardModal, setShowRewardModal] = useState(false);

  // Shop States
  const [unlockedThemeIds, setUnlockedThemeIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('gameon_unlocked_themes');
    return saved ? JSON.parse(saved) : ['default', 'light', 'dark'];
  });
  const [unlockedCosmeticIds, setUnlockedCosmeticIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('gameon_unlocked_cosmetics');
    return saved ? JSON.parse(saved) : ['border-basic', 'color-white'];
  });
  const [activeThemeId, setActiveThemeId] = useState(() => {
    return localStorage.getItem('gameon_active_theme') || 'light';
  });
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);

  // Discovery Filters
  const [onlyMutual, setOnlyMutual] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const t = (key: string) => {
    return TRANSLATIONS[language][key] || key;
  };

  const handleSetView = (newView: ViewState) => {
    if (view === ViewState.SHOP && newView !== ViewState.SHOP) {
      setPreviewThemeId(null);
    }
    setView(newView);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsGameDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [language, darkMode]);

  useEffect(() => {
    const themeToApply = previewThemeId || activeThemeId;
    const themeObj = SHOP_THEMES.find(t => t.id === themeToApply) || SHOP_THEMES[0];
    
    // Remove all theme classes first
    SHOP_THEMES.forEach(theme => document.body.classList.remove(theme.accentClass));
    // Apply the current theme class
    document.body.classList.add(themeObj.accentClass);
    
    // Auto-toggle dark mode for core themes if not in preview
    if (!previewThemeId) {
      if (activeThemeId === 'light') setDarkMode(false);
      if (activeThemeId === 'dark') setDarkMode(true);
    } else {
      if (previewThemeId === 'light') setDarkMode(false);
      if (previewThemeId === 'dark') setDarkMode(true);
    }
  }, [activeThemeId, previewThemeId]);

  useEffect(() => {
    localStorage.setItem('gameon_currency', userCurrency.toString());
    localStorage.setItem('gameon_msg_counter', sentMessagesCounter.toString());
    localStorage.setItem('gameon_login_streak', loginStreak.toString());
    localStorage.setItem('gameon_super_likes', superLikesCount.toString());
    localStorage.setItem('gameon_unlocked_themes', JSON.stringify(unlockedThemeIds));
    localStorage.setItem('gameon_unlocked_cosmetics', JSON.stringify(unlockedCosmeticIds));
    localStorage.setItem('gameon_profile', JSON.stringify(myProfile));
    localStorage.setItem('gameon_active_theme', activeThemeId);
    localStorage.setItem('gameon_dark_mode', darkMode.toString());
    if (lastLoginDate) localStorage.setItem('gameon_last_login', lastLoginDate);
  }, [userCurrency, sentMessagesCounter, loginStreak, superLikesCount, lastLoginDate, unlockedThemeIds, unlockedCosmeticIds, myProfile, activeThemeId, darkMode]);

  useEffect(() => {
    const today = new Date().toDateString();
    if (lastLoginDate !== today) {
      handleDailyLogin(today);
    }
  }, []);

  const handleDailyLogin = (todayStr: string) => {
    setLastLoginDate(todayStr);
    const newStreak = loginStreak >= 7 ? 1 : loginStreak + 1;
    setLoginStreak(newStreak);
    setUserCurrency(prev => prev + 1);
    if (newStreak === 7) setSuperLikesCount(prev => prev + 1);
    setShowRewardModal(true);
  };

  const handlePurchaseTheme = (theme: Theme) => {
    if (userCurrency >= theme.cost) {
      setUserCurrency(prev => prev - theme.cost);
      setUnlockedThemeIds(prev => [...prev, theme.id]);
      setPreviewThemeId(null);
    } else {
      alert(t('not_enough_points'));
    }
  };

  const handlePurchaseCosmetic = (cosmetic: Cosmetic) => {
    if (userCurrency >= cosmetic.cost) {
      setUserCurrency(prev => prev - cosmetic.cost);
      setUnlockedCosmeticIds(prev => [...prev, cosmetic.id]);
    } else {
      alert(t('not_enough_points'));
    }
  };

  const handleEquipCosmetic = (cosmetic: Cosmetic) => {
    if (cosmetic.type === 'BORDER') {
      setMyProfile(prev => ({ ...prev, equippedBorderId: cosmetic.id }));
    } else {
      setMyProfile(prev => ({ ...prev, equippedNameColorId: cosmetic.id }));
    }
  };

  const filteredDiscoveryUsers = useMemo(() => {
    let users = MOCK_USERS;
    if (onlyMutual) {
      const myGameIds = myProfile.games.map(g => g.id);
      users = users.filter(u => u.games.some(uGame => myGameIds.includes(uGame.id)));
    }
    if (selectedGameId) {
      users = users.filter(u => u.games.some(g => g.id === selectedGameId));
    }
    return users;
  }, [onlyMutual, selectedGameId, myProfile.games]);

  const activeUser = filteredDiscoveryUsers.length > 0 
    ? filteredDiscoveryUsers[swipeIndex % filteredDiscoveryUsers.length] 
    : null;

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up') => {
    if (matchAnimation || filteredDiscoveryUsers.length === 0) return;
    if (direction === 'up' && superLikesCount > 0) setSuperLikesCount(prev => prev - 1);
    setMatchAnimation(direction);
    setTimeout(() => {
      setSwipeIndex((prev) => (prev + 1) % filteredDiscoveryUsers.length);
      setMatchAnimation(null);
    }, 300);
  }, [matchAnimation, filteredDiscoveryUsers.length, superLikesCount]);

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
    const nextCounter = sentMessagesCounter + 1;
    if (nextCounter >= 10) {
      setUserCurrency(prev => prev + 10);
      setSentMessagesCounter(0);
    } else {
      setSentMessagesCounter(nextCounter);
    }
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

  const equippedBorder = PROFILE_COSMETICS.find(c => c.id === myProfile.equippedBorderId);
  const equippedNameColor = PROFILE_COSMETICS.find(c => c.id === myProfile.equippedNameColorId);

  const selectedGame = useMemo(() => POPULAR_GAMES.find(g => g.id === selectedGameId), [selectedGameId]);

  const ModernSidebar = () => (
    <div className="w-20 lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0 transition-all duration-300 relative z-10">
        <div className="p-4 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                <Gamepad2 className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white hidden lg:block tracking-tight">GameOn</span>
        </div>
        
        <div className="px-4 pt-6 pb-2 hidden lg:block space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-500">
                        <Gem size={18} />
                    </div>
                    <div className="flex-1">
                        <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('currency')}</div>
                        <div className="text-lg font-black text-slate-900 dark:text-white leading-tight">{userCurrency}</div>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {[
                { v: ViewState.HOME, i: Gamepad2, l: t('nav_discover') },
                { v: ViewState.MATCHES, i: Heart, l: t('nav_matches') },
                { v: ViewState.CHAT_LIST, i: MessageCircle, l: t('nav_chats') },
                { v: ViewState.SHOP, i: ShoppingBag, l: t('nav_shop') },
                { v: ViewState.SUBSCRIPTION, i: Star, l: t('nav_subs') },
                { v: ViewState.PROFILE, i: User, l: t('nav_profile') },
                { v: ViewState.SETTINGS, i: Settings, l: t('nav_settings') },
            ].map((item) => (
                <button
                    key={item.v}
                    onClick={() => handleSetView(item.v)}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200
                    ${view === item.v 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
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
            { v: ViewState.PROFILE, i: User, l: t('bn_profile') },
        ].map(item => (
            <button
                key={item.v}
                onClick={() => handleSetView(item.v)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors
                ${view === item.v ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
            >
                <item.i size={20} strokeWidth={view === item.v ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.l}</span>
            </button>
        ))}
    </div>
  );

  const renderShop = () => {
    const borders = PROFILE_COSMETICS.filter(c => c.type === 'BORDER');
    const colors = PROFILE_COSMETICS.filter(c => c.type === 'NAME_COLOR');

    return (
      <div className="p-8 md:p-12 h-full overflow-y-auto animate-slide-in relative">
        {previewThemeId && shopTab === 'themes' && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-8 py-3 rounded-full font-black text-sm shadow-2xl z-[100] border-4 border-white flex items-center gap-3 animate-bounce">
            <Eye size={18} />
            {language === 'he' ? 'אתה במצב תצוגה מקדימה!' : 'Preview Mode Active!'}
            <button onClick={() => setPreviewThemeId(null)} className="ml-4 bg-white/20 hover:bg-white/40 p-1 rounded-lg"><X size={14} /></button>
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          <header className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 bg-blue-100 dark:bg-blue-900/30 px-6 py-2 rounded-full mb-6 border border-blue-200 dark:border-blue-900/50 shadow-sm">
              <Gem className="text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-black text-blue-700 dark:text-blue-300">{userCurrency}</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">{t('shop_title')}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto">{t('shop_subtitle')}</p>
          </header>

          <div className="flex justify-center mb-10">
            <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex gap-1 shadow-inner border border-slate-200 dark:border-slate-700">
              {[
                { id: 'themes', l: t('tab_themes'), i: Palette },
                { id: 'borders', l: t('tab_borders'), i: Layout },
                { id: 'colors', l: t('tab_names'), i: Sparkles },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setShopTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all
                    ${shopTab === tab.id 
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-md' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <tab.i size={18} />
                  {tab.l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {shopTab === 'themes' && SHOP_THEMES.map(theme => {
              const isUnlocked = unlockedThemeIds.includes(theme.id);
              const isActive = activeThemeId === theme.id;
              const isPreviewing = previewThemeId === theme.id;
              return (
                <div key={theme.id} className={`group relative rounded-[2.5rem] p-8 flex flex-col bg-white dark:bg-slate-800 border-4 transition-all overflow-hidden ${isActive ? 'border-blue-600 scale-[1.02]' : isPreviewing ? 'border-blue-400 scale-[1.02] shadow-2xl' : 'border-transparent shadow-xl'}`}>
                  <div className={`h-32 w-full rounded-2xl mb-6 bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg relative`}>
                    <Palette className="text-white/40 group-hover:text-white/80 transition-colors" size={48} />
                    {theme.cost === 0 && <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase">FREE</span>}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 uppercase">{theme.name}</h3>
                  <div className="mt-auto space-y-3">
                    {!isActive && (
                      <button onClick={() => setPreviewThemeId(isPreviewing ? null : theme.id)} className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all border-2 ${isPreviewing ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-500'}`}>
                        {isPreviewing ? <EyeOff size={16} /> : <Eye size={16} />}
                        {isPreviewing ? (language === 'he' ? 'בטל תצוגה' : 'Stop Preview') : (language === 'he' ? 'תצוגה מקדימה' : 'Preview')}
                      </button>
                    )}
                    {isActive ? (
                      <div className="w-full py-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-center flex items-center justify-center gap-2"><Check size={20} /> {t('active')}</div>
                    ) : isUnlocked ? (
                      <button onClick={() => { setActiveThemeId(theme.id); setPreviewThemeId(null); }} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all">{t('equip')}</button>
                    ) : (
                      <button onClick={() => handlePurchaseTheme(theme)} disabled={userCurrency < theme.cost} className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${userCurrency >= theme.cost ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}><Gem size={18} /> {theme.cost}</button>
                    )}
                  </div>
                </div>
              );
            })}

            {shopTab === 'borders' && borders.map(cosmetic => {
              const isUnlocked = unlockedCosmeticIds.includes(cosmetic.id);
              const isActive = myProfile.equippedBorderId === cosmetic.id;
              return (
                <div key={cosmetic.id} className={`bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border-4 transition-all ${isActive ? 'border-blue-600' : 'border-transparent'}`}>
                  <div className="flex justify-center mb-6">
                    <div className={`w-32 h-32 rounded-full overflow-hidden ${cosmetic.style} transition-all duration-500`}>
                      <img src={myProfile.image} className="w-full h-full object-cover" alt="" />
                    </div>
                  </div>
                  <h3 className="text-center font-black mb-6 uppercase text-sm tracking-widest">{cosmetic.name}</h3>
                  {isActive ? (
                    <div className="w-full py-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-center flex items-center justify-center gap-2"><Check size={20} /> {t('active')}</div>
                  ) : isUnlocked ? (
                    <button onClick={() => handleEquipCosmetic(cosmetic)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all">{t('equip')}</button>
                  ) : (
                    <button onClick={() => handlePurchaseCosmetic(cosmetic)} disabled={userCurrency < cosmetic.cost} className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${userCurrency >= cosmetic.cost ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}><Gem size={18} /> {cosmetic.cost}</button>
                  )}
                </div>
              );
            })}

            {shopTab === 'colors' && colors.map(cosmetic => {
              const isUnlocked = unlockedCosmeticIds.includes(cosmetic.id);
              const isActive = myProfile.equippedNameColorId === cosmetic.id;
              return (
                <div key={cosmetic.id} className={`bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border-4 transition-all ${isActive ? 'border-blue-600' : 'border-transparent'}`}>
                  <div className="text-center mb-8 h-12 flex items-center justify-center">
                    <span className={`text-2xl font-black ${cosmetic.style}`}>{myProfile.name}</span>
                  </div>
                  <h3 className="text-center font-black mb-6 uppercase text-sm tracking-widest">{cosmetic.name}</h3>
                  {isActive ? (
                    <div className="w-full py-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-center flex items-center justify-center gap-2"><Check size={20} /> {t('active')}</div>
                  ) : isUnlocked ? (
                    <button onClick={() => handleEquipCosmetic(cosmetic)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all">{t('equip')}</button>
                  ) : (
                    <button onClick={() => handlePurchaseCosmetic(cosmetic)} disabled={userCurrency < cosmetic.cost} className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${userCurrency >= cosmetic.cost ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}><Gem size={18} /> {cosmetic.cost}</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderHome = () => (
    <div className="h-full flex flex-col items-center p-4 pt-2 relative overflow-hidden">
        {/* Filter Section */}
        <div className="w-full max-w-4xl z-50 mb-6 mt-4 flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-4 px-2 relative" ref={dropdownRef}>
                <button 
                    onClick={() => setOnlyMutual(!onlyMutual)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all shadow-sm shrink-0
                    ${onlyMutual 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-blue-500/30' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400'}`}
                >
                    <Users size={18} />
                    <span className="text-sm font-bold tracking-tight whitespace-nowrap">{t('find_mutual')}</span>
                </button>
                
                <div className="relative">
                  <button 
                      onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
                      className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all shadow-sm min-w-[160px] justify-between
                      ${selectedGameId 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-blue-500/30' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400'}`}
                  >
                      <div className="flex items-center gap-2">
                          <Gamepad2 size={18} />
                          <span className="text-sm font-bold tracking-tight whitespace-nowrap">
                              {selectedGame ? `${selectedGame.icon} ${selectedGame.name}` : t('all_games')}
                          </span>
                      </div>
                      <ChevronDown size={16} className={`transition-transform duration-300 ${isGameDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isGameDropdownOpen && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-slide-in max-h-[300px] overflow-y-auto">
                        <button 
                            onClick={() => { setSelectedGameId(null); setIsGameDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left font-bold text-sm text-slate-600 dark:text-slate-300"
                        >
                            <FilterX size={16} />
                            {t('all_games')}
                        </button>
                        {POPULAR_GAMES.map(game => (
                            <button
                                key={game.id}
                                onClick={() => { setSelectedGameId(game.id); setIsGameDropdownOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left font-bold text-sm
                                ${selectedGameId === game.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}
                            >
                                <span className="text-xl">{game.icon}</span>
                                {game.name}
                                {selectedGameId === game.id && <Check size={14} className="ml-auto" />}
                            </button>
                        ))}
                    </div>
                  )}
                </div>

                {(onlyMutual || selectedGameId) && (
                  <button 
                    onClick={() => { setOnlyMutual(false); setSelectedGameId(null); }}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 transition-colors"
                  >
                    <FilterX size={18} />
                  </button>
                )}
            </div>
        </div>

        {/* Discovery Card */}
        <div className="w-full max-w-md relative aspect-[3/4.5] sm:aspect-[3/4] mb-8">
           {activeUser ? (
              <div className={`absolute inset-0 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 ease-out transform
                  ${matchAnimation === 'left' ? '-translate-x-[150%] rotate-[-20deg] opacity-0' : ''}
                  ${matchAnimation === 'right' ? 'translate-x-[150%] rotate-[20deg] opacity-0' : ''}
                  ${matchAnimation === 'up' ? '-translate-y-[150%] opacity-0' : ''}
              `}>
                  <div className="absolute inset-0">
                      <img src={activeUser.image} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h2 className="text-4xl font-black mb-3">{activeUser.name}</h2>
                      <div className="flex flex-wrap gap-2.5">
                          {activeUser.games.map(g => (
                              <span key={g.id} className="text-xs bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full font-bold">
                                  {g.icon} {g.name}
                              </span>
                          ))}
                      </div>
                  </div>
              </div>
           ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-100 dark:bg-slate-900/50 rounded-[2.5rem]">
                  <Search className="text-slate-400 mb-4" size={32} />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('players_found')} (0)</h3>
                  <button 
                    onClick={() => { setOnlyMutual(false); setSelectedGameId(null); }}
                    className="mt-4 text-blue-600 font-bold"
                  >
                    איפוס מסננים
                  </button>
              </div>
           )}
        </div>
        
        {activeUser && (
            <div className="flex items-center gap-8 mb-6">
                <button onClick={() => handleSwipe('left')} className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 text-red-500 flex items-center justify-center shadow-xl border border-slate-100 dark:border-slate-700">
                    <X size={32} strokeWidth={3} />
                </button>
                <button onClick={() => handleSwipe('up')} className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 text-blue-500 flex items-center justify-center shadow-xl border border-slate-100 dark:border-slate-700 relative">
                    <Star size={28} fill="currentColor" />
                    {superLikesCount > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">{superLikesCount}</span>}
                </button>
                <button onClick={() => handleSwipe('right')} className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 text-emerald-500 flex items-center justify-center shadow-xl border border-slate-100 dark:border-slate-700">
                    <Heart size={32} fill="currentColor" />
                </button>
            </div>
        )}
    </div>
  );

  const renderProfile = () => (
      <div className="max-w-2xl mx-auto p-4 md:p-8 h-full overflow-y-auto animate-slide-in">
          <h1 className="text-3xl font-black mb-8">{t('edit_profile_title')}</h1>
          <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center">
                  <Gem size={24} className="text-blue-500 mb-3" />
                  <div className="text-2xl font-black">{userCurrency}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('currency')}</div>
              </div>
              <div onClick={() => handleSetView(ViewState.SHOP)} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center cursor-pointer border-2 border-transparent hover:border-blue-600 transition-colors group">
                  <ShoppingBag size={24} className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-lg font-black uppercase">{t('he' === language ? 'חנות' : 'Shop')}</div>
              </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
              <div className="px-10 pb-10">
                  <div className="relative -mt-20 mb-8 flex flex-col items-center">
                      <div className={`relative w-40 h-40 rounded-full ${equippedBorder?.style} overflow-hidden border-[6px] border-white dark:border-slate-800 shadow-2xl transition-all duration-500`}>
                          <img src={myProfile.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <button className="absolute bottom-2 right-1/2 translate-x-[60px] bg-blue-600 text-white p-3 rounded-2xl shadow-lg"><Camera size={22} /></button>
                      <h2 className={`mt-6 text-3xl font-black tracking-tight ${equippedNameColor?.style}`}>{myProfile.name}</h2>
                  </div>
                  <div className="grid gap-8">
                      <div className="space-y-2">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{t('label_display_name')}</label>
                          <input value={myProfile.name} onChange={(e) => handleUpdateProfile('name', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all" />
                      </div>
                      <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20">{t('save_changes')}</button>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderMatches = () => (
      <div className="p-4 md:p-10 h-full overflow-y-auto animate-slide-in">
          <h1 className="text-3xl font-black mb-8">{t('matches_title')}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {MOCK_USERS.map((user) => (
                  <div key={user.id} className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg">
                      <img src={user.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-6">
                          <span className="text-white font-black text-xl mb-1">{user.name}</span>
                          <span className="text-white/80 text-sm font-bold uppercase">{user.age} • {user.distance}</span>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderChatList = () => (
      <div className="max-w-3xl mx-auto p-4 md:p-8 h-full flex flex-col animate-slide-in">
          <h1 className="text-3xl font-black mb-6">{t('messages_title')}</h1>
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl flex-1 overflow-hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-700 border border-slate-100 dark:border-slate-700">
              {chats.map((chat) => (
                  <div key={chat.id} onClick={() => { setActiveChatId(chat.id); handleSetView(ViewState.CHAT_ROOM); }} className="p-6 flex items-center gap-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all group">
                      <img src={chat.user.image} className="w-16 h-16 rounded-[1.25rem] object-cover" alt="" />
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                              <h3 className="font-black text-lg truncate">{chat.user.name}</h3>
                              <span className="text-xs font-bold text-slate-400 uppercase">{chat.timestamp}</span>
                          </div>
                          <p className="text-sm font-medium text-slate-500 truncate">{chat.lastMessage}</p>
                      </div>
                      <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" size={20} />
                  </div>
              ))}
          </div>
      </div>
  );

  const renderChatRoom = () => {
      const activeChat = chats.find(c => c.id === activeChatId);
      if (!activeChat) return null;
      return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-900 animate-slide-in">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
                 <button onClick={() => handleSetView(ViewState.CHAT_LIST)} className="md:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><ChevronLeft /></button>
                 <img src={activeChat.user.image} className="w-12 h-12 rounded-[1rem] shadow-md" alt="" />
                 <div>
                    <h2 className="font-black text-xl tracking-tight">{activeChat.user.name}</h2>
                    <span className="text-xs font-bold text-emerald-500 uppercase">{t('online_now')}</span>
                 </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
                {activeChat.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-sm font-medium text-sm ${msg.isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 rounded-tl-none border border-slate-100 dark:border-slate-700'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <form className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800" onSubmit={(e) => { e.preventDefault(); handleSendMessage((e.target as any).msg.value); (e.target as any).msg.value=''; }}>
                <div className="flex gap-4">
                    <input name="msg" className="flex-1 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] px-6 py-3.5 outline-none font-bold focus:border-blue-500 transition-all" placeholder={t('type_message')} />
                    <button type="submit" className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/20 active:scale-90 transition-all shrink-0">
                        <Send size={24} />
                    </button>
                </div>
            </form>
        </div>
      );
  };

  const renderSubscription = () => (
    <div className="p-8 md:p-12 h-full overflow-y-auto animate-slide-in">
        <h1 className="text-4xl font-black text-center mb-4 tracking-tight uppercase">{t('gold_title')}</h1>
        <p className="text-center text-slate-500 mb-12 max-w-xl mx-auto font-medium">{t('gold_subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PLANS.map((plan) => (
                <div key={plan.id} className={`relative rounded-[3rem] p-10 flex flex-col bg-white dark:bg-slate-800 border-4 ${plan.isPopular ? 'border-blue-600 scale-105 shadow-2xl z-10 shadow-blue-500/20' : 'border-transparent shadow-xl shadow-slate-200/50 dark:shadow-black/20'}`}>
                    {plan.isPopular && <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-black px-6 py-2 rounded-full shadow-lg uppercase tracking-widest">{t('most_popular')}</div>}
                    <h3 className={`text-2xl font-black mb-2 bg-gradient-to-r ${plan.color} bg-clip-text text-transparent uppercase tracking-tight`}>{plan.name}</h3>
                    <div className="text-5xl font-black mb-8 tracking-tighter">${plan.price}<span className="text-lg font-bold text-slate-400 lowercase tracking-normal"> {t('plan_per_month')}</span></div>
                    <ul className="space-y-5 mb-10 flex-1">
                        {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                                <Shield size={16} className="text-blue-600" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button className={`w-full py-5 rounded-[1.5rem] font-black text-xl text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-r ${plan.color}`}>{t('select_plan')}</button>
                </div>
            ))}
        </div>
    </div>
  );

  const renderSettings = () => (
    <div className="flex h-full animate-slide-in">
         <div className="w-20 lg:w-64 bg-slate-50 dark:bg-slate-800/50 flex flex-col border-r border-slate-100 dark:border-slate-800 shrink-0">
            <div className="p-6">
                 <div className="text-slate-400 font-black mb-4 px-2 text-[10px] uppercase tracking-widest">{t('user_settings')}</div>
                 {[
                    { id: 'appearance', l: t('set_appearance'), i: Monitor },
                    { id: 'language', l: t('set_language'), i: Globe },
                 ].map(item => (
                     <div key={item.id} onClick={() => setSettingsTab(item.id)} className={`px-3 py-3 mb-1 rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${settingsTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
                         <item.i size={18} />
                         <span className="hidden lg:block font-bold">{item.l}</span>
                     </div>
                 ))}
            </div>
         </div>
         <div className="flex-1 p-10 overflow-y-auto">
             {settingsTab === 'appearance' && (
                 <div className="max-w-2xl">
                     <h2 className="text-3xl font-black mb-8">{t('set_appearance')}</h2>
                     <div className="flex gap-6">
                         <div onClick={() => { setDarkMode(false); setActiveThemeId('light'); }} className={`flex-1 p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl cursor-pointer border-4 transition-all ${!darkMode ? 'border-blue-600 ring-8 ring-blue-500/10' : 'border-transparent'}`}>
                             <Sun className="text-yellow-500 w-12 h-12 mb-4 mx-auto" />
                             <div className="text-center font-black">{t('theme_light')}</div>
                         </div>
                         <div onClick={() => { setDarkMode(true); setActiveThemeId('dark'); }} className={`flex-1 p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl cursor-pointer border-4 transition-all ${darkMode ? 'border-blue-600 ring-8 ring-blue-500/10' : 'border-transparent'}`}>
                             <Moon className="text-blue-400 w-12 h-12 mb-4 mx-auto" />
                             <div className="text-center font-black">{t('theme_dark')}</div>
                         </div>
                     </div>
                 </div>
             )}
             {settingsTab === 'language' && (
                 <div className="max-w-2xl">
                     <h2 className="text-3xl font-black mb-8">{t('set_language')}</h2>
                     {['he', 'en'].map((lang) => (
                         <div key={lang} onClick={() => setLanguage(lang as any)} className={`flex items-center justify-between p-6 mb-3 rounded-2xl cursor-pointer border-2 transition-all ${language === lang ? 'border-blue-600 bg-blue-600/5' : 'border-slate-100 dark:border-slate-800'}`}>
                             <span className="font-black text-lg">{lang === 'he' ? 'עברית' : 'English'}</span>
                             {language === lang && <div className="w-5 h-5 bg-blue-600 rounded-full border-4 border-white dark:border-slate-900"></div>}
                         </div>
                     ))}
                 </div>
             )}
         </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-screen w-full font-sans overflow-hidden transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {showRewardModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 max-sm w-full shadow-2xl text-center border-4 border-emerald-500/30">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6"><Gem size={48} /></div>
            <h2 className="text-3xl font-black mb-2">{t('daily_reward')}</h2>
            <p className="text-slate-500 mb-8 font-medium">
                {loginStreak === 7 
                  ? t('daily_reward_streak') 
                  : t('daily_reward_desc').replace('{days}', (7 - loginStreak).toString())}
            </p>
            <button onClick={() => setShowRewardModal(false)} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-blue-500/20">{t('he' === language ? 'מעולה!' : 'Awesome!')}</button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
          <aside className="hidden md:block shrink-0 h-full relative z-10">
              <ModernSidebar />
          </aside>
          <main className="flex-1 overflow-hidden relative pb-16 md:pb-0">
              {view === ViewState.HOME && renderHome()}
              {view === ViewState.PROFILE && renderProfile()}
              {view === ViewState.MATCHES && renderMatches()}
              {view === ViewState.CHAT_LIST && renderChatList()}
              {view === ViewState.CHAT_ROOM && renderChatRoom()}
              {view === ViewState.SUBSCRIPTION && renderSubscription()}
              {view === ViewState.SETTINGS && renderSettings()}
              {view === ViewState.SHOP && renderShop()}
          </main>
      </div>
      <div className="md:hidden"><ModernBottomNav /></div>
    </div>
  );
};

export default App;