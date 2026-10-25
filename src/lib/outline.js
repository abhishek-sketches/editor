export const NBSP = " ";

export const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);

export const createNode = (overrides = {}) => ({
  id: newId(),
  text: NBSP,
  children: [],
  state: false,
  ...overrides,
});

export const defaultOutline = () => [createNode({ id: "1" })];

export const findNode = (items, id) => {
  for (const item of items) {
    if (item.id === id) return item;
    const found = findNode(item.children ?? [], id);
    if (found) return found;
  }
  return null;
};

export const updateNode = (items, id, fn) =>
  items.map((item) =>
    item.id === id
      ? fn(item)
      : { ...item, children: updateNode(item.children ?? [], id, fn) }
  );

export const insertAfter = (items, id, node) =>
  items.flatMap((item) =>
    item.id === id
      ? [item, node]
      : [{ ...item, children: insertAfter(item.children ?? [], id, node) }]
  );

export const addChild = (items, parentId, node, { first = false } = {}) =>
  updateNode(items, parentId, (parent) => ({
    ...parent,
    state: true,
    children: first ? [node, ...parent.children] : [...parent.children, node],
  }));

// Make a node the last child of its previous sibling.
export const indent = (items, id) => {
  const i = items.findIndex((n) => n.id === id);
  if (i === 0) return items;
  if (i > 0) {
    const prev = items[i - 1];
    return [
      ...items.slice(0, i - 1),
      { ...prev, state: true, children: [...prev.children, items[i]] },
      ...items.slice(i + 1),
    ];
  }
  return items.map((n) => ({ ...n, children: indent(n.children, id) }));
};

// Move a node out of its parent, placing it right after that parent.
export const outdent = (items, id) =>
  items.flatMap((n) => {
    const child = n.children.find((c) => c.id === id);
    if (child) {
      return [{ ...n, children: n.children.filter((c) => c.id !== id) }, child];
    }
    return [{ ...n, children: outdent(n.children, id) }];
  });
