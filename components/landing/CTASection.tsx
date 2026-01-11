import Link from 'next/link'
import { buttonStyles } from '../ui/constants'

export default function CTASection() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 bg-white">
      <div className="text-center bg-orange-50 rounded-lg p-12 border border-orange-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Start?</h2>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Create your free account and start discovering personalized tech articles today.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup" className={buttonStyles.primary}>
            Create Free Account
          </Link>
          <Link href="/login" className={buttonStyles.tertiary}>
            Already Have an Account?
          </Link>
        </div>
      </div>
    </section>
  )
}
