import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Editor } from "@tinymce/tinymce-react";

const TinyDiffEditor = forwardRef(function TinyDiffEditor({ value: editorHtml, onEditorChange: setEditorHtml }, ref) {
    const editor = useRef(null);

    // Expose ref.current.getContent(...) to parent (currently TailorResume.jsx)
    useImperativeHandle(ref, () => ({
        getContent: opts => editor.current?.getContent(opts),
        setContent: html => editor.current?.setContent(html),
    }));

    return (
        <Editor
            apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
            value={editorHtml}
            onEditorChange={setEditorHtml}
            onInit={(_, ed) => (editor.current = ed)}
            init={{
                valid_elements: "*[*]",       // allow all tags + attributes
                extended_valid_elements: "span[class]",
                branding: false,              // suppress “account-message” fetch error
                forced_root_block: 'p',
                height: 600,
                menubar: false,
                plugins: ["advlist", "autolink", "lists", "link", "image", "charmap", "preview", "anchor", "pagebreak", "code", "table"],
                toolbar:
                    "undo redo | styles | fontsize | bold italic underline | " +
                    "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table",   
                fontsize_formats: "12px 14px 16px 18px 24px",
                content_style: `
                    body { font-family: Helvetica, Arial, sans-serif; font-size: 12px; }
                    h3 { font-size: 16px; font-weight: bold; margin-top: 1em; }
                    ul { margin-left: 1em; }
                    .diff-added { background: #d9f6d9; }
                `
            }}
        />
    )
})

export default TinyDiffEditor;