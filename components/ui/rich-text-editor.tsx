"use client";

import { useRef, useState, useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Table as TableIcon,
  Image as ImageIcon,
  Loader2,
  Highlighter,
  Plus,
  X,
} from "lucide-react";
import { uploadFile } from "@/lib/storage";

const TEXT_COLORS = ["#0B0F15", "#E03131", "#2F9E44", "#1971C2", "#F08C00", "#9C36B5"];
const HIGHLIGHT_COLORS = ["#FFEB3B", "#8BF27A", "#7AD7F2", "#F2A6D0", "#F2C27A"];
const HIGHLIGHT_OPACITY = 0.45;

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function useCustomPalette(storageKey: string) {
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setColors(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
  }, [storageKey]);

  const persist = (next: string[]) => {
    setColors(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore storage write failures
    }
  };

  const addColor = (hex: string) => {
    if (!/^#([0-9a-fA-F]{6})$/.test(hex)) return;
    const normalized = hex.toUpperCase();
    if (colors.includes(normalized)) return;
    persist([...colors, normalized]);
  };

  const removeColor = (hex: string) => {
    persist(colors.filter((c) => c !== hex));
  };

  return { colors, addColor, removeColor };
}

const FONT_SIZES = [
  { label: "Pequeno", value: "12px" },
  { label: "Normal", value: "" },
  { label: "Médio", value: "18px" },
  { label: "Grande", value: "24px" },
  { label: "Enorme", value: "32px" },
];

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize || null,
            renderHTML: (attributes: { fontSize?: string | null }) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  uploadBucket?: string;
  uploadFolder?: string;
}

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`p-1.5 rounded-[8px] transition-colors ${
        active ? "bg-[#0B0F15] text-white" : "text-[#545F6C] hover:bg-[#F3F5F9]"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({
  editor,
  uploadBucket,
  uploadFolder,
}: {
  editor: Editor;
  uploadBucket: string;
  uploadFolder: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const currentColor = editor.getAttributes("textStyle").color || "#0B0F15";
  const [hexInput, setHexInput] = useState(currentColor);
  const [highlightHexInput, setHighlightHexInput] = useState("#FFEB3B");

  const customTextColors = useCustomPalette("richTextEditor:customTextColors");
  const customHighlightColors = useCustomPalette("richTextEditor:customHighlightColors");

  const applyHex = (raw: string) => {
    const hex = raw.startsWith("#") ? raw : `#${raw}`;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) {
      editor.chain().focus().setColor(hex).run();
    }
  };

  const applyHighlightHex = (raw: string) => {
    const hex = raw.startsWith("#") ? raw : `#${raw}`;
    if (/^#([0-9a-fA-F]{6})$/.test(hex)) {
      editor.chain().focus().setHighlight({ color: hexToRgba(hex, HIGHLIGHT_OPACITY) }).run();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, uploadBucket, uploadFolder);
      editor.chain().focus().setImage({ src: url }).run();
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-0.5 flex-wrap border-b border-[#EAECEF] px-2 py-1.5">
      <ToolbarButton title="Negrito" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Itálico" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="w-3.5 h-3.5" />
      </ToolbarButton>

      <div className="w-px h-4 bg-[#EAECEF] mx-1" />

      <select
        title="Tamanho da fonte"
        value={editor.getAttributes("textStyle").fontSize || ""}
        onChange={(e) => {
          const size = e.target.value;
          if (size) {
            editor.chain().focus().setFontSize(size).run();
          } else {
            editor.chain().focus().unsetFontSize().run();
          }
        }}
        className="h-[26px] rounded-[6px] border border-[#EAECEF] bg-white px-1.5 text-xs text-[#545F6C] focus:outline-none focus:ring-1 focus:ring-[#1E63FF]"
      >
        {FONT_SIZES.map((s) => (
          <option key={s.label} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <div className="w-px h-4 bg-[#EAECEF] mx-1" />

      <ToolbarButton title="Lista" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton title="Lista numerada" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="w-3.5 h-3.5" />
      </ToolbarButton>

      <div className="w-px h-4 bg-[#EAECEF] mx-1" />

      <div className="relative">
        <ToolbarButton
          title="Cor do texto"
          onClick={() => {
            setHexInput(currentColor);
            setShowColors((s) => !s);
          }}
        >
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full border border-[#EAECEF]" style={{ backgroundColor: currentColor }} />
          </span>
        </ToolbarButton>
        {showColors && (
          <>
            <div className="fixed inset-0 z-0" onClick={() => setShowColors(false)} />
            <div className="absolute z-10 top-full left-0 mt-1 bg-white border border-[#EAECEF] rounded-[10px] p-2 shadow-lg w-[180px]">
            <div className="flex gap-1 flex-wrap mb-2">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().setColor(c).run();
                    setHexInput(c);
                  }}
                  className="w-5 h-5 rounded-full border border-[#EAECEF]"
                  style={{ backgroundColor: c }}
                />
              ))}
              <button
                type="button"
                title="Remover cor"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColors(false);
                }}
                className="w-5 h-5 rounded-full border border-[#EAECEF] bg-white text-[8px] text-[#9AA0A6]"
              >
                ×
              </button>
            </div>
            {customTextColors.colors.length > 0 && (
              <div className="flex gap-1 flex-wrap mb-2 pb-2 border-b border-[#EAECEF]">
                {customTextColors.colors.map((c) => (
                  <div key={c} className="relative group">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        editor.chain().focus().setColor(c).run();
                        setHexInput(c);
                      }}
                      className="w-5 h-5 rounded-full border border-[#EAECEF]"
                      style={{ backgroundColor: c }}
                    />
                    <button
                      type="button"
                      title="Remover da paleta"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => customTextColors.removeColor(c)}
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#0B0F15] text-white items-center justify-center hidden group-hover:flex"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={/^#([0-9a-fA-F]{6})$/.test(currentColor) ? currentColor : "#0b0f15"}
                onChange={(e) => {
                  setHexInput(e.target.value);
                  applyHex(e.target.value);
                }}
                className="w-7 h-7 rounded-[6px] border border-[#EAECEF] cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                onBlur={() => applyHex(hexInput)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyHex(hexInput);
                  }
                }}
                placeholder="#F00000"
                className="w-full h-7 rounded-[6px] border border-[#EAECEF] px-2 text-xs text-[#0B0F15] focus:outline-none focus:ring-1 focus:ring-[#1E63FF]"
              />
              <button
                type="button"
                title="Salvar cor na paleta"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => customTextColors.addColor(hexInput)}
                className="w-7 h-7 shrink-0 rounded-[6px] border border-[#EAECEF] flex items-center justify-center text-[#545F6C] hover:bg-[#F3F5F9]"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            </div>
          </>
        )}
      </div>

      <div className="relative">
        <ToolbarButton
          title="Marca-texto"
          active={editor.isActive("highlight")}
          onClick={() => {
            setShowHighlights((s) => !s);
          }}
        >
          <Highlighter className="w-3.5 h-3.5" />
        </ToolbarButton>
        {showHighlights && (
          <>
            <div className="fixed inset-0 z-0" onClick={() => setShowHighlights(false)} />
            <div className="absolute z-10 top-full left-0 mt-1 bg-white border border-[#EAECEF] rounded-[10px] p-2 shadow-lg w-[180px]">
            <div className="flex gap-1 flex-wrap mb-2">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().setHighlight({ color: hexToRgba(c, HIGHLIGHT_OPACITY) }).run();
                    setHighlightHexInput(c);
                  }}
                  className="w-5 h-5 rounded-full border border-[#EAECEF]"
                  style={{ backgroundColor: hexToRgba(c, HIGHLIGHT_OPACITY) }}
                />
              ))}
              <button
                type="button"
                title="Remover marca-texto"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  setShowHighlights(false);
                }}
                className="w-5 h-5 rounded-full border border-[#EAECEF] bg-white text-[8px] text-[#9AA0A6]"
              >
                ×
              </button>
            </div>
            {customHighlightColors.colors.length > 0 && (
              <div className="flex gap-1 flex-wrap mb-2 pb-2 border-b border-[#EAECEF]">
                {customHighlightColors.colors.map((c) => (
                  <div key={c} className="relative group">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        editor.chain().focus().setHighlight({ color: hexToRgba(c, HIGHLIGHT_OPACITY) }).run();
                        setHighlightHexInput(c);
                      }}
                      className="w-5 h-5 rounded-full border border-[#EAECEF]"
                      style={{ backgroundColor: hexToRgba(c, HIGHLIGHT_OPACITY) }}
                    />
                    <button
                      type="button"
                      title="Remover da paleta"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => customHighlightColors.removeColor(c)}
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#0B0F15] text-white items-center justify-center hidden group-hover:flex"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={/^#([0-9a-fA-F]{6})$/.test(highlightHexInput) ? highlightHexInput : "#FFEB3B"}
                onChange={(e) => {
                  setHighlightHexInput(e.target.value);
                  applyHighlightHex(e.target.value);
                }}
                className="w-7 h-7 rounded-[6px] border border-[#EAECEF] cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={highlightHexInput}
                onChange={(e) => setHighlightHexInput(e.target.value)}
                onBlur={() => applyHighlightHex(highlightHexInput)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyHighlightHex(highlightHexInput);
                  }
                }}
                placeholder="#FFEB3B"
                className="w-full h-7 rounded-[6px] border border-[#EAECEF] px-2 text-xs text-[#0B0F15] focus:outline-none focus:ring-1 focus:ring-[#1E63FF]"
              />
              <button
                type="button"
                title="Salvar cor na paleta"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => customHighlightColors.addColor(highlightHexInput)}
                className="w-7 h-7 shrink-0 rounded-[6px] border border-[#EAECEF] flex items-center justify-center text-[#545F6C] hover:bg-[#F3F5F9]"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            </div>
          </>
        )}
      </div>

      <div className="w-px h-4 bg-[#EAECEF] mx-1" />

      <ToolbarButton
        title="Inserir tabela"
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        <TableIcon className="w-3.5 h-3.5" />
      </ToolbarButton>

      <ToolbarButton title="Inserir imagem" onClick={() => fileInputRef.current?.click()}>
        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
      </ToolbarButton>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  uploadBucket = "documentos",
  uploadFolder = "conteudo",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontSize,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "rich-text-content min-h-[100px] px-3 py-2 text-sm text-[#0B0F15] focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="w-full rounded-[12px] border border-[#EAECEF] bg-white focus-within:ring-2 focus-within:ring-[#1E63FF] overflow-hidden">
      <Toolbar editor={editor} uploadBucket={uploadBucket} uploadFolder={uploadFolder} />
      <EditorContent editor={editor} />
    </div>
  );
}
