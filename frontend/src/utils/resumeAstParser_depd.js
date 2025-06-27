export function parseResume(rawText) {
  const lines = rawText.split("\n");
  const nodes = [];
  let listBuffer = null;

  function flushList() {
    if (listBuffer) {
      nodes.push({ type: 'list', items: listBuffer });
      listBuffer = null;
    }
  }

  for (let raw of lines) {
    const t = raw.trim();
    if (!t) { flushList(); continue; }

    // Section heading
    if (/^(Education|Skills|Experience|References)\b/.test(t)) {
      flushList();
      nodes.push({ type: 'heading', level: 3, text: t });
    }
    // Bullet item
    else if (/^[\-•*]\s+/.test(t)) {
      if (!listBuffer) listBuffer = [];
      listBuffer.push(t.replace(/^[\-•*]\s+/, ''));
    }
    // Top-line header
    else if (/^\w+\s+\|/.test(t) || /^[A-Z][a-z]+\s+[A-Z]/.test(t)) {
      flushList();
      nodes.push({ type: 'header', text: t });
    }
    // Paragraph
    else {
      flushList();
      nodes.push({ type: 'paragraph', text: t });
    }
  }
  flushList();
  return nodes;
}