import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="text-center w-full max-w-sm">
        <div className="text-7xl mb-5">🎰</div>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
          ガチャメーカー
        </h1>
        <p className="text-purple-300 text-base mb-10">
          自分だけのガチャを作ってシェアしよう
        </p>

        <Link
          href="/create"
          className="block w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-900 active:scale-95 transition-transform"
        >
          ガチャを作る ✨
        </Link>

        <p className="mt-6 text-purple-500 text-xs">
          URLを知っていればすぐ引ける。ログイン不要。
        </p>
      </div>
    </main>
  )
}
