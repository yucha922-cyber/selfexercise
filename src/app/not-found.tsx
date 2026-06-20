import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-5xl font-bold text-navy-200">404</p>
      <h1 className="mt-4 text-xl font-bold text-navy-800">
        ページが見つかりませんでした
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        お探しのセルフケアは移動または削除された可能性があります。
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-xl bg-navy-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-800"
      >
        ホームに戻る
      </Link>
    </div>
  );
}
