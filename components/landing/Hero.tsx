import Link from 'next/link'
import { buttonStyles } from '../ui/constants'

export default function Hero() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">Next Read</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Your personalized tech article feed from multiple sources
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/signup" className={buttonStyles.primary}>
          Get Started Free
        </Link>
        <Link href="/login" className={buttonStyles.secondary}>
          Sign In
        </Link>
      </div>
    </section>
  )
}
