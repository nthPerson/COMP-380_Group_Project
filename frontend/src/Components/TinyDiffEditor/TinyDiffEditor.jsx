import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Editor } from "@tinymce/tinymce-react";

const TinyDiffEditor = forwardRef(function TinyDiffEditor({ html, onChange }, ref) {
  const inner = useRef(null);

  // Whenever parent calls ref.current.getContent(...)
  useImperativeHandle(ref, () => ({
    getContent: (opts = {}) => inner.current.getContent(opts)
  }));

  return (
    <Editor
      apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
      onInit={(_, ed) => (inner.current = ed)}
      initialValue={html}
      onEditorChange={onChange}
      init={{
        height: 600,
        menubar: false,
        plugins: 'lists link',
        toolbar:
          'undo redo | styles fontsize | bold italic underline | ' +
          'alignleft aligncenter alignright | bullist numlist outdent indent',
        content_style: `
          body { font-family: Helvetica, Arial, sans-serif; font-size: 14px }
          .diff-added { background: #d9f6d9; }
        `
      }}
    />
  );
});

export default TinyDiffEditor;