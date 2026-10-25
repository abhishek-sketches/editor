import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Outline Editor</title>
        <meta name="description" content="A simple nested outline editor" />
      </Head>
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-4 p-6">
        <h1 className="text-3xl font-bold">Outline Editor</h1>
        <p className="text-muted">
          Write nested notes. Everything is saved in your browser.
        </p>
        <Link href="/editor/0" className="btn inline-block">
          Open editor
        </Link>
      </main>
    </>
  );
}
