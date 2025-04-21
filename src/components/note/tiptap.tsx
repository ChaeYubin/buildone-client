"use client";

import "@/styles/tiptap.css";
import { useEffect } from "react";

import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

import Toolbar from "@/components/note/toolbar";

interface TiptapProps {
  setContents: React.Dispatch<React.SetStateAction<string>>;
  onLinkSubmit?: (link: string) => void;
  content?: string;
}

export default function Tiptap({
  setContents,
  onLinkSubmit,
  content = "",
}: TiptapProps) {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-400 w-full",
      },
    },
    extensions: [
      StarterKit,
      Markdown,
      Underline,
      Placeholder.configure({
        placeholder: "이 곳을 클릭해 노트 작성을 시작해주세요",
      }),
    ],
    content,
    onUpdate: ({ editor: updatedEditor }) => {
      try {
        const markdown = updatedEditor.storage.markdown.getMarkdown();
        setContents(markdown);
      } catch (error) {
        setContents("");
      }
    },
  });

  useEffect(() => {
    if (
      editor &&
      content &&
      content !== editor.getHTML() &&
      !editor.isFocused
    ) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  const handleLinkSubmit = (link: string) => {
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\w .-]*)*\/?/;
    if (urlRegex.test(link)) {
      if (onLinkSubmit) {
        onLinkSubmit(link);
      }
    }
  };

  return (
    <div className="custom-editor relative">
      <EditorContent editor={editor} />
      {editor && <Toolbar editor={editor} onLinkSubmit={handleLinkSubmit} />}
    </div>
  );
}
