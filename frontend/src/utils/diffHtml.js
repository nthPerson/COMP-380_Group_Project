import { diffWords } from "diff";
import DOMPurify from 'dompurify'

/**
 * Returns HTML where words inserted by resume generation (compared against master resume)
 * are wrapped in <span class="diff-added">…</span>.
 */
export function toDiffHtml(master, tailored) {
    const parts = diffWords(master, tailored);
    const html = parts.map(part => {
        if (part.added) return `<span class="diff-added">${escape(part.value)}</span>`;  // Highlight additions
        if (part.removed) return '';  // Hide deletions
        return escape(part.value);
    }).join('');
    return DOMPurify.sanitize(html);
}

function escape(str) {
    return str.replace(/[&<>"']/g, s =>
        ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])
    );
}
