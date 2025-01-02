'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { IJoditEditorProps, Jodit } from 'jodit-react';


// Dynamic import of JoditEditor
const DynamicJoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false
});

interface EditorProps {
  doc?: string;
  onContentChange?: (content: string) => void;
}

export default function Editor({ doc, onContentChange }: EditorProps) {
  const editor = useRef(null);
  const [content, setContent] = useState(doc || 'Worlds best html page');

  useEffect(() => {
    if (doc !== undefined) {
      setContent(doc);
    }
  }, [doc]);

  const config = useMemo<any>(
    () => ({
      height: 400,
      buttons: [
        'source',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'ul',
        'ol',
        '|',
        'font',
        'fontsize',
        'brush',
        'paragraph',
        '|',
        'image',
        'table',
        'link',
        '|',
        'left',
        'center',
        'right',
        'justify',
        '|',
        'undo',
        'redo',
        '|',
        'hr',
        'eraser',
        'fullsize',
      ],
      uploader: {
        insertImageAsBase64URI: true,
        imagesExtensions: ['jpg', 'png', 'jpeg', 'gif']
      },
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultMode: 1,
      toolbarAdaptive: false,
    }),
    []
  );

  const handleChange = (value: string) => {
    setContent(value);
    if (onContentChange) {
      onContentChange(value);
    }
  };

  return (
    <>
      <div className="h-screen flex items-center flex-col border-rose-600">
        <div className="h-full w-full">
          <DynamicJoditEditor
            ref={editor}
            value={doc !== undefined ? doc : content}
            config={config}
            onChange={handleChange}
            className="w-full h-[70%] mt-10 bg-white"
          />
        </div>

        <div className="my-10 h-full w-[90vw] pl-10">
          Preview:
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      </div>
    </>
  );
}