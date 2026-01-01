import { Platform, UserProfile, ChatThread, SubscriptionPlan, GameInfo, Theme, Cosmetic } from './types';

export const CURRENT_USER_ID = 'me';

export const SHOP_THEMES: Theme[] = [
  { id: 'light', name: 'Classic Light', cost: 0, gradient: 'from-slate-100 to-white', previewColor: '#f8fafc', accentClass: 'theme-light' },
  { id: 'dark', name: 'Classic Dark', cost: 0, gradient: 'from-slate-800 to-slate-900', previewColor: '#0f172a', accentClass: 'theme-dark' },
  { id: 'default', name: 'Original Blue', cost: 0, gradient: 'from-blue-600 to-indigo-700', previewColor: '#2563eb', accentClass: 'theme-default' },
  { id: 'cyberpunk', name: 'Cyber Neon', cost: 100, gradient: 'from-pink-600 to-purple-600', previewColor: '#db2777', accentClass: 'theme-cyberpunk' },
  { id: 'forest', name: 'Emerald Forest', cost: 50, gradient: 'from-emerald-600 to-teal-800', previewColor: '#059669', accentClass: 'theme-forest' },
  { id: 'sunset', name: 'Sunset Glow', cost: 75, gradient: 'from-orange-500 to-red-600', previewColor: '#f97316', accentClass: 'theme-sunset' },
  { id: 'luxury', name: 'Midnight Gold', cost: 200, gradient: 'from-yellow-600 to-slate-900', previewColor: '#ca8a04', accentClass: 'theme-luxury' },
];

