'use client'

import Hero from '@/components/landing/Hero'
import PlatformShowcase from '@/components/landing/PlatformShowcase'
import FeaturesGrid from '@/components/landing/FeaturesGrid'
import CTASection from '@/components/landing/CTASection'
import { useState } from 'react'
import { getUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'

export default function LandingPage() {
  const [loading, setLoading] = useState(false)
  
  async function checkAuth() {
    try {
      const user = await getUser()
      if (user && !user.is_anonymous) {
        redirect('/dashboard')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }
  
  return (
    <main>
      <Hero />
      <PlatformShowcase />
      <FeaturesGrid />
      <CTASection />
    </main>
  )
}
