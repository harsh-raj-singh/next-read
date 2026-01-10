export default function FeaturesGrid() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Why Next Read?
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="w-12 h-12 bg-orange-100 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">
            AI-Powered
          </h3>
          <p className="text-sm text-gray-600">
            Personalized recommendations that learn your preferences
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="w-12 h-12 bg-orange-100 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-2xl">📰</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Multi-Source
          </h3>
          <p className="text-sm text-gray-600">
            Articles from multiple tech platforms in one feed
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="w-12 h-12 bg-orange-100 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-2xl">⭐</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Rate & Filter
          </h3>
          <p className="text-sm text-gray-600">
            Like, dislike, and rate articles to train your feed
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="w-12 h-12 bg-orange-100 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-2xl">🎲</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Discovery Mode
          </h3>
          <p className="text-sm text-gray-600">
            30% exploration rate to discover new topics
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="w-12 h-12 bg-orange-100 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Real-Time Updates
          </h3>
          <p className="text-sm text-gray-600">
            Fresh articles every 6 hours automatically
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="w-12 h-12 bg-orange-100 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Private & Secure
          </h3>
          <p className="text-sm text-gray-600">
            Your data is private and never shared
          </p>
        </div>
      </div>
    </section>
  )
}
