import { platforms, platformIconBg } from '../ui/constants'

function PlatformCard({
  initials,
  name,
  description,
  available,
}: {
  initials: string
  name: string
  description: string
  available: boolean
}) {
  const iconBgClass = available
    ? platformIconBg[name as keyof typeof platformIconBg] ?? 'bg-orange-100 text-orange-600'
    : 'bg-gray-100 text-gray-400'

  return (
    <div className={`border border-gray-200 rounded-lg p-6 ${!available && 'opacity-50'}`}>
      <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center font-bold text-xl ${iconBgClass}`}>
        {initials}
      </div>
      <h3 className="font-semibold text-gray-800 mb-2">{name}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

export default function PlatformShowcase() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 bg-white">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Tech Platforms We Cover
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map((platform) => (
          <PlatformCard
            key={platform.id}
            initials={platform.initials}
            name={platform.name}
            description={platform.description}
            available={platform.available}
          />
        ))}
      </div>
    </section>
  )
}
