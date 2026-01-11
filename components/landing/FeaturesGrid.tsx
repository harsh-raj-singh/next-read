import { features } from '../ui/constants'

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="w-12 h-12 bg-orange-100 rounded-lg mb-4 flex items-center justify-center">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

export default function FeaturesGrid() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Why Next Read?
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  )
}
