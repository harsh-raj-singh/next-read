'use client'

import Hero from '@/components/landing/Hero'
import PlatformShowcase from '@/components/landing/PlatformShowcase'
import FeaturesGrid from '@/components/landing/FeaturesGrid'
import CTASection from '@/components/landing/CTASection'

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <PlatformShowcase />
      <FeaturesGrid />
      <CTASection />
    </main>
  )
}