export const PROFILE_COSMETICS: Cosmetic[] = [
  // Borders
  { id: 'border-basic', name: 'Classic', cost: 0, type: 'BORDER', style: 'border-white' },
  { id: 'border-gold', name: 'Gold Frame', cost: 150, type: 'BORDER', style: 'ring-4 ring-yellow-500' },
  { id: 'border-neon', name: 'Neon Pulse', cost: 250, type: 'BORDER', style: 'ring-4 ring-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)]' },
  { id: 'border-fire', name: 'Dragon Fire', cost: 400, type: 'BORDER', style: 'ring-4 ring-orange-600 animate-pulse shadow-[0_0_25px_rgba(234,88,12,0.6)]' },
  { id: 'border-galaxy', name: 'Galaxy Rim', cost: 500, type: 'BORDER', style: 'ring-4 ring-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.7)]' },
  
  // Name Colors
  { id: 'color-white', name: 'Standard', cost: 0, type: 'NAME_COLOR', style: 'text-slate-900 dark:text-white' },
  { id: 'color-blue', name: 'Aqua Blue', cost: 50, type: 'NAME_COLOR', style: 'text-blue-500' },
  { id: 'color-green', name: 'Matrix Green', cost: 100, type: 'NAME_COLOR', style: 'text-emerald-500 font-bold' },
  { id: 'color-purple', name: 'Amethyst', cost: 150, type: 'NAME_COLOR', style: 'text-purple-500 font-black' },
  { id: 'color-gold', name: 'Pure Gold', cost: 300, type: 'NAME_COLOR', style: 'text-yellow-500 font-black italic drop-shadow-sm' },
  { id: 'color-rainbow', name: 'Legendary', cost: 600, type: 'NAME_COLOR', style: 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent font-black' },
];

export const INITIAL_PROFILE: UserProfile = {
  id: 'me',
  name: 'אורי מימון',
  age: 26,
  image: 'https://picsum.photos/400/400?random=100',
  bio: 'מחפש סקוואד רציני לערב, בלי לוזרים.',
  platforms: [Platform.PC, Platform.PS5],
  games: [
    { id: 'wz', name: 'Call of Duty: Warzone', icon: '🔫', rank: 'Diamond', role: 'Sniper', description: 'משחק בעיקר בערב, מחפש אנשים רציניים לניצחונות.' },
    { id: 'gta', name: 'GTA V', icon: '🚗', description: 'רולפליי רציני בלבד.' },
    { id: 'mc', name: 'Minecraft', icon: '⛏️', description: 'שרת הישרדות.' },
  ],
  equippedBorderId: 'border-basic',
  equippedNameColorId: 'color-white'
};

export const POPULAR_GAMES: GameInfo[] = [
  { id: 'wz', name: 'Warzone', icon: '🔫' },
  { id: 'val', name: 'Valorant', icon: '🎯' },
  { id: 'fifa', name: 'EA FC 24', icon: '⚽' },
  { id: 'apex', name: 'Apex Legends', icon: '🏃‍♂️' },
  { id: 'ow2', name: 'Overwatch 2', icon: '🛡️' },
  { id: 'mc', name: 'Minecraft', icon: '⛏️' },
  { id: 'league', name: 'League of Legends', icon: '⚔️' },
  { id: 'cs2', name: 'CS2', icon: '💣' },
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: '1',
    name: 'מאיה',
    age: 24,
    image: 'https://picsum.photos/400/600?random=1',
    bio: 'Healer main, מחפשת טנק שיגן עליי.',
    platforms: [Platform.PC],
    games: [
      { id: 'ow2', name: 'Overwatch 2', icon: '🛡️', rank: 'Master', role: 'Support' },
      { id: 'apex', name: 'Apex Legends', icon: '🏃‍♀️' },
      { id: 'val', name: 'Valorant', icon: '🎯' }
    ],
    distance: '2 ק"מ'
  },
  {
    id: '2',
    name: 'רון',
    age: 22,
    image: 'https://picsum.photos/400/600?random=2',
    bio: 'פיפ"א כל היום, אל תדברו איתי על משחקי יריות.',
    platforms: [Platform.PS5],
    games: [
      { id: 'fifa', name: 'EA FC 24', icon: '⚽', rank: 'Elite Div' },
      { id: 'gta', name: 'GTA V', icon: '🚗' }
    ],
    distance: '5 ק"מ'
  },
  {
    id: '3',
    name: 'נועה',
    age: 27,
    image: 'https://picsum.photos/400/600?random=3',
    bio: 'Valorant גרינד, צריכה דואו.',
    platforms: [Platform.PC],
    games: [
        { id: 'val', name: 'Valorant', icon: '🎯', rank: 'Ascendant' },
        { id: 'wz', name: 'Call of Duty: Warzone', icon: '🔫' }
    ],
    distance: '12 ק"מ'
  }
];

export const MOCK_CHATS: ChatThread[] = [
  {
    id: 'c1',
    user: MOCK_USERS[0],
    lastMessage: 'מתי מתחברים?',
    timestamp: '10:30',
    unread: 2,
    messages: [
        { id: 'm1', senderId: '1', text: 'היי, ראיתי שאתה משחק Warzone', timestamp: '10:28', isMe: false },
        { id: 'm2', senderId: '1', text: 'מתי מתחברים?', timestamp: '10:30', isMe: false }
    ]
  },
  {
    id: 'c2',
    user: MOCK_USERS[1],
    lastMessage: 'חייב עזרה ב-FUT Champions',
    timestamp: 'אתמול',
    unread: 0,
    messages: [
        { id: 'm3', senderId: 'me', text: 'איך הקבוצה שלך?', timestamp: '15:00', isMe: true },
        { id: 'm4', senderId: '2', text: 'חייב עזרה ב-FUT Champions', timestamp: '15:05', isMe: false }
    ]
  }
];

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Classic',
    price: 5,
    color: 'from-gray-500 to-gray-700',
    features: ['No Ads', '5 Likes / Day', 'Basic Filters']
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 10,
    color: 'from-yellow-500 to-yellow-700',
    isPopular: true,
    features: ['Unlimited Likes', '5 Super Likes / Day', 'See Who Liked You', 'Weekly Boost']
  },
  {
    id: 'luxury',
    name: 'Luxury',
    price: 20,
    color: 'from-purple-600 to-indigo-600',
    features: ['All Features', 'View Secret Profiles', 'VIP Status', '24/7 Personal Support', 'Exclusive Tournaments']
  }
];

