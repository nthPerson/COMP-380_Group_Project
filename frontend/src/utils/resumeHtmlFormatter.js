// Automatic formatting for targeted resume text in TimeMCE editor

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
    else if (/^[\-\*•]/.test(t)) {
      const ul = document.createElement("ul");
      t.split(/[\-\*•]\s*/).slice(1).forEach(item => {
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

// export function resumeTextToHtml(raw) {
//   // …strip fences, replace ‘---’ with two newlines, convert **bold** to <strong>…
//   const container = document.createElement("div");
//   raw
//     .split(/\n{2,}/)       // split on *two* or more newlines to get paragraphs/blocks
//     .forEach(block => {
//       const t = block.trim();
//       if (!t) return;

//       // Heading:
//       if (/^(Education|Skills|Professional Experience|Research Projects|References|Objective)\b/.test(t)) {
//         const h3 = document.createElement("h3");
//         h3.innerHTML = t;
//         container.append(h3);
//       }
//       // Big name line
//       else if (/^[A-Z][^•]+\s•/.test(t)) {
//         const h2 = document.createElement("h2");
//         h2.innerHTML = t;
//         container.append(h2);
//       }
//       // Bulleted list
//       else if (/^[\-\*•]/.test(t)) {
//         const ul = document.createElement("ul");
//         t.split(/[\-\*•]\s*/).slice(1).forEach(itemText => {
//           const li = document.createElement("li");
//           li.textContent = itemText;
//           ul.append(li);
//         });
//         container.append(ul);
//       }
//       // Fallback paragraph
//       else {
//         const p = document.createElement("p");
//         p.innerHTML = t;
//         container.append(p);
//       }
//     });

//   return container.innerHTML;
// }

// export function resumeTextToHtml(raw) {
//   // 1) strip leading/trailing ``` fences
//   if (raw.startsWith("```")) {
//     raw = raw.slice(raw.indexOf("\n") + 1);
//   }
//   if (raw.trimEnd().endsWith("```")) {
//     raw = raw.trimEnd().slice(0, -3);
//   }

//   // 2) replace all '---' section breaks with double newlines
//   raw = raw.replace(/---/g, "\n\n");

//   // 3) convert **bold** into <strong>…</strong> (optional, but makes your HTML richer)
//   raw = raw.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

//   // 4) now we really do have line breaks to split on
//   const lines = raw.split("\n");
//   let html   = "";
//   let inList = false;

//   function flushList() {
//     if (inList) {
//       html += "</ul>";
//       inList = false;
//     }
//   }

//   for (let line of lines) {
//     const t = line.trim();
//     if (!t) {
//       flushList();
//       continue;
//     }

//     if (/^(Education|Skills|Professional Experience|Research Projects|References)\b/.test(t)) {
//       flushList();
//       html += `<h3>${t}</h3>`;
//     }
//     else if (/^[\-\*•]\s*(?=\S)/.test(t)) {
//       if (!inList) {
//         html  += "<ul>";
//         inList = true;
//       }
//       html += `<li>${t.replace(/^[\-\*•]\s*/, "")}</li>`;
//     }
//     else if (/^[A-Z][A-Za-z ]+•/.test(t)) {
//       flushList();
//       html += `<h2>${t}</h2>`;
//     }
//     else {
//       flushList();
//       html += `<p>${t}</p>`;
//     }
//   }

//   flushList();
//   return html;
// }
