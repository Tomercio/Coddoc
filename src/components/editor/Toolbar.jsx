import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaCode,
} from "react-icons/fa";
import { GoListOrdered, GoListUnordered } from "react-icons/go";
import { BsBlockquoteLeft } from "react-icons/bs";
import { MdFormatColorText, MdFormatClear, MdImage } from "react-icons/md";
import { TbSeparator } from "react-icons/tb";
import { BiAlignLeft, BiAlignMiddle, BiAlignRight } from "react-icons/bi";
import { cn } from "../../lib/utils";
import ColorPicker from "./ColorPicker";

const ToolbarButton = ({
  onClick,
  active,
  disabled,
  title,
  className,
  children,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors",
      active &&
        "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}
    disabled={disabled}
    title={title}
  >
    {children}
  </button>
);

export const Toolbar = ({ editor, onAddCodeBlock }) => {
  const imageInputRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);

  const fontFamilies = [
    "Arial",
    "Georgia",
    "Times New Roman",
    "Courier New",
    "Verdana",
    "Tahoma",
    "Comic Sans MS",
    "Monospace",
  ];
  const [fontFamily, setFontFamily] = useState("");

  const fontSizes = [
    "8px",
    "10px",
    "12px",
    "14px",
    "16px",
    "18px",
    "24px",
    "32px",
    "48px",
  ];
  const [fontSize, setFontSize] = useState("16px");

  useEffect(() => {
    const handler = (e) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(e.target)
      ) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!editor) return null;
  const isActive = useCallback(
    (type, opts = {}) => editor.isActive(type, opts),
    [editor]
  );

  // Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const src = evt.target.result;
      if (editor.commands.insertResizableImage) {
        editor
          .chain()
          .focus()
          .insertResizableImage({ src, alt: file.name, title: file.name })
          .run();
      } else {
        editor
          .chain()
          .focus()
          .insertContent(
            `<div data-type="resizable-image" style="width:100%">
               <img src="${src}" alt="${file.name}" title="${file.name}" />
             </div>`
          )
          .run();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Text color
  const setTextColor = (color) => {
    editor.chain().focus().setColor(color).run();
  };

  // Apply font size using our new command
  const applyFontSize = (e) => {
    const size = e.target.value;
    setFontSize(size);
    editor.chain().focus().setFontSize(size).run();
  };

  // Apply font family using the provided command
  const applyFontFamily = (e) => {
    const fam = e.target.value;
    setFontFamily(fam);
    editor.chain().focus().setFontFamily(fam).run();
  };

  const applyAlign = (alignment) => {
    editor.chain().focus().setTextAlign(alignment).run();
  };

  return (
    <div className="toolbar sticky top-0 z-10 flex flex-wrap items-center gap-1 bg-background border-b border-border p-2 rounded-t-md">
      {/* Text styling */}
      <div className="flex items-center gap-1 border-r pr-2 mr-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={isActive("bold")}
          title="Bold"
        >
          <FaBold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={isActive("italic")}
          title="Italic"
        >
          <FaItalic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={isActive("underline")}
          title="Underline"
        >
          <FaUnderline size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={isActive("strike")}
          title="Strikethrough"
        >
          <FaStrikethrough size={16} />
        </ToolbarButton>
        <div className="relative" ref={colorPickerRef}>
          <ToolbarButton
            onClick={() => setShowColorPicker((s) => !s)}
            title="Text color"
          >
            <MdFormatColorText size={16} />
          </ToolbarButton>
          {showColorPicker && (
            <ColorPicker
              onSelectColor={setTextColor}
              onClose={() => setShowColorPicker(false)}
            />
          )}
        </div>
      </div>

      {/* Font family picker */}
      <div className="flex items-center gap-1 border-r pr-2 mr-1">
        <select
          value={fontFamily}
          onChange={applyFontFamily}
          className="bg-background text-sm p-2 rounded border border-gray-300 dark:border-zinc-700"
          title="Font family"
        >
          <option value="">Font…</option>
          {fontFamilies.map((ff) => (
            <option key={ff} value={ff}>
              {ff}
            </option>
          ))}
        </select>
      </div>

      {/* Font size picker */}
      <div className="flex items-center gap-1 border-r pr-2 mr-1">
        <select
          value={fontSize}
          onChange={applyFontSize}
          className="bg-background text-sm p-2 rounded border border-gray-300 dark:border-zinc-700"
          title="Font size"
        >
          {fontSizes.map((sz) => (
            <option key={sz} value={sz}>
              {sz.replace("px", "")}
            </option>
          ))}
        </select>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 border-r pr-2 mr-1">
        <ToolbarButton
          onClick={() => applyAlign("left")}
          active={isActive("textAlign", { alignment: "left" })}
          title="Align left"
        >
          <BiAlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyAlign("center")}
          active={isActive("textAlign", { alignment: "center" })}
          title="Align center"
        >
          <BiAlignMiddle size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => applyAlign("right")}
          active={isActive("textAlign", { alignment: "right" })}
          title="Align right"
        >
          <BiAlignRight size={16} />
        </ToolbarButton>
      </div>

      {/* Lists & blocks */}
      <div className="flex items-center gap-1 border-r pr-2 mr-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={isActive("bulletList")}
          title="Bullet list"
        >
          <GoListUnordered size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={isActive("orderedList")}
          title="Numbered list"
        >
          <GoListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={isActive("blockquote")}
          title="Blockquote"
        >
          <BsBlockquoteLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={onAddCodeBlock}
          active={isActive("codeBlock")}
          title="Code block"
        >
          <FaCode size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal rule"
        >
          <TbSeparator size={16} />
        </ToolbarButton>
      </div>

      {/* Image & clear */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => imageInputRef.current?.click()}
          title="Add image"
        >
          <MdImage size={16} />
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
          title="Clear formatting"
        >
          <MdFormatClear size={16} />
        </ToolbarButton>
      </div>
    </div>
  );
};
