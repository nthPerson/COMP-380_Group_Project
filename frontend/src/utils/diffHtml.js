import { diffWords } from "diff";
import DOMPurify from 'dompurify'

/**
 * Returns HTML where words inserted by resume generation (compared against master resume)
 * are wrapped in <span class="diff-added">…</span>.
 */
export function toDiffHtml(masterHtml, tailoredHtml) {
  const parts = diffWords(masterHtml, tailoredHtml);

  const html = parts.map(part => {
    if (part.added) {
      // wrap new words in your highlight span
      return `<span class="diff-added">${part.value}</span>`;
    }
    if (part.removed) {
      // drop deletions entirely
      return "";
    }
    // **emit the original markup (h3, ul, li, p, etc.) unchanged**
    return part.value;
  }).join("");

  // sanitize but allow your headings and lists through
  const result = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "h1","h2","h3","h4","h5","h6",
      "ul","ol","li",
      "p","span","strong","em","b","i"
      /* etc… */
    ]
  });

  console.log(result);
  return result;
}

