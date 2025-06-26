import React, { useState, useEffect } from 'react';
import { parseResume } from '../../utils/resumeAstParser';
import { diffAst } from '../../utils/astDiff';
import { ResumeDiffViewer } from './ResumeDiffViewer';

export default function StructuredResumeEditor({ masterText, tailoredText }) {
  const [viewMode, setViewMode] = useState('diff'); // 'diff' or 'edit'
  const [ast, setAst] = useState([]);
  const [diffAstNodes, setDiffAstNodes] = useState([]);

  useEffect(() => {
    const mAst = parseResume(masterText);
    const tAst = parseResume(tailoredText);
    setAst(tAst);
    setDiffAstNodes(diffAst(mAst, tAst));
  }, [masterText, tailoredText]);

  return (
    <div>
      <button onClick={() => setViewMode('diff')}>Show Diff</button>
      <button onClick={() => setViewMode('edit')}>Edit Final</button>
      {viewMode === 'diff'
        ? <ResumeDiffViewer astWithDiff={diffAstNodes} />
        : <div contentEditable className="simple-editor">
            {ast.map((n,i) => {
              if (n.type === 'heading') return <h3 key={i}>{n.text}</h3>;
              if (n.type === 'header')  return <h2 key={i}>{n.text}</h2>;
              if (n.type === 'paragraph') return <p key={i}>{n.text}</p>;
              if (n.type === 'list') return (
                <ul key={i}>{n.items.map((it,j)=><li key={j}>{it}</li>)}</ul>
              );
              return null;
            })}
          </div>
      }
    </div>
  );
}