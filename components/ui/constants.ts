/**
 * Shared UI constants for components
 */

// Button styles for primary actions
export const buttonStyles = {
  primary: 'px-8 py-4 bg-orange-600 text-white text-lg font-semibold rounded-lg hover:bg-orange-700 transition-colors',
  secondary: 'px-8 py-4 bg-gray-100 text-gray-700 text-lg font-semibold rounded-lg hover:bg-gray-200 transition-colors',
  tertiary: 'px-8 py-4 bg-gray-200 text-gray-700 text-lg font-semibold rounded-lg hover:bg-gray-300 transition-colors',
} as const

// Interaction button styles for article cards
export const interactionButtonStyles = {
  base: 'flex items-center gap-1 px-3 py-2 rounded-lg transition-colors',
  active: 'text-green-700',
  inactive: 'text-gray-700 hover:bg-gray-200',
  activeLike: 'bg-green-100 text-green-700',
  activeDislike: 'bg-red-100 text-red-700',
  inactiveLike: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  inactiveDislike: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
} as const

// Platform badge colors
export const platformColors: Readonly<Record<string, string>> = {
  'Hacker News': 'bg-orange-100 text-orange-800',
  'Uber Tech Blog': 'bg-green-100 text-green-800',
  'Netflix Tech Blog': 'bg-red-100 text-red-800',
  'Tech Newsletters': 'bg-blue-100 text-blue-800',
} as const

// Platform icon backgrounds
export const platformIconBg: Readonly<Record<string, string>> = {
  'Hacker News': 'bg-orange-100 text-orange-600',
  'Uber Tech Blog': 'bg-green-100 text-green-600',
  'Netflix Tech Blog': 'bg-red-100 text-red-600',
  'Tech Newsletters': 'bg-blue-100 text-blue-600',
} as const

// Feature card data for FeaturesGrid
export const features = [
  { icon: '🤖', title: 'AI-Powered', description: 'Personalized recommendations that learn your preferences' },
  { icon: '📰', title: 'Multi-Source', description: 'Articles from multiple tech platforms in one feed' },
  { icon: '⭐', title: 'Rate & Filter', description: 'Like, dislike, and rate articles to train your feed' },
  { icon: '🎲', title: 'Discovery Mode', description: '30% exploration rate to discover new topics' },
  { icon: '⚡', title: 'Real-Time Updates', description: 'Fresh articles every 6 hours automatically' },
  { icon: '🔒', title: 'Private & Secure', description: 'Your data is private and never shared' },
] as const

// Platform data for PlatformShowcase
export const platforms = [
  {
    id: 'hacker-news',
    name: 'Hacker News',
    initials: 'HN',
    description: 'Tech news and startup discussion',
    available: true,
  },
  {
    id: 'uber-blog',
    name: 'Uber Tech Blog',
    initials: 'UT',
    description: 'Coming Soon',
    available: false,
  },
  {
    id: 'netflix-blog',
    name: 'Netflix Tech Blog',
    initials: 'NF',
    description: 'Coming Soon',
    available: false,
  },
  {
    id: 'newsletters',
    name: 'Tech Newsletters',
    initials: 'TN',
    description: 'Coming Soon',
    available: false,
  },
] as const
