import { useRouter } from "next/router";
import { GoDotFill } from "react-icons/go";
import { IoTriangle } from "react-icons/io5";
import useOutline from "@/hooks/useOutline";
import { findNode } from "@/lib/outline";

function OutlineList({ items, api, onZoom }) {
  return (
    <ul className="list-none m-0 p-0">
      {items.map((item) => (
        <li key={item.id}>
          <div className="relative flex items-center gap-1 py-1 text-lg">
            {item.children.length > 0 && (
              <button
                type="button"
                className="absolute -left-4 flex h-4 w-4 items-center justify-center rounded text-muted"
                aria-label={item.state ? "Collapse" : "Expand"}
                aria-expanded={item.state}
                onClick={() => api.toggle(item.id)}
              >
                <IoTriangle
                  className={`h-3 w-3 transition-transform duration-200 ${
                    item.state ? "rotate-180" : "rotate-90"
                  }`}
                />
              </button>
            )}
            <button
              type="button"
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full hover:bg-hover"
              aria-label={item.children.length ? "Open this item" : "Add a child item"}
              onClick={() => {
                const target = api.addChildTo(item.id);
                if (target && item.children.length) onZoom(target);
              }}
            >
              <GoDotFill />
            </button>
            <div
              id={item.id}
              data-node-id={item.id}
              role="textbox"
              aria-label="Outline item"
              aria-multiline="false"
              className="min-h-7 flex-1 rounded px-1 outline-none focus-visible:ring-2 focus-visible:ring-accent"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => api.setText(item.id, e.currentTarget.textContent)}
            >
              {item.text}
            </div>
          </div>
          {item.state && item.children.length > 0 && (
            <div className="ml-6">
              <OutlineList items={item.children} api={api} onZoom={onZoom} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function OutlineEditor({ pageId }) {
  const router = useRouter();
  const api = useOutline(pageId);
  const { outline, clear } = api;

  const zoomed = pageId ? findNode(outline, pageId) : null;
  const visible = zoomed ? [zoomed] : outline;

  const handleKeyDown = (event) => {
    const nodeEl = event.target.closest?.("[data-node-id]");
    if (!nodeEl) return;
    const id = nodeEl.dataset.nodeId;
    if (event.key === "Enter") {
      event.preventDefault();
      api.addNodeFrom(id);
    } else if (event.key === "Tab") {
      event.preventDefault();
      if (event.shiftKey) api.outdentNode(id);
      else api.indentNode(id);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-4">
      <header className="mb-4 flex items-center justify-between gap-3">
        <button type="button" className="btn" onClick={() => router.back()}>
          Back
        </button>
        <h1 className="text-xl font-semibold">Editor</h1>
        <button type="button" className="btn" onClick={clear}>
          Clear
        </button>
      </header>
      <main
        className="min-h-[70vh] rounded-lg border border-line bg-surface px-8 py-4 sm:px-12"
        onKeyDown={handleKeyDown}
      >
        <OutlineList
          items={visible}
          api={api}
          onZoom={(id) => router.push(`/editor/${id}`)}
        />
      </main>
      <p className="mt-3 text-sm text-muted">
        Enter adds an item, Tab indents, Shift+Tab outdents.
      </p>
    </div>
  );
}
