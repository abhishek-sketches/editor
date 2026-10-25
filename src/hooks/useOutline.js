import { useCallback, useEffect, useRef, useState } from "react";
import {
  addChild,
  createNode,
  defaultOutline,
  findNode,
  indent,
  insertAfter,
  outdent,
  updateNode,
} from "@/lib/outline";

const STORAGE_KEY = "outline";

const load = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(stored) && stored.length) return stored;
  } catch (error) {
    console.error("Could not read outline from localStorage:", error);
  }
  return defaultOutline();
};

// Must only be used on the client (the editor page is loaded with ssr: false).
export default function useOutline(zoomId) {
  const [outline, setOutline] = useState(load);
  const focusId = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(outline));
    } catch (error) {
      console.error("Could not store outline in localStorage:", error);
    }
  }, [outline]);

  // Focus a newly created node once it has rendered.
  useEffect(() => {
    if (!focusId.current) return;
    const el = document.getElementById(focusId.current);
    focusId.current = null;
    if (!el) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }, [outline]);

  const setText = useCallback((id, text) => {
    setOutline((items) => updateNode(items, id, (n) => ({ ...n, text })));
  }, []);

  const toggle = useCallback((id) => {
    setOutline((items) => updateNode(items, id, (n) => ({ ...n, state: !n.state })));
  }, []);

  // Returns the id to zoom into when the node already has children.
  const addChildTo = useCallback(
    (id) => {
      const node = findNode(outline, id);
      if (!node) return null;
      if (node.children.length) return id;
      const child = createNode();
      setOutline(addChild(outline, id, child));
      focusId.current = child.id;
      return child.id;
    },
    [outline]
  );

  const addNodeFrom = useCallback(
    (id) => {
      const node = findNode(outline, id);
      if (!node) return;
      const fresh = createNode();
      focusId.current = fresh.id;
      if (id === zoomId || (node.state && node.children.length)) {
        setOutline(addChild(outline, id, fresh, { first: true }));
      } else {
        setOutline(insertAfter(outline, id, fresh));
      }
    },
    [outline, zoomId]
  );

  const indentNode = useCallback((id) => {
    focusId.current = id;
    setOutline((items) => indent(items, id));
  }, []);

  const outdentNode = useCallback(
    (id) => {
      if (id === zoomId) return;
      focusId.current = id;
      setOutline((items) => outdent(items, id));
    },
    [zoomId]
  );

  const clear = useCallback(() => setOutline(defaultOutline()), []);

  return {
    outline,
    setText,
    toggle,
    addChildTo,
    addNodeFrom,
    indentNode,
    outdentNode,
    clear,
  };
}
