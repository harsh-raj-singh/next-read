'use client'

interface Props {
  platformName: string;
}

export default function PlatformBadge({ platformName }: Props) {
  const colors: Record<string, string> = {
    'Hacker News': 'bg-orange-100 text-orange-800',
    'Uber Tech Blog': 'bg-green-100 text-green-800',
    'Netflix Tech Blog': 'bg-red-100 text-red-800',
    'Tech Newsletters': 'bg-blue-100 text-blue-800',
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[platformName] || 'bg-gray-100 text-gray-800'}`}>
      {platformName}
    </span>
  );
}
