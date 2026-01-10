import { getUser } from '@/lib/auth/actions'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-orange-600 hover:text-orange-700">
          Next Read
        </Link>
      </div>
    </header>
  )
}
