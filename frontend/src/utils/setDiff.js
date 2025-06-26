import { diffWords } from 'diff';
export function diffAst(masterNodes, tailoredNodes) {
  // We'll do a simple text-level diff on each paragraph/heading
  const result = [];
  const len = Math.max(masterNodes.length, tailoredNodes.length);

  for (let i = 0; i < len; i++) {
    const m = masterNodes[i] || { type: 'empty', text: '' };
    const t = tailoredNodes[i] || { type: 'empty', text: '' };

    if (m.type === t.type && m.text && t.text) {
      const parts = diffWords(m.text, t.text);
      result.push({
        ...t,
        diff: parts.map(p => ({ text: p.value, added: p.added }))
      });
    } else {
      // new block entirely
      result.push({ ...t, diff: [{ text: t.text, added: true }] });
    }
  }
  return result;
}