export default function PlatformShowcase() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 bg-white">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Tech Platforms We Cover
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="w-12 h-12 bg-orange-100 rounded-lg mb-4 flex items-center justify-center text-orange-600 font-bold text-xl">
            HN
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Hacker News
          </h3>
          <p className="text-sm text-gray-600">
            Tech news and startup discussion
          </p>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6 opacity-50">
          <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 font-bold text-xl">
            UT
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Uber Tech Blog
          </h3>
          <p className="text-sm text-gray-600">
            Coming Soon
          </p>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6 opacity-50">
          <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 font-bold text-xl">
            NF
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Netflix Tech Blog
          </h3>
          <p className="text-sm text-gray-600">
            Coming Soon
          </p>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6 opacity-50">
          <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 font-bold text-xl">
            TN
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Tech Newsletters
          </h3>
          <p className="text-sm text-gray-600">
            Coming Soon
          </p>
        </div>
      </div>
    </section>
  )
}
