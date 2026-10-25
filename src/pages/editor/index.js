import Link from "next/link";

export default function EditorIndex() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Outline editor</h1>
      <Link href="/editor/0" className="btn inline-block">
        Open editor
      </Link>
    </main>
  );
}
