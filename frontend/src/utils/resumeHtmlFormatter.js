// Automatic formatting for targeted resume text in TinyMCE editor (final resume editor)

export function resumeTextToHtml(raw) {
  const container = document.createElement("div");
  const blocks    = raw.split(/\n{2,}/); // split on blank lines

  blocks.forEach(block => {
    const t = block.trim();
    if (!t) return;

    // Format HTML for section headings
    if (/^(Education|Skills|Professional Experience|Research Projects|References|Objective)\b/.test(t)) {
      const h3 = document.createElement("h3");
      h3.textContent = t;
      container.append(h3);
    }
    // ... Name & title lines
    else if (/^[A-Z][^•]+\s•/.test(t)) {
      const h2 = document.createElement("h2");
      h2.textContent = t;
      container.append(h2);
    }
    // ... Bullet lists
    else if (/^[-*•]/.test(t)) {
      const ul = document.createElement("ul");
      t.split(/[-*•]\s*/).slice(1).forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.append(li);
      });
      container.append(ul);
    }
    // All others will be paragraph texts
    else {
      const p = document.createElement("p");
      p.textContent = t;
      container.append(p);
    }
  });

  return container.innerHTML;
}
