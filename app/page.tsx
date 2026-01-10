export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-orange-600 mb-4">
            HN Recommender
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Personalized Hacker News articles, tailored to your interests
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Features
            </h2>
            <ul className="text-left text-gray-600 space-y-2">
              <li>✓ Real-time article fetching from Hacker News</li>
              <li>✓ Like/Dislike articles to train your personal model</li>
              <li>✓ Rate articles (1-5 stars) for better recommendations</li>
              <li>✓ Hybrid recommendation system (content + collaborative)</li>
              <li>✓ 25% exploration rate for discovering new topics</li>
              <li>✓ Resurfacing of older articles</li>
            </ul>
          </div>
          <div className="bg-orange-100 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-800">
              🔧 Phase 1 setup complete! Coming soon: Authentication & Database integration
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
