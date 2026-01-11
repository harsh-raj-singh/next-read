import Link from 'next/link'
export default function Hero() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        Next Read
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Your personalized tech article feed from multiple sources
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/signup"
          className="px-8 py-4 bg-orange-600 text-white text-lg font-semibold rounded-lg hover:bg-orange-700 transition-colors"
        >
          Get Started Free
        </Link>
        <Link
          href="/login"
          className="px-8 py-4 bg-gray-100 text-gray-700 text-lg font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </section>
  )
}
