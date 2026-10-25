import dynamic from "next/dynamic";
import { useRouter } from "next/router";

// The outline is stored in localStorage, so render on the client only.
const OutlineEditor = dynamic(() => import("@/components/OutlineEditor"), {
  ssr: false,
});

export default function EditorPage() {
  const { query, isReady } = useRouter();
  if (!isReady) return null;
  return <OutlineEditor pageId={query.id} />;
}
