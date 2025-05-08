import React, { useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { FontSize } from "../extensions/font-size";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { ResizableImage } from "../extensions/resizable-image";
import "highlight.js/styles/atom-one-dark.css";
import { cn } from "../lib/utils";
import { Toolbar } from "./editor/Toolbar";

// Create lowlight instance for code highlighting
const lowlight = createLowlight(common);

// CSS for the image resize handle
const imageStyles = `
.ProseMirror .image-container { margin:1rem 0; position:relative; display:inline-block; }
.ProseMirror .image-wrapper { position:relative; display:inline-block; width:100%; }
.ProseMirror .image-wrapper img { width:100%; height:auto; display:block; border-radius:0.375rem; }
.ProseMirror .resize-handle { position:absolute; bottom:3px; right:3px; width:12px; height:12px; background:#1e88e5; cursor:se-resize; border-radius:2px; opacity:0; transition:opacity 0.2s; }
.ProseMirror .image-wrapper:hover .resize-handle { opacity:1; }
`;

const ImageMenu = ({ editor }) => (
  <div className="bg-white dark:bg-zinc-800 border rounded-md shadow-lg p-2 flex gap-2">
    <div className="text-sm text-gray-500 dark:text-gray-400">
      Change size by dragging
    </div>
    <button
      className="text-red-500 hover:underline"
      onClick={() => editor.chain().focus().deleteSelection().run()}
    >
      Delete
    </button>
  </div>
);

export default function RichEditor({
  content = "",
  onChange,
  placeholder = "Start to write…",
  className = "",
  codeTheme = "dark",
}) {
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);
  const [toolbarStyle, setToolbarStyle] = React.useState({});
  const [contentMarginTop, setContentMarginTop] = React.useState(0);

  // Inject our image-resize CSS once
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = imageStyles;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  // Pin the toolbar to the top of the editor viewport
  const updateToolbar = useCallback(() => {
    if (!editorRef.current || !toolbarRef.current) return;
    const er = editorRef.current.getBoundingClientRect();
    const tr = toolbarRef.current.getBoundingClientRect();
    const top = Math.max(er.top, 0);

    setToolbarStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${er.left}px`,
      width: `${er.width}px`,
      zIndex: 1000,
      backgroundColor: getComputedStyle(toolbarRef.current).backgroundColor,
    });
    setContentMarginTop(tr.height);
  }, []);

  useLayoutEffect(() => {
    updateToolbar();
    window.addEventListener("scroll", updateToolbar);
    window.addEventListener("resize", updateToolbar);
    return () => {
      window.removeEventListener("scroll", updateToolbar);
      window.removeEventListener("resize", updateToolbar);
    };
  }, [updateToolbar]);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ image: false }),
      Underline,
      CodeBlockLowlight.configure({
        lowlight,
        languageClassPrefix: "language-",
        HTMLAttributes: {
          class: cn(
            "rounded-md p-4 my-4 overflow-x-auto border-2",
            {
              dark: "bg-zinc-900 text-zinc-100 border-zinc-700",
              light: "bg-gray-50 text-gray-900 border-gray-200",
              blue: "bg-blue-950 text-blue-100 border-blue-800",
              green: "bg-green-950 text-green-100 border-green-800",
              purple: "bg-purple-950 text-purple-100 border-purple-800",
            }[codeTheme]
          ),
        },
        defaultLanguage: "javascript",
      }),
      Placeholder.configure({ placeholder }),

      // Register TextStyle first
      TextStyle,

      // Then FontFamily & FontSize
      FontFamily.configure({ types: ["textStyle"] }),
      FontSize,

      TextAlign.configure({
        types: ["heading", "paragraph", "codeBlock"],
      }),
      Color.configure({ types: ["textStyle"] }),

      ResizableImage.configure({ HTMLAttributes: { class: "rounded-md" } }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Helper to insert an example code block
  const addCodeBlock = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .insertContent(
        `<pre><code class="language-javascript">// Example code</code></pre>`
      )
      .run();
  }, [editor]);

  return (
    <div
      ref={editorRef}
      className={cn("w-full h-full flex flex-col", className)}
    >
      {/* Sticky toolbar */}
      {editor && (
        <div ref={toolbarRef} style={toolbarStyle}>
          <Toolbar editor={editor} onAddCodeBlock={addCodeBlock} />
        </div>
      )}

      {/* Image-resize bubble menu */}
      {editor && (
        <BubbleMenu
          editor={editor}
          shouldShow={({ editor }) => editor.isActive("resizableImage")}
          tippyOptions={{ duration: 100, placement: "top" }}
        >
          <ImageMenu editor={editor} />
        </BubbleMenu>
      )}

      {/* The main editor area */}
      <div
        className="editor-pane flex-1 bg-white dark:bg-zinc-900 p-6 rounded-md border border-border overflow-auto"
        style={{ marginTop: contentMarginTop }}
      >
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none h-full"
        />
      </div>
    </div>
  );
}
