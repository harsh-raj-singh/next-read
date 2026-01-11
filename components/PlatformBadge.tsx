import { platformColors } from './ui/constants'

type PlatformName = keyof typeof platformColors | string

export default function PlatformBadge({ platformName }: { platformName: PlatformName }) {
  const colors = platformColors as Record<string, string>

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[platformName] ?? 'bg-gray-100 text-gray-800'}`}>
      {platformName}
    </span>
  )
}
