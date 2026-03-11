"use client";

import { useRef, useCallback } from "react";
import Editor, { type OnMount, type OnChange } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

interface CodeEditorProps {
  initialCode: string;
  onChange?: (value: string) => void;
  language?: string;
  fontSize?: number;
  readOnly?: boolean;
  showMinimap?: boolean;
  pyodideReady?: boolean;
  pyodideProgress?: number;
  pyodideMessage?: string;
}

export default function CodeEditor({
  initialCode,
  onChange,
  language = "python",
  fontSize = 14,
  readOnly = false,
  showMinimap = true,
  pyodideReady = true,
  pyodideProgress = 0,
  pyodideMessage = "Loading Python runtime...",
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

      // Define Algo Rich theme
      monaco.editor.defineTheme("algo-rich", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6A9955", fontStyle: "italic" },
          { token: "keyword", foreground: "D4AF37" },
          { token: "string", foreground: "CE9178" },
          { token: "number", foreground: "B5CEA8" },
          { token: "type", foreground: "4EC9B0" },
          { token: "function", foreground: "DCDCAA" },
          { token: "variable", foreground: "9CDCFE" },
          { token: "operator", foreground: "D4D4D4" },
          { token: "delimiter", foreground: "D4D4D4" },
          { token: "identifier", foreground: "E8E8E8" },
        ],
        colors: {
          "editor.background": "#0A1128",
          "editor.foreground": "#E8E8E8",
          "editorLineNumber.foreground": "#D4AF37",
          "editorLineNumber.activeForeground": "#F4E4C1",
          "editor.selectionBackground": "#1E3A5F80",
          "editor.lineHighlightBackground": "#1E3A5F30",
          "editorCursor.foreground": "#D4AF37",
          "editorIndentGuide.background": "#1E3A5F40",
          "editorIndentGuide.activeBackground": "#D4AF3740",
          "editor.selectionHighlightBackground": "#D4AF3720",
          "editorBracketMatch.background": "#D4AF3730",
          "editorBracketMatch.border": "#D4AF3760",
          "editorWidget.background": "#0A1128",
          "editorWidget.border": "#1E3A5F",
          "editorSuggestWidget.background": "#0A1128",
          "editorSuggestWidget.border": "#1E3A5F",
          "editorSuggestWidget.selectedBackground": "#1E3A5F",
          "input.background": "#0A1128",
          "input.border": "#1E3A5F",
          "focusBorder": "#D4AF37",
          "scrollbarSlider.background": "#1E3A5F40",
          "scrollbarSlider.hoverBackground": "#1E3A5F80",
        },
      });

      monaco.editor.setTheme("algo-rich");

      // Focus editor
      editor.focus();
    },
    []
  );

  const handleChange: OnChange = useCallback(
    (value) => {
      if (onChange && value !== undefined) {
        onChange(value);
      }
    },
    [onChange]
  );

  return (
    <div className="h-full w-full relative">
      <Editor
        defaultLanguage={language}
        defaultValue={initialCode}
        onChange={handleChange}
        onMount={handleMount}
        theme="algo-rich"
        options={{
          fontSize,
          fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
          fontLigatures: true,
          minimap: { enabled: showMinimap, maxColumn: 80 },
          lineNumbers: "on",
          tabSize: 4,
          insertSpaces: true,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderWhitespace: "selection",
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true, indentation: true },
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          padding: { top: 12, bottom: 12 },
          readOnly,
          domReadOnly: readOnly,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          contextmenu: true,
          folding: true,
          foldingHighlight: true,
          showFoldingControls: "mouseover",
        }}
        loading={
          <div className="h-full flex items-center justify-center bg-[#0A1128]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-light/60 text-sm">Loading editor...</span>
            </div>
          </div>
        }
      />
      {/* Pyodide loading overlay — shown until Python runtime is ready */}
      {!pyodideReady && (
        <div className="absolute inset-0 bg-[#0A0F24]/90 flex flex-col items-center justify-center z-10 rounded">
          <div className="w-64 space-y-4 px-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-[#E5A829] border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span className="text-white/80 text-sm font-medium">{pyodideMessage}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E5A829] rounded-full transition-all duration-500"
                style={{ width: `${pyodideProgress}%` }}
              />
            </div>
            <p className="text-white/30 text-xs text-center">
              ⚡ First load ~8s — instant on return visits
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
