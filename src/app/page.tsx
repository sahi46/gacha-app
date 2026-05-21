import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-6">🎰</div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
          ガチャメーカー
        </h1>
        <p className="text-purple-300 text-lg mb-10">
          自分だけのガチャを作ってシェアしよう
        </p>

        <Link
          href="/create"
          className="inline-block px-10 py-4 text-xl font-bold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white transition-all transform hover:scale-105 shadow-lg shadow-purple-900"
        >
          ガチャを作る ✨
        </Link>

        <p className="mt-8 text-purple-400 text-sm">
          URLを知っていればすぐに引ける。ログイン不要。
        </p>
      </div>
    </main>
  )
}