export const TRANSLATIONS = {
  he: {
    nav_discover: 'גלה שחקנים',
    nav_search: 'חיפוש משחקים',
    nav_profile: 'הפרופיל שלי',
    nav_matches: 'המאצ\'ים שלי',
    nav_chats: 'צ\'אטים',
    nav_subs: 'מנויים',
    nav_settings: 'הגדרות',
    nav_shop: 'חנות פריטים',
    nav_logout: 'התנתק',
    system: 'מערכת',
    connected: 'מחובר',
    keyboard_shortcuts: 'קיצורי מקלדת: ← דלג | ↑ סופר לייק | → לייק',
    distance_away: 'ממך',
    edit_profile_title: 'עריכת פרופיל',
    change_photo: 'לחץ לשינוי תמונה',
    label_display_name: 'שם תצוגה',
    label_age: 'גיל',
    label_bio: 'ביוגרפיה',
    label_platforms: 'פלטפורמות',
    label_my_games: 'המשחקים שלי',
    add_game: 'הוסף משחק',
    save_changes: 'שמור שינויים',
    matches_title: 'המאצ\'ים שלי',
    people_liked_you: 'אנשים שאהבו אותך',
    hidden_user: 'משתמש מוסתר',
    upgrade_gold: 'שדרג לגולד',
    messages_title: 'הודעות',
    type_message: 'כתוב הודעה...',
    online_now: 'מחובר כעת',
    upgrade_experience: 'שדרג את החוויה',
    gold_title: 'GameOn Gold',
    gold_subtitle: 'פתח את כל האפשרויות ותמצא את הסקוואד המושלם מהר יותר. הצטרף לאלפי גיימרים שכבר שדרגו.',
    plan_per_month: '/חודש',
    select_plan: 'בחר',
    most_popular: 'הכי משתלם',
    settings_title: 'הגדרות',
    search_settings: 'חפש בהגדרות...',
    user_settings: 'הגדרות משתמש',
    app_settings: 'הגדרות אפליקציה',
    set_account: 'החשבון שלי',
    set_profile: 'פרופיל',
    set_privacy: 'פרטיות ובטיחות',
    set_subs: 'מנוי',
    set_appearance: 'נראות',
    set_language: 'שפה',
    set_notifications: 'התראות',
    set_devices: 'מכשירים',
    choose_lang: 'בחר שפה',
    theme: 'ערכת נושא',
    theme_light: 'בהיר',
    theme_dark: 'כהה',
    preview_title: 'תצוגה מקדימה',
    playing_on: 'משחק ב',
    active_now: 'פעיל כעת',
    playing_for: 'משחק כבר',
    game_rank: 'ראנק',
    game_role: 'תפקיד',
    no_info: 'אין מידע נוסף',
    edit: 'ערוך',
    username: 'שם משתמש',
    email: 'אימייל',
    phone: 'טלפון',
    find_mutual: 'מצא שחקנים עם משחקים משותפים',
    all_games: 'כל המשחקים',
    players_found: 'שחקנים נמצאו',
    shop_title: 'החנות של GameOn',
    shop_subtitle: 'השתמש ביהלומים שלך כדי לשדרג את הנראות של הפרופיל והאפליקציה.',
    tab_themes: 'ערכות נושא',
    tab_borders: 'מסגרות',
    tab_names: 'שמות',
    owned: 'בבעלותך',
    buy: 'קנה ב-',
    equip: 'השתמש',
    active: 'פעיל',
    not_enough_points: 'אין לך מספיק יהלומים!',
    currency: 'יהלומים',
    daily_reward: 'בונוס יומי!',
    daily_reward_desc: 'קיבלת יהלום. עוד {days} ימים לסופר לייק!',
    daily_reward_streak: 'כל הכבוד! הגעת ליום 7 וקיבלת סופר לייק מתנה!',
    
    // Bottom Nav
    bn_home: 'ראשי',
    bn_matches: 'מאצ\'ים',
    bn_chat: 'צ\'אט',
    bn_subs: 'מנויים',
    bn_profile: 'פרופיל',
    bn_search: 'חיפוש',
  },
  en: {
    nav_discover: 'Discover',
    nav_search: 'Game Directory',
    nav_profile: 'My Profile',
    nav_matches: 'Matches',
    nav_chats: 'Chats',
    nav_subs: 'Subscriptions',
    nav_settings: 'Settings',
    nav_shop: 'Item Shop',
    nav_logout: 'Logout',
    system: 'SYSTEM',
    connected: 'Online',
    keyboard_shortcuts: 'Keyboard Shortcuts: ← Pass | ↑ Super Like | → Like',
    distance_away: 'away',
    edit_profile_title: 'Edit Profile',
    change_photo: 'Change Photo',
    label_display_name: 'Display Name',
    label_age: 'Age',
    label_bio: 'Bio',
    label_platforms: 'Platforms',
    label_my_games: 'My Games',
    add_game: 'Add Game',
    save_changes: 'Save Changes',
    matches_title: 'My Matches',
    people_liked_you: 'People who liked you',
    hidden_user: 'Hidden User',
    upgrade_gold: 'Upgrade to Gold',
    messages_title: 'Messages',
    type_message: 'Type a message...',
    online_now: 'Online Now',
    upgrade_experience: 'Upgrade Experience',
    gold_title: 'GameOn Gold',
    gold_subtitle: 'Unlock all features and find your perfect squad faster. Join thousands of gamers who upgraded.',
    plan_per_month: '/mo',
    select_plan: 'Select',
    most_popular: 'Most Popular',
    settings_title: 'Settings',
    search_settings: 'Search settings...',
    user_settings: 'USER SETTINGS',
    app_settings: 'APP SETTINGS',
    set_account: 'My Account',
    set_profile: 'Profile',
    set_privacy: 'Privacy & Safety',
    set_subs: 'Subscription',
    set_appearance: 'Appearance',
    set_language: 'Language',
    set_notifications: 'Notifications',
    set_devices: 'Devices',
    choose_lang: 'Select Language',
    theme: 'Theme',
    theme_light: 'Light',
    theme_dark: 'Dark',
    preview_title: 'Preview',
    playing_on: 'Playing on',
    active_now: 'Active Now',
    playing_for: 'Playing for',
    game_rank: 'Rank',
    game_role: 'Role',
    no_info: 'No extra info',
    edit: 'Edit',
    username: 'Username',
    email: 'Email',
    phone: 'Phone',
    find_mutual: 'Find players with mutual games',
    all_games: 'All Games',
    players_found: 'Players found',
    shop_title: 'GameOn Shop',
    shop_subtitle: 'Spend your crystals to customize your profile and app aesthetics.',
    tab_themes: 'Themes',
    tab_borders: 'Borders',
    tab_names: 'Names',
    owned: 'Owned',
    buy: 'Buy for ',
    equip: 'Equip',
    active: 'Active',
    not_enough_points: 'Not enough crystals!',
    currency: 'Crystals',
    daily_reward: 'Daily Reward!',
    daily_reward_desc: '1 crystal earned. {days} days left for Super Like!',
    daily_reward_streak: 'Day 7 reached! Free Super Like awarded!',

    // Bottom Nav
    bn_home: 'Home',
    bn_matches: 'Matches',
    bn_chat: 'Chat',
    bn_subs: 'Plans',
    bn_profile: 'Profile',
    bn_search: 'Search',
  }
};